import { useGalleryStore } from '@/store';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export function useSearch() {
  const { t } = useI18n({ useScope: 'global' });
  const gallery = useGalleryStore();
  const filterGroup = ref(gallery.group);

  function searchComponent(keyword: string) {
    if (keyword) {
      filterGroup.value = gallery.group.map(group => {
        const { list: galleryList, ...rest } = group;
        const list = galleryList.filter(item => {
          const rexExp = new RegExp(keyword, 'i');
          return rexExp.test(item.name) || rexExp.test(t(`gallery.${item.name}`));
        });
        return { list, ...rest };
      });
    } else {
      filterGroup.value = gallery.group;
    }
  }

  return { filterGroup, searchComponent };
}
