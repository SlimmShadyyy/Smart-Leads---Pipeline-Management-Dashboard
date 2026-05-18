import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// 1. Define the TypeScript Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Sales User';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2. Define the Mongoose Schema
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Sales User'], default: 'Sales User' },
  },
  { timestamps: true }
);

// 3. Pre-save hook to hash the password securely
UserSchema.pre<IUser>('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;
  
  // No need for try/catch or next(). Mongoose handles async rejections automatically!
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 4. Helper method to compare passwords during login
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);