import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/services/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/pages/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'sale',
    loadChildren: () => import('./sales/pages/sale/sale.module').then( m => m.SalePageModule)
  },
  {
    path: '**',
    redirectTo: 'sale',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
