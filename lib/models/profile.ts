import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
}

const ProfileSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  imageUrl: { type: String },
  email: { type: String, required: true },
});

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
