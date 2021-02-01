import { Component } from 'vue';

export type Components = Data<{ cName: string; component: Component }>;

export type ChartGroup = { name: string; icon: string; components: Components };
