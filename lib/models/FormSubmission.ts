import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFormSubmission extends Document {
  formId: mongoose.Types.ObjectId;
  pageKey: string;
  userEmail?: string;
  userName?: string;
  data: any; // Store submission data as flexible JSON object
  createdAt: Date;
  updatedAt: Date;
}

const FormSubmissionSchema = new Schema<IFormSubmission>(
  {
    formId: {
      type: Schema.Types.ObjectId,
      ref: 'Form',
      required: true,
      index: true,
    },
    pageKey: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      index: true,
    },
    userName: {
      type: String,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model re-compilation during hot reload in development
const FormSubmission: Model<IFormSubmission> =
  mongoose.models.FormSubmission ||
  mongoose.model<IFormSubmission>('FormSubmission', FormSubmissionSchema);

export default FormSubmission;

