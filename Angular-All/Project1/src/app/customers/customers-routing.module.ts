import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'list',
    component: CustomerListComponent
  },
  {
    path: '',
    component: CustomerHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
