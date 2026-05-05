import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  course: string;
  subject: string;
  type: 'PYQ' | 'Notes' | 'Video';
  title: string;
  fileUrl?: string;
  videoLink?: string;
  year?: number;
  uploadedBy?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const ResourceSchema = new Schema<IResource>({
  course: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, enum: ['PYQ', 'Notes', 'Video'], required: true },
  title: { type: String, required: true },
  fileUrl: { type: String }, // For PDFs
  videoLink: { type: String }, // For YouTube
  year: { type: Number },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
