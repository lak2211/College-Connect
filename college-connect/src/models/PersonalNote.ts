import mongoose, { Schema, Document } from 'mongoose';

export interface IPersonalNote extends Document {
  user: mongoose.Schema.Types.ObjectId;
  video: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  subject: string;
  createdAt: Date;
}

const PersonalNoteSchema = new Schema<IPersonalNote>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  subject: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PersonalNote || mongoose.model<IPersonalNote>('PersonalNote', PersonalNoteSchema);
