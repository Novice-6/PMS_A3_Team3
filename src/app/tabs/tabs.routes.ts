import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'list', // 对应Tab 1
        loadComponent: () => import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'add', // 对应Tab 2
        loadComponent: () => import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'manage', // 对应Tab 3
        loadComponent: () => import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'privacy', // 对应Tab 4
        loadComponent: () => import('../tab4/tab4.page').then((m) => m.Tab4Page),
      },
      {
        path: '',
        redirectTo: '/tabs/list', // 默认一打开 APP 进列表页
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/list',
    pathMatch: 'full',
  },
];