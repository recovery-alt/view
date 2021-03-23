import { Component } from 'vue';

export type Gallery = {
  type?: string;
  name: string;
  component: Component;
};

export type Group = {
  name: string;
  icon: string;
  components: Data<() => Promise<{ [key: string]: Gallery }>>;
};

export type GalleryGroup = Array<{
  groupName: string;
  icon: string;
  list: Array<Gallery>;
}>;
