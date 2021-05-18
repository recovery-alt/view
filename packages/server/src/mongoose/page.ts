import { Data } from '@/typings';
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
  components: Array,
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
  components: Array<{
    id: string;
    component: string;
    label: string;
    group?: Array<unknown>;
    propsData?: unknown;
    locked?: boolean;
    icon?: string;
    attr?: Array<Data>;
    animations?: Array<string>;
    events?: Array<Event>;
    style: Data;
  }>;
}

const page: Model<Page> = model<Page>('page', schema);

export { page };
