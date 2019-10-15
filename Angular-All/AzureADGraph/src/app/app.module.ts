import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component'; 
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ResultComponent } from './result/result.component';
import { PChartComponent } from './pchart/pchart.component';
import { PatientService } from './services/patient.service';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { MsAdalAngular6Module } from 'microsoft-adal-angular6';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { AppConfig } from './app.config';

PlotlyModule.plotlyjs = PlotlyJS;

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch:'full', canActivate: [AuthenticationGuard]},
   { path: 'result', component: ResultComponent, pathMatch:'full' }
]; 

@NgModule({
  declarations: [
    AppComponent
    ,	HeaderComponent
    ,	HomeComponent 
	,	FooterComponent
	,	PChartComponent
	,	ResultComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' })
    ,	HttpClientModule
    ,	FormsModule
	,	ReactiveFormsModule
	,	PlotlyModule
	,	MsAdalAngular6Module.forRoot(AppConfig.AZURE_API_CONFIG)
	, 	RouterModule.forRoot(routes)
	,	BsDropdownModule.forRoot() 
  ],
  providers: [ 
	AuthenticationGuard
	,	PatientService
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
