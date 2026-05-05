import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  topicId: mongoose.Schema.Types.ObjectId;
  completed: boolean;
  completedAt: Date;
}

const ProgressSchema = new Schema<IProgress>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Syllabus', required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
});

// Ensure a user can only have one progress record per topic
ProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

export default mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);
