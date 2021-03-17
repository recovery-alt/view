import { model, Schema, Document, Model } from 'mongoose';

const schema = new Schema({
  title: String,
  description: String,
  author: String,
  width: Number,
  height: Number,
  pageMode: Number,
  backgroundColor: String,
  scale: Number,
  zoom: Number,
  gap: Number,
  url: String,
  config: Object,
});

export interface Page extends Document {
  title: string;
  description: string;
  author: string;
  width: number;
  height: number;
  pageMode: number;
  backgroundColor: string;
  scale: number;
  zoom: number;
  gap: number;
  url: string;
  config: Array<{
    id: string;
    component: string;
    label: string;
    propValue?: string;
    icon?: string;
    animations?: Array<string>;
    style: Record<string, unknown>;
  }>;
}

const page: Model<Page> = model<Page>('page', schema);

export { page };
