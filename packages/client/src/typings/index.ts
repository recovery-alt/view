import { Component } from 'vue';

export type Gallery = {
  name: string;
  type: string;
  component: Component;
};

export type Group = {
  name: string;
  icon: string;
  components: Data<Gallery>;
};

export type GalleryGroup = Array<{
  groupName: string;
  icon: string;
  list: Array<Gallery>;
}>;
