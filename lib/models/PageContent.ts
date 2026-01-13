import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPageContent extends Document {
  pageKey: string;
  locale: string;
  content: any; // JSON content
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>(
  {
    pageKey: {
      type: String,
      required: true,
      index: true,
    },
    locale: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries
PageContentSchema.index({ pageKey: 1, locale: 1 }, { unique: true });

// Prevent model re-compilation during hot reload in development
const PageContent: Model<IPageContent> =
  mongoose.models.PageContent ||
  mongoose.model<IPageContent>('PageContent', PageContentSchema);

export default PageContent;

