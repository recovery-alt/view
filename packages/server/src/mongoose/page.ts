import { model, Schema, Document, Model } from 'mongoose';

const schema = new Schema({
  title: String,
  description: String,
  author: String,
  width: Number,
  height: Number,
  pageMode: Number,
  config: Object,
});

export interface Page extends Document {
  title: string;
  description: string;
  author: string;
  width: number;
  height: number;
  pageMode: number;
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
