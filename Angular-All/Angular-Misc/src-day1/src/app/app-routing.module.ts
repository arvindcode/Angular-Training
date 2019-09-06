import { DataComponent } from './data/data.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path:'home',
    component: HomeComponent,
    children:[
      {
          path:'profile',
         component: ProfileComponent
         }    
     ]
  },
  {
    path:'data',
    component: DataComponent
  },
  {
    path:'employees',
    loadChildren:'./employees/employees.module#EmployeesModule'
  },
  {
    path:'orders',
    loadChildren:'./orders/orders.module#OrdersModule'
  }
  ,
  {
    path:'',
    redirectTo:'home',
    pathMatch:'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
