import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  type: string;
  subjects: string[];
}

const CourseSchema = new Schema<ICourse>({
  name: { type: String, required: true }, // e.g. B.Tech CSE
  type: { type: String, required: true }, // Technical
  subjects: [{ type: String }],
});

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
