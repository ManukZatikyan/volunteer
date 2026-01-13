import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFormField extends Document {
  id: string;
  type: 'input' | 'textarea' | 'select';
  label: string;
  labelHy?: string; // Armenian label
  placeholder?: string;
  placeholderHy?: string; // Armenian placeholder
  required: boolean;
  options?: string[]; // For select type
  optionsHy?: string[]; // Armenian options for select
}

export interface IFormStep extends Document {
  id: string;
  title: string;
  titleHy?: string; // Armenian title
  fields: IFormField[];
}

export interface IForm extends Document {
  pageKey: string;
  steps: IFormStep[];
  createdAt: Date;
  updatedAt: Date;
}

const FormFieldSchema = new Schema<IFormField>({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['input', 'textarea', 'select'] 
  },
  label: { type: String, required: true },
  labelHy: { type: String },
  placeholder: { type: String },
  placeholderHy: { type: String },
  required: { type: Boolean, default: false },
  options: { type: [String] }, // For select type
  optionsHy: { type: [String] }, // Armenian options for select
}, { _id: false });

const FormStepSchema = new Schema<IFormStep>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  titleHy: { type: String },
  fields: { type: [FormFieldSchema], default: [] },
}, { _id: false });

const FormSchema = new Schema<IForm>(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    steps: {
      type: [FormStepSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model re-compilation during hot reload in development
const Form: Model<IForm> =
  mongoose.models.Form ||
  mongoose.model<IForm>('Form', FormSchema);

export default Form;

