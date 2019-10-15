import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PatientService } from './../services/patient.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Study } from './../models/study.model';
import { StudyId } from './../models/studyid.model';
import { Patient } from './../models/patient.model';
import { AppConfig } from './../app.config';
declare var $: any;
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
	
	studyLists:any=[];
	idLists:any = [];
	studyName:any=null;
	dmId:any;
	
	studyForm = new FormGroup({
		studyName: new FormControl(''),
		studyId: new FormControl(''),
		dmId: new FormControl(''),
		medicationId: new FormControl(''),
	});
	
	@ViewChild('dataContainer') dataContainer: ElementRef;
	 
	constructor(private patientService: PatientService) {}
	
	ngOnInit() {
		this.patientService.getStudyLists()
		.subscribe((resp: Study)  => {
			if(resp.StudyNameList && resp.StudyNameList.constructor === Array && resp.StudyNameList.length) {
				this.studyLists	=	resp.StudyNameList;
				this.studyForm.get("studyName").setValue(this.studyLists[0]);
				this.getIdLists(this.studyLists[0], 'onload');
			}
			else {
				this.getIdLists(AppConfig.studyNoValue, 'onload');
				this.studyForm.get("studyName").setValue(AppConfig.studyNoValue);
			}
		});
	}
	
	/**
	@param evt element object
	@param type onload or change. o
	*/
	getIdLists(evt, type) {
		let val = evt;
		
		if(type === 'change') {
			val = evt.target.value;
			this.studyForm.get("dmId").setValue('');
			this.studyForm.get("medicationId").setValue('');	
			this.dmId = null;
		}			
	
		if(val) {
			this.studyName	=	val;
			this.patientService.getIdListsFromStudy(val)
			.subscribe((resp:StudyId)  => {
				//resp.IDVAL=null;
				if(resp.IDVAL && resp.IDVAL.constructor === Array && resp.IDVAL.length) {
					this.idLists	=	resp.IDVAL;
					
					//set first value by default and call getDmId function
					this.studyForm.get("studyId").setValue(resp.IDVAL[0]);
					this.getDmId(resp.IDVAL[0], 'onload');
				}
				else {
					this.idLists	= [AppConfig.studyNoValue];
					this.studyForm.get("studyId").setValue(AppConfig.studyNoValue);					
					
					//set dmId as null when response has no valid data
					this.dmId	=	AppConfig.studyNoValue;
					this.studyForm.get("dmId").setValue(AppConfig.studyNoValue);
					this.studyForm.get("medicationId").setValue(AppConfig.studyNoValue);
				}
			});
		}
	}
	
	getDmId(evt, type) {
		let val = (type == 'onload') ? evt : evt.target.value;

		if(val){
			this.patientService.getDmId(this.studyName, val)
			.subscribe((resp: Patient)  => {			
				let medID:any;
				
				if(resp.medicationid && resp.medicationid.constructor === Array && resp.medicationid.length)
					medID	=	resp.medicationid.join();
				else  
					medID	=	resp.medicationid;
				
				this.studyForm.get("dmId").setValue(resp.Dmid);
				this.studyForm.get("medicationId").setValue(medID);
				
				if(resp.Dmid && resp.Dmid != AppConfig.studyNoValue) {
					this.dmId = resp.Dmid					
				}
				else {
					this.dmId	=	AppConfig.studyNoValue;
				}
			});
		}		
	}
}
