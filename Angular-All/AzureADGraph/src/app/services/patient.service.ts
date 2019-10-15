import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from './../app.config';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Injectable({
  providedIn: 'root'
})

export class PatientService {
  
  access_token:any="";
  headers:any;
  
  constructor(private http: HttpClient, private adalSvc: MsAdalAngular6Service) { 
	this.adalSvc.acquireToken('https://graph.microsoft.com').subscribe((token: string) => {
		this.access_token	=	token;
	});
	
	this.headers = new HttpHeaders();
	this.headers	=	this.headers.set('access_token', this.access_token);
  }
   
  ngOnInit() {}
  
  getStudyLists() {
	  return this.http.get(AppConfig.API_URL+"study_name?access_token="+this.access_token, {headers: this.headers});
  }
  
  getIdListsFromStudy(study_name) {
	  return this.http.get(AppConfig.API_URL+"study_id?study_name="+study_name+"&&access_token="+this.access_token, {headers: this.headers});
  }
  
  getDmId(study_name, id) {
	  return this.http.get(AppConfig.API_URL+"patient_info?study_id="+id+"&study_name="+study_name+"&&access_token="+this.access_token, {headers: this.headers});
  }
  
  getPatientData(dmId) {		
		return this.http.get(AppConfig.API_URL+"patient_all_data?dmid="+dmId+"&&access_token="+this.access_token, {headers: this.headers});
  }
  
  getSvg() {
	  return this.http.get(AppConfig.API_URL+"svg_image_chart", {
		responseType: 'blob'
	  });
  }
}
