import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  type: {
    type: String,
    enum: ["Exam", "Assignment", "Lab", "Lecture", "Other"],
    default: "Other",
  },
  time: String,
  reminded: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
