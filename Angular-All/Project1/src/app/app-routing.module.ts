import { CustomerHomeComponent } from './customers/customer-home/customer-home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';


const routes: Routes = [
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(mod => mod.CustomersModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
