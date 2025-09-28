import React, { useState } from 'react';
import PhotoUpload from './PhotoUpload';
import UserForm from './UserForm';
import ActionButtons from './Button';
import { useRouter } from 'next/router';
import useRequest from '@/hooks/use-request';
import { uploadImage } from '@/assets/firebase/uploadImage';

interface UpdateUserApiBody {
  userName?: string;
  imageUrl?: string;
}

interface SettingProps {
  username: string;
  photoUrl: string;
  userId: string;
  onUserUpdate: () => void;
}

const Setting: React.FC<SettingProps> = ({ username, photoUrl, userId, onUserUpdate }) => {
  const router = useRouter();
  const [photo, setPhoto] = useState(photoUrl);
  const [newUsername, setNewUsername] = useState(username);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { doRequest, errors } = useRequest({
    url: `/api/users/${userId}`,
    method: 'patch',
    body: {} as UpdateUserApiBody,
    onSuccess: () => {
      setNewUsername('');
      setIsEditing(false); // Set editing mode to false after saving
      onUserUpdate(); // Trigger re-fetch of user data
      router.push('/profile');
    },
    onError: (err) => {
      setNewUsername('');
      console.error('Error saving changes:', err);
    },
  });

  const getUpdateBody = (): UpdateUserApiBody => {
    const body: UpdateUserApiBody = {};

    if (newUsername !== username && newUsername.length > 0) {
      body.userName = newUsername;
    }

    if (photo !== photoUrl) {
      body.imageUrl = photo;
    }

    return body;
  };

  const handlePhotoChange = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const tempUrl = URL.createObjectURL(file);
      setPhoto(tempUrl);

      const downloadURL = await uploadImage(file, {
        folderPath: `users/${userId}`,
      });

      setPhoto(downloadURL);
      console.log('Photo uploaded successfully:', downloadURL);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError('Failed to upload image. Please try again.');
      setPhoto(photoUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetPassword = () => {
    router.push('/auth/reset-password/email');
  };

  const handleSaveChanges = async () => {
    const updateBody = getUpdateBody();
    if (Object.keys(updateBody).length === 0) {
      console.log('No changes to save');
      setIsEditing(false); // Reset editing mode even if nothing to save
      return;
    }

    console.log('Saving profile with:', updateBody);

    setIsSaving(true);
    try {
      await doRequest({
        body: updateBody as UpdateUserApiBody,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main>
      <div className="flex gap-20 max-md:flex-col max-md:items-center">
        <PhotoUpload photoUrl={photo} onPhotoChange={handlePhotoChange} isUploading={isUploading} />

        <UserForm
          username={username}
          onUsernameChange={(value) => {
            setNewUsername(value);
            setIsEditing(true);
          }}
          isEditing={isEditing}
        />
      </div>

      {uploadError && <div className="text-red-500 mt-4">{uploadError}</div>}
      {errors && <div className="mt-4">{errors}</div>}

      <ActionButtons
        onResetPassword={handleResetPassword}
        onSaveChanges={handleSaveChanges}
        isSaving={isUploading || isSaving}
      />
    </main>
  );
};

export default Setting;
