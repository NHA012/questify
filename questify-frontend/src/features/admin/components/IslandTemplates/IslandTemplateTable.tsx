'use client';
import React, { useState } from 'react';
import styles from './IslandTemplateTable.module.css';
import Image from 'next/image';
import { IslandTemplate } from '@/features/admin/IslandTemplateData';
import Dialog from '../Dialog';

import { islandImage } from '@/assets/images';
export const TableHeader: React.FC = () => {
  return (
    <header className={styles.tableHeader}>
      <div className={styles.headerRow}>
        <div className={styles.idHeader}>ID</div>
        <div className={styles.nameHeader}>Name</div>
        <div className={styles.createdAtHeader}>Created At</div>
        <div className={styles.imageHeader}>Image</div>
        <div className={styles.actionsHeader}>Actions</div>
      </div>
    </header>
  );
};

// TableRow Component
interface TableRowProps {
  id: string;
  name: string;
  createdAt: string;
  imageUrl: string;
  onDeleteTemplate: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  id,
  name,
  createdAt,
  imageUrl,
  onDeleteTemplate,
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleStatusChangeRequest = () => {
    setShowDialog(true);
  };

  const confirmStatusChange = () => {
    onDeleteTemplate();
    setShowDialog(false);
  };

  const cancelStatusChange = () => {
    setShowDialog(false);
  };

  const logImageUrl = () => {
    if (imageUrl) {
      console.log(`Image URL for ${name}: ${imageUrl}`);
    }
  };
  logImageUrl();
  // Format date to a more readable format
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });

  return (
    <div className={styles.tableRow}>
      <div className={styles.rowContent}>
        <div className={styles.idCell}>{id}</div>
        <div className={styles.nameCell}>{name}</div>
        <div className={styles.createdAtCell}>{formattedDate}</div>
        <div className={styles.imageCell}>
          <Image
            src={islandImage.island1}
            alt={`${name} template`}
            width={50}
            height={50}
            className={styles.templateImage}
          />
        </div>
        <div className={styles.actionsCell}>
          <button
            className={styles.actionButton}
            onClick={handleStatusChangeRequest}
            aria-label="Delete template"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4H14"
                stroke="#E53935"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 4V2H10V4"
                stroke="#E53935"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 4.5V13C12.5 13.5304 12.2893 14.0391 11.9142 14.4142C11.5391 14.7893 11.0304 15 10.5 15H5.5C4.96957 15 4.46086 14.7893 4.08579 14.4142C3.71071 14.0391 3.5 13.5304 3.5 13V4.5"
                stroke="#E53935"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {showDialog && (
        <Dialog
          title={'Delete Island Template'}
          message={`Are you sure you want to delete ${name}?`}
          confirmText={'Delete'}
          cancelText="Cancel"
          onConfirm={confirmStatusChange}
          onCancel={cancelStatusChange}
        />
      )}
    </div>
  );
};

interface IslandTemplateTableProps {
  templates: IslandTemplate[];
  onDeleteTemplate: (templateId: string) => void;
}

const IslandTemplateTable: React.FC<IslandTemplateTableProps> = ({
  templates,
  onDeleteTemplate,
}) => {
  return (
    <div className={styles.tableContainer}>
      <TableHeader />
      <div className={styles.divider} />
      <div className={styles.tableBody}>
        {templates.length > 0 ? (
          templates.map((template) => (
            <TableRow
              key={template.id}
              id={template.id}
              name={template.name}
              createdAt={template.createdAt}
              imageUrl={template.imageUrl}
              onDeleteTemplate={() => onDeleteTemplate(template.id)}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No island templates match your criteria. Try adjusting your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IslandTemplateTable;
