import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
// 🌟 引入 HttpClient 服务，这样整个 App 就能发网络请求了
import { provideHttpClient } from '@angular/common/http'; 

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      mode: 'md' // 🌟 强制安卓模式，这会极大提高模拟器的渲染成功率
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // 🌟 将提供者注册到全局
    provideHttpClient(),
  ],
});