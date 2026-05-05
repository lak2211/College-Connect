import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  university?: string;
  course?: string;
  branch?: string;
  semester?: number;
  subjects?: string[];
  role: 'student' | 'admin';
  isVerified: boolean;
  verifyOtp?: string;
  verifyOtpExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  resetPasswordOtp?: string;
  resetPasswordOtpExpires?: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  university: { type: String, default: 'Maharshi Dayanand University (MDU)' },
  course: { type: String },
  branch: { type: String },
  semester: { type: Number },
  subjects: [{ type: String }],
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  verifyOtp: { type: String },
  verifyOtpExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  resetPasswordOtp: { type: String },
  resetPasswordOtpExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
