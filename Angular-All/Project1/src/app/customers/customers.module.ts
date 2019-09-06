import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';

@NgModule({
  declarations: [CustomerListComponent, CustomerHomeComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
