import 'vue';

declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router').RouterLink;
    RouterView: typeof import('vue-router').RouterView;
    AConfigProvider: typeof import('ant-design-vue').ConfigProvider;
    AButton: typeof import('ant-design-vue').Button;
    AInput: typeof import('ant-design-vue').Input;
    AInputSearch: typeof import('ant-design-vue/lib/input/Search').default;
    ATabs: typeof import('ant-design-vue').Tabs;
    ATabPane: typeof import('ant-design-vue/lib/tabs').TabPane;
    AForm: typeof import('ant-design-vue').Form;
    AFormItem: typeof import('ant-design-vue/lib/form/FormItem').default;
    AInputNumber: typeof import('ant-design-vue').InputNumber;
    ASelect: typeof import('ant-design-vue').Select;
    ASelectOption: typeof import('ant-design-vue').Select;
    ADrawer: typeof import('ant-design-vue').Drawer;
    ACollapse: typeof import('ant-design-vue').Collapse;
    ACollapsePanel: typeof import('ant-design-vue/lib/collapse/CollapsePanel').default;
    ATooltip: typeof import('ant-design-vue').Tooltip;
    // AEmpty: typeof import('ant-design-vue').Empty;
    AConfigProvider: typeof import('ant-design-vue').ConfigProvider;
    ALayout: typeof import('ant-design-vue').Layout;
    ALayoutSider: typeof import('ant-design-vue').Layout;
    ALayoutHeader: typeof import('ant-design-vue').Layout;
    ALayoutContent: typeof import('ant-design-vue').Layout;
    AMenu: typeof import('ant-design-vue').Menu;
    AMenuItem: typeof import('ant-design-vue/lib/menu/MenuItem').default;
    ATable: typeof import('ant-design-vue').Table;
    APagination: typeof import('ant-design-vue').Pagination;
    ADivider: typeof import('ant-design-vue').Divider;
    AAvatar: typeof import('ant-design-vue').Avatar;
    ADropdown: typeof import('ant-design-vue').Dropdown;
    APopover: typeof import('ant-design-vue').Popover;
    AModal: typeof import('ant-design-vue').Modal;
    ACheckbox: typeof import('ant-design-vue').Checkbox;
    ASlider: typeof import('ant-design-vue').Slider;
    ACol: typeof import('ant-design-vue').Col;
    ARow: typeof import('ant-design-vue').Row;
    ACarousel: typeof import('ant-design-vue').Carousel;
    ATimeline: typeof import('ant-design-vue').Timeline;
    ATimelineItem: typeof import('ant-design-vue/lib/timeline/TimelineItem').default;
    ASwitch: typeof import('ant-design-vue').Switch;
  }
  A;
}
