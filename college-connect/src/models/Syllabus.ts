import mongoose, { Schema, Document } from 'mongoose';

export interface ISyllabus extends Document {
  courseId: mongoose.Schema.Types.ObjectId;
  subject: string;
  topicTitle: string;
  description?: string;
}

const SyllabusSchema = new Schema<ISyllabus>({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  subject: { type: String, required: true },
  topicTitle: { type: String, required: true },
  description: { type: String }
});

export default mongoose.models.Syllabus || mongoose.model<ISyllabus>('Syllabus', SyllabusSchema);
