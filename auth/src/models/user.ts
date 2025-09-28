import mongoose from 'mongoose';
import { Password } from '../services/password';
import { UserRole, UserStatus } from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';

// An TS interfact that describes the properties
// that are required to create a new User
interface UserAttrs {
  userName: string;
  email: string;
  password: string;
  role: UserRole;
  imageUrl?: string;
  exp?: number;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  userName: string;
  email: string;
  password: string;
  role: UserRole;
  imageUrl?: string;
  exp?: number;
  status: UserStatus;
}

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
      default: UserRole.Student,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    exp: {
      type: Number,
      required: false,
      default: () => 0,
    },
    status: {
      type: String,
      require: true,
      enum: Object.values(UserStatus),
      default: () => UserStatus.Active,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }, // this is view level logic, not model level -> keep temporary like this
);

// middleware func implemented in mongoose
// this will be ran before 'save' is called
userSchema.pre('save', async function (done) {
  // only hash the password if it has been modified
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
