
import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { map } from "rxjs/operators";
import { CompileShallowModuleMetadata } from '@angular/compiler';
import { ChartConfig } from './pchart.config';
import { AppConfig } from './../app.config';
import { PatientService } from './../services/patient.service';

declare var $: any;
import * as $ from 'jquery';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';

@Component({
  selector: 'pchart-component',
  templateUrl: './pchart.component.html',
  styleUrls: ['./pchart.component.scss']
})

export class PChartComponent  {

	@Input() dmId:any;   
	ingestionHover : any;
	missedDoseHover : any;
	patchPairHover : any;
	coverageWindowHover : any;
	coverageDayHover : any;
	
	xaxisLable:any;
	maxTrtDayMasterChart:any;
	maxTrtDayCoveragePerDay:any;
	showChartBlock:boolean=true;
	errorChart:boolean=false;
	errorDmid:boolean=false;
	noDataErrorText:string=null;
	masterChart:string='master';
	incrementChart:string='increment';
		
	pchartData:any	=	{
		ingestion: {  },
		coverage: {  },
		patchPair: {  },
		missedDose: {  },
		patientLogin: {  },
		coverageSubplot: {}
	};
	
	pchartMasterData	=	{
		ingestion: {  },
		coverage: {  },
		patchPair: {  },
		missedDose: {  },
		patientLogin: {  }
	}
	
	pchartLayout:any	=	{
		ingestion: {  },
		coverage: {  },
		patchPair: {  },
		missedDose: {  },
		patientLogin: {  },
		coverageSubplot: {}		
	}
			
	patientLoginShapes:any;
	patientLoginShapesData:any	=	[];
	incrementalToggle:any=[];
	incrementalChartLayout:any;
	
	chartStatuses:any	=	{
		coverage		:	0
		,	patchPair	:	0
		,	ingestion	:	0
		,	missedDose	:	0
		,	loginInfo	:	0
	};
	
	errorTextArray:any	=	{
		'coverage' : 'Coverage'
		,	'patchPair' 	:	'Patch Pair'
		,	'ingestion'		:	'Ingestion'
		,	'missedDose'	:	'Missed Dose'
		,	'loginInfo'		:	'Patient Login'
		,	'master'		:	'Master Chart'
		,	'increment'		:	'Increment Chart'
	};
		
	constructor(private patientService: PatientService) {
		
	}
	
	ngOnChanges(val) {  
		$('.toggleBtn').removeClass('active');	
		this.showChartBlock	=	false;		
		this.incrementalToggle=[];
		
		//re-create chart by dmid
		if(val.dmId['currentValue']) {	  
			this.dmId = val.dmId['currentValue'];			
			
			if(this.dmId == AppConfig.studyNoValue) {
				this.showChartBlock		=	false;		
				this.errorDmid			=	true;
				this.noDataErrorText	=	"Study ID Empty!";
			}
			else {
				this.errorDmid			=	false;
				$('.toggleBtn').removeClass('active');
				this.getPatientAPIData();
			}
		}
	}
  
	ngOnInit() {}
	
	getRangeArray(n) {
		let rangeValue = [];
		
		for (let i = 1; i <= n; i++) {
			rangeValue.push(i);
		}
		
		return rangeValue;
	}
  	
	drawMasterChart() {
		let dataArray:any=[]
		,	masterChartLayout:any;
		
		if(this.chartStatuses['coverage'] == 0) {
			
			dataArray	=	[
				this.pchartData['coverageSubplot']
				, 	this.pchartMasterData['coverage']
			];			
			
			if(this.chartStatuses['ingestion'] == 0)
				dataArray.push(this.pchartMasterData['ingestion']);
			
			if(this.chartStatuses['patchPair'] == 0)
				dataArray.push(this.pchartMasterData['patchPair']);
			
			if(this.chartStatuses['missedDose'] == 0)
				dataArray.push(this.pchartMasterData['missedDose']);			

			masterChartLayout			=	this.pchartLayout['coverage'];
			masterChartLayout['shapes']	=	this.patientLoginShapes;
		}
		else {
			
			if(this.chartStatuses['ingestion'] == 0)
				dataArray.push(this.pchartData['ingestion']);
			
			if(this.chartStatuses['patchPair'] == 0)
				dataArray.push(this.pchartData['patchPair']);
			
			if(this.chartStatuses['missedDose'] == 0)
				dataArray.push(this.pchartData['missedDose']);

			masterChartLayout			=	this.incrementalChartLayout;
			masterChartLayout['shapes']	=	this.patientLoginShapesData;
		}
		 
		this.showPlotlyChart(dataArray, masterChartLayout, this.masterChart);			
		this.setSubplotGraphHeight();
	}
	
	
	showChart(param) {				
				
		if(this.dmId === null)
			return;
		
		$('#'+param).toggleClass('active');
				
		if(this.incrementalToggle.indexOf(param) === -1) {
			this.incrementalToggle.push(param);
		}
		else if(this.incrementalToggle.indexOf(param) >= 0) {
			let arrayIndex	=	this.incrementalToggle.indexOf(param);
			this.incrementalToggle.splice(arrayIndex, 1);
		}
				
		if(this.incrementalToggle.length === 0 || this.incrementalToggle.length === 1) {	
	
			let chartType	=	(this.incrementalToggle.length === 1) ? this.incrementalToggle[0] : 'master';			
		
			if(chartType === 'master') {		
				this.drawMasterChart();							
			}			
			else if(chartType == "coverage") {							
				this.pchartLayout['coverage']['xaxis'].range=[0.5, this.maxTrtDayCoveragePerDay + 0.5];
				this.pchartLayout['coverage']['shapes']=null;
				this.showPlotlyChart(
					[this.pchartData['coverageSubplot'], this.pchartMasterData['coverage']]
					,	this.pchartLayout['coverage']
					,	chartType
					,	this.chartStatuses['coverage']
				);
				this.setSubplotGraphHeight();
			}
			else if(chartType == "patchPair") {								
				this.showPlotlyChart(
					[this.pchartData['patchPair']]
					,	this.pchartLayout['patchPair']
					,	chartType
					,	this.chartStatuses['patchPair']
				);
				this.setGraphHeight();
			}
			else if(chartType == "ingestion") {								
				this.showPlotlyChart(
					[this.pchartData['ingestion']]
					,	this.pchartLayout['ingestion']
					,	chartType
					,	this.chartStatuses['ingestion']
				);
				this.setGraphHeight();				
			}
			else if(chartType == "missedDose") {								
				this.showPlotlyChart(
					[this.pchartData['missedDose']]
					,	this.pchartLayout['missedDose']
					,	chartType
					,	this.chartStatuses['missedDose']
				);
				this.setGraphHeight();
			}
			else if(chartType == "loginInfo") {							
				this.showPlotlyChart(
					[this.pchartData['patientLogin']]
					,	this.pchartLayout['patientLogin']
					,	chartType
					,	this.chartStatuses['loginInfo']
				);		
				this.setGraphHeight();	
			}
		}
		else {
			
			let dataArray:any=[]
			,	coverageFlag:boolean=false
			,	loginInfo:boolean=false
			,	incrementChartStatus:number=0
			,	layoutObject:any=this.incrementalChartLayout;
			
			for(let i = 0; i < this.incrementalToggle.length; i++) {	
				
				let toggleName:any=this.incrementalToggle[i];
				incrementChartStatus=incrementChartStatus+this.chartStatuses[toggleName];
				if(this.incrementalToggle.indexOf('coverage') !== -1) {
					
					if(coverageFlag === false && this.chartStatuses['coverage'] === 0) {
						layoutObject=this.pchartLayout['coverage'];
						dataArray.push(this.pchartData['coverageSubplot']);						
						dataArray.push(this.pchartMasterData['coverage']);						
						coverageFlag=true;		
						console.log('coverage....');						
					}				
					
					if(toggleName === 'loginInfo') {					
						loginInfo=true	

						if(this.chartStatuses['coverage'] === 0)
							layoutObject['shapes']=this.patientLoginShapes;
						else 
							layoutObject['shapes']=this.patientLoginShapesData;
					}
					else if(toggleName !== 'coverage') {
						
						if(loginInfo === false) {
							layoutObject['shapes']	=	null;
						}
						
						if(this.chartStatuses['coverage'] === 0) {
							dataArray.push(this.pchartMasterData[toggleName]);
						}
						else {
							dataArray.push(this.pchartData[toggleName]);
						}
					}
					
				}
				else {
					if(toggleName === 'loginInfo') {					
						loginInfo=true						
						layoutObject['shapes']	=	this.patientLoginShapesData;
					}
					else {						
						if(loginInfo === false) {
							layoutObject['shapes']	=	null;
						}
						
						if(this.chartStatuses[toggleName] == 0)
							dataArray.push(this.pchartData[toggleName]);
					}
				}
			}	
			
			if(dataArray.length > 0) {
				this.showPlotlyChart(dataArray, layoutObject, this.incrementChart, incrementChartStatus);
			}
			else {
				this.noDataErrorText	=	this.errorTextArray[this.incrementChart];
			}
		}
	}
	
	setToggleInActive() {		
		let _this=this;
		
		$('.toggleBtn').each(function(index, object){			
			let id = $(object).prop('id');				
			if(_this.chartStatuses[id] == 1) {
				$(object).addClass('disable');
			}
		});
	}
	
	showPlotlyChart(data, layout, chartType, status = 0) {
		this.showChartBlock	=	true;
		this.errorChart		=	false;
		let _this=this;
				
		if(status === 0) {
			setTimeout(function(){
				PlotlyJS.newPlot('chartBlock', data, layout); 
				_this.setToggleInActive();
			}, 100);
		}
		else {
			this.errorChart			=	true;			
			this.noDataErrorText	=	this.errorTextArray[chartType];
		}
	}
	
	setGraphHeight() {	
		$('#chartBlock').css('height', '570px');
	}
	
	setSubplotGraphHeight(){		
		$('#chartBlock').css('height', '600px');
	}
	  
	time_to_integer(time):any{
	  //console.log(time);
	  let x = time.split(":");
	  return  (parseInt(x[0]) * 60) + parseInt(x[1]);
	}

	getPatientAPIData() { 
		this.patientService.getPatientData(this.dmId).subscribe(data  => {
			
			//let data = ChartConfig.jsonData;			
			let ingestion_treatment_day			=	data['Ingestion_data']['treatmentday']
			,	ingestion_timestamp				=	data['Ingestion_data']['timestamp']
			,	ingestion_chipid				=	data['Ingestion_data']['chipid']			
			,	missed_dose_timestamp			=	data['Missed_dose_survey']['timestamp']
			, 	missed_dose_treatment_day		=  	data['Missed_dose_survey']['treatmentday']
			, 	missed_dose_reason				=  	data['Missed_dose_survey']['reason']			
			, 	patch_pair_timestamp 			=  	data['Patch_pair']['timestamp']
			,	patch_pair_treatment_day		=  	data['Patch_pair']['treatmentday']
			, 	patch_pair_patchid				=	data['Patch_pair']['patchid']			
			, 	coverage_window_coverage		=	data['coverage_per_window']['coverage']
			, 	coverage_window_treatment_day	=  	data['coverage_per_window']['treatmentday']
			, 	coverage_window_window 			=  	data['coverage_per_window']['window']			
			, 	coverage_day_coverage			=  	data['coverage_per_day']['coverage']
			, 	coverage_day_treatment_day		=   data['coverage_per_day']['treatmentday']
			, 	coverage_day_windows 			=  	data['coverage_per_day']['window']				
			, 	patient_login_coverage			=  	data['Patient_login_info']['coverage']	
			, 	patient_login_treatment_day		=  	data['Patient_login_info']['treatmentday']				
			, 	max_trt_day_ingestion			=  	data['max_trt_day_ingestion']	
			, 	max_trt_day_missed_dose			=  	data['max_trt_day_missed_dose']	
			, 	max_trt_day_patch_pair			=  	data['max_trt_day_patch_pair']	
			, 	max_trt_day_patient_login		=  	data['max_trt_day_patient_login']	
			, 	max_trt_day_coverage_per_window	= 	data['max_trt_day_coverage_per_window'];			

			this.chartStatuses['coverage']		=	data['coverage_per_window']['status']?data['coverage_per_window']['status']:data['coverage_per_day']['status'];
			this.chartStatuses['patchPair']		=	data['Patch_pair']['status'];
			this.chartStatuses['ingestion']		=	data['Ingestion_data']['status'];
			this.chartStatuses['missedDose']	=	data['Missed_dose_survey']['status'];
			this.chartStatuses['loginInfo']		=	data['Patient_login_info']['status'];
			
			this.maxTrtDayCoveragePerDay	=	data['max_trt_day_coverage_per_day'];
			this.maxTrtDayMasterChart		=	data['max_trt_day_master_chart'];
			this.xaxisLable		=	data['x_axis_label'];			
			
			this.ingestionHover			=	[];
			this.missedDoseHover		=	[];
			this.patchPairHover			=	[];
			this.coverageWindowHover	=	[];
			this.coverageDayHover		=	[];
			
			let cov_coverage_concat		=	[];
			
			if(Array.isArray(coverage_window_coverage) && coverage_window_coverage.length) {
				for (let i = 0; i < coverage_window_coverage.length; i++) {     
				  if(coverage_window_coverage[i] != '') {
					coverage_window_coverage[i] = (coverage_window_coverage[i] * 1).toFixed(2);
				  }
				}
				
				// Combine both array	
				cov_coverage_concat = coverage_window_coverage.concat(coverage_day_coverage);
				
				for (let i = 0; i < cov_coverage_concat.length; i++) {
				   this.coverageWindowHover.push(cov_coverage_concat[i] + "%");
				}
			}
			
			if(Array.isArray(coverage_window_window) && coverage_window_window.length) {
				for (let i = 0; i < coverage_window_window.length; i++) {  
				  if(coverage_window_window[i] != ''){			
					coverage_window_window[i] = coverage_window_window[i] * 15;
				  }	  
				}
			}

			// Windows * 15
			if(Array.isArray(coverage_day_windows) && coverage_day_windows.length) {
				for (let i = 0; i < coverage_day_windows.length; i++) {  
					if(coverage_day_windows[i] != ''){
						coverage_day_windows[i] = coverage_day_windows[i] * 15;
					}
				}
			}

			let cov_window_concat	=	coverage_window_window.concat(coverage_day_windows)
			,	cov_days_concat		=	coverage_window_treatment_day.concat(coverage_day_treatment_day);			
		   
			if(Array.isArray(coverage_day_coverage) && coverage_day_coverage.length) {
				for (let i = 0; i < coverage_day_coverage.length; i++) {
				   this.coverageDayHover.push(coverage_day_coverage[i] + "%");
				}
			}
		   
			// Convert hours to minutes
			if(Array.isArray(ingestion_timestamp) && ingestion_timestamp.length) {
				for (let i = 0; i < ingestion_timestamp.length; i++) {
				   this.ingestionHover.push(ingestion_timestamp[i] + ', ' + ingestion_chipid[i]);
				   if(ingestion_timestamp[i] != '' && ingestion_timestamp[i] !== undefined) {
					ingestion_timestamp[i]	=	this.time_to_integer(ingestion_timestamp[i]);
				   }
				}
			}
			
			if(Array.isArray(missed_dose_timestamp) && missed_dose_timestamp.length) {
				for (let i = 0; i < missed_dose_timestamp.length; i++) {
				  this.missedDoseHover.push(missed_dose_timestamp[i] + ', ' + missed_dose_reason[i]);
				  if(missed_dose_timestamp[i] != '' && missed_dose_timestamp[i] !== undefined) {
					missed_dose_timestamp[i] = this.time_to_integer(missed_dose_timestamp[i]);
				  }
				}
			}

			if(Array.isArray(patch_pair_timestamp) && patch_pair_timestamp.length) {
				for (let i = 0; i < patch_pair_timestamp.length; i++) {
					this.patchPairHover.push(patch_pair_timestamp[i] + ', ' + patch_pair_patchid[i])
					if(patch_pair_timestamp[i] != '' && patch_pair_timestamp[i] !== undefined) {
					  patch_pair_timestamp[i] = this.time_to_integer(patch_pair_timestamp[i]);
					}
				} 
			}
		   
		   //Login Info dashed line for master chart
			this.patientLoginShapes	=	[];
			
			let	graphType:any	=	'line'
			,	lineObject:any	=	{
				  color: 'black',
				  width: 0.25,
				  dash: 'dot'
			};
			
			if(Array.isArray(patient_login_treatment_day) && patient_login_treatment_day.length) {
				for(let i=0; i<patient_login_treatment_day.length; i++) {
					this.patientLoginShapes.push({
						type: graphType,
						x0: patient_login_treatment_day[i]+0.50,
						y0: 1,
						x1: patient_login_treatment_day[i]+0.50,					
						y1: 1440, //1440,
						line: lineObject,
						xref: 'x2', 
						yref: 'y2',
						rows: 2, 
						columns: 1,
					});
				}
			}
			
			//Login Info dashed line for separate chart
			this.patientLoginShapesData	=	[];
			
			if(Array.isArray(patient_login_treatment_day) && patient_login_treatment_day.length) {
				for(let i=0; i<patient_login_treatment_day.length; i++) {
					this.patientLoginShapesData.push({
						type: graphType,
						x0: patient_login_treatment_day[i]+0.40,
						y0: 1,
						x1: patient_login_treatment_day[i]+0.40,					
						y1: 1440, //1440,
						line: lineObject, 
						columns: 1,
					});
				}
			}							
			
			// Ingestion data object
			this.pchartData['ingestion']	=	{
				x: ingestion_treatment_day,
				y: ingestion_timestamp,
				hovertext : this.ingestionHover,
				hoverinfo : "text",
				type: 'scatter', 
				mode: 'markers', 
				marker : {
					symbol : 1, 
					color :'blue',
					opacity : 0.7, 
					size : 8 
				}			
			};			
			
			// Ingestion data object with sub Plot
			this.pchartMasterData['ingestion']	=	Object.assign({
				row:2,
				col : 1	,
				xaxis: 'x2',
				yaxis: 'y2'
			}, this.pchartData['ingestion']);

			// Ingestion Layout object		
			this.pchartLayout['ingestion']	=	 {
				autosize: true, 
				legend_orientation : "h", 
				hovermode : 'closest',
				hoverdistance : 2,
				xaxis : {  
					title : ChartConfig.plotlyConfig.xaxisTitle,
					showgrid : false,
					tick0 :0, 
					dtick : 1, 
					range : [0.5, max_trt_day_ingestion+0.5],
					showline : true, 
					tickvals : this.getRangeArray(max_trt_day_ingestion),
					ticktext : this.xaxisLable,
					linewidth : 1,
					linecolor :'black' 
				},
				yaxis: {
					title : ChartConfig.plotlyConfig.yaxisTitle,
					showgrid : false,
					tickmode : "array",
					tickvals : ChartConfig.plotlyConfig.tickValues,
					ticktext : ChartConfig.plotlyConfig.tickTexts,
					tick0 :0, 
					dtick : 15, 
					range : [0, 1440], 
					showline : true, 
					linewidth : 1, 
					linecolor : 'black'
				}
			};
			
			// Coverage data object
			this.pchartData['coverage']	=	{
				z : cov_coverage_concat,
				x : cov_days_concat,
				y : cov_window_concat,
				hovertext : this.coverageWindowHover,
				hoverinfo : "text",
				colorscale : ChartConfig.scaleData,  
				colorbar : {tick0 : 0,  dtick: 1},
				type: 'heatmap',
				showscale : false			
			};
			
			this.pchartMasterData['coverage']	=	Object.assign({
				row:2,
				col : 1	,
				xaxis: 'x2',
				yaxis: 'y2'
			}, this.pchartData['coverage']);
			
			// Patch pair data object
			this.pchartData['patchPair']	=	{
				x: patch_pair_treatment_day,
				y: patch_pair_timestamp,
				hovertext : this.patchPairHover,
				hoverinfo : "text",
				type: 'scatter', 
				mode: 'markers', 
				marker : {
					symbol : 141, 
					color : '#3fc7fa', 
					opacity : 0.7,
					size : 7,
					line: {
						width: 5
					}  
				}			  
			};
			
			// Patch pair data object with sub plot
			this.pchartMasterData['patchPair']	=	Object.assign({
				row:2,
				col : 1	,
				xaxis: 'x2',
				yaxis: 'y2'
			}, this.pchartData['patchPair']);
			
			// Patch pair layout object
			this.pchartLayout['patchPair']	=	{
				autosize: true, 
				legend_orientation : "h", 
				hovermode : 'closest',
				hoverdistance : 2,
				xaxis : {  
					title : ChartConfig.plotlyConfig.xaxisTitle,
					showgrid : false,
					tick0 :0, 
					dtick : 1, 
					range : [0.5, max_trt_day_patch_pair+0.5],
					tickvals : this.getRangeArray(max_trt_day_patch_pair),
					ticktext : this.xaxisLable,
					title_text: 'Days',
					showline : true, 
					linewidth : 1, 
					linecolor :'black' 
				},
				yaxis: {
					title : ChartConfig.plotlyConfig.yaxisTitle,
					showgrid : false,
					tickmode : "array",
					tickvals : ChartConfig.plotlyConfig.tickValues,
					ticktext : ChartConfig.plotlyConfig.tickTexts,
					tick0 :0, 
					dtick : 15,
					range : [0, 1440], 
					linewidth : 1, 
					linecolor : 'black'
				}
			}		

			// Missed dose data object	
			this.pchartData['missedDose']	=	{
				x: missed_dose_treatment_day,
				y: missed_dose_timestamp,
				hovertext : this.missedDoseHover,
				hoverinfo : "text",
				type: 'scatter', 
				mode: 'markers', 
				marker : {
					symbol : 130, 
					color : 'green', 
					opacity : 0.7, 
					size : 8  
				}	
			};	
			
			// Missed dose data object with sub Plot
			this.pchartMasterData['missedDose']	=	Object.assign({
				row:2,
				col : 1	,
				xaxis: 'x2',
				yaxis: 'y2'
			}, this.pchartData['missedDose']);	
			
			// Missed dose layout object
			this.pchartLayout['missedDose']	=	{
				autosize: true, 
				legend_orientation : "h",
				hovermode : 'closest',
				hoverdistance : 2,				
				xaxis : {  
					title : ChartConfig.plotlyConfig.xaxisTitle,
					showgrid : false,
					tick0 : 0, 
					dtick : 1, 
					range : [0.5, max_trt_day_missed_dose+0.5],
					tickvals : this.getRangeArray(max_trt_day_missed_dose),
					ticktext : this.xaxisLable,
					title_text: 'Days',
					showline : true, 
					linewidth : 1, 
					linecolor :'black' 
				},
				yaxis: {
					title : ChartConfig.plotlyConfig.yaxisTitle,
					showgrid : false,
					tickmode : "array",
					tickvals : ChartConfig.plotlyConfig.tickValues,
					ticktext : ChartConfig.plotlyConfig.tickTexts,
					tick0 : 0, 
					dtick : 15, 
					range : [0, 1440], 
					showline : true, 
					linewidth : 1, 
					linecolor : 'black'
				}				 
			};

			// Patient Login data object
			this.pchartData['patientLogin']	=	{
				x: missed_dose_treatment_day,
				y: missed_dose_timestamp,
				type: 'scatter', 
				mode: 'markers', 
				marker : {
					symbol : 130, 
					color : 'green', 
					opacity : 0, 
					size : 0  
				}	
			};			

			// Patient Login Layout object
			this.pchartLayout['patientLogin']	=	{
				autosize: true, 
				legend_orientation : "h",
				hovermode : 'closest',
				hoverdistance : 2,				
				xaxis : {  
					title : ChartConfig.plotlyConfig.xaxisTitle,
					showgrid : false,
					tick0 : 0, 
					dtick : 1, 
					range : [0.5, max_trt_day_patient_login+0.5],
					tickvals : this.getRangeArray(max_trt_day_patient_login),
					ticktext : this.xaxisLable,
					title_text: 'Days',
					showline : true, 
					linewidth : 1, 
					linecolor :'black'
				},
				yaxis: {
					title : ChartConfig.plotlyConfig.yaxisTitle,
					showgrid : false,
					tickmode : "array",
					tickvals : ChartConfig.plotlyConfig.tickValues,
					ticktext : ChartConfig.plotlyConfig.tickTexts,
					tick0 : 0, 
					dtick : 15, 
					range : [0, 1440], 
					showline : true, 
					linewidth : 1, 
					linecolor : 'black'
				},
				shapes: this.patientLoginShapesData					
			};
			
			// head Coverage Plot
			this.pchartData['coverageSubplot'] = {				  
				z : cov_coverage_concat,
				x : cov_days_concat,
				y : cov_window_concat,
				hovertext : this.coverageWindowHover,
				hoverinfo : "text",
				colorscale : ChartConfig.scaleData, 
				colorbar : {tick0 : 0,  dtick: 1},
				type: 'heatmap',
				showscale : false,
				row:1,
				col : 1
			};		
				
			this.pchartLayout['coverage']	=	{	
				grid: {
					rows: 2, 
					columns: 1, 
					pattern: 'independent', 
					vertical_spacing : 0.02					
				},			
				autosize: true,		   
				plot_bgcolor : 'rgba(250, 211, 213, 0.7)',
				showlegend :  false,
				hovermode : 'closest',
				hoverdistance : 2, 
				legend_orientation : "h",
				xaxis : {  
					ticks : '',
					showgrid : false,
					tick0 : 0, 
					dtick : 1, 
					range : [0.5, this.maxTrtDayMasterChart+0.5],					
					showline : false, 
					linewidth : 0, 
					linecolor :'black',
					showticklabels : false
				},
				yaxis: {
					showgrid : false,
					ticks : '',
					tickmode : "array",
					tickvals : ChartConfig.plotlyConfig.tickValues.concat([1455, 1470, 1485, 1500, 1515, 1530, 1545, 1560, 1575]),				
					ticktext : ChartConfig.plotlyConfig.tickTexts.concat(['', '', '', '', '', '', '', '', 'Coverage %<br />/Day']), 
					tick0 :0, 
					dtick : 15,
					showline : false, 
					linewidth : 1, 
					linecolor : 'black',
					range : [1575, 1575],
					domain: [0.93,  1] 
				},					
				xaxis2 : {  
					title : ChartConfig.plotlyConfig.xaxisTitle,
					ticks : '',
					showgrid : false,
					tick0 : 0, 
					dtick : 1, 
					range : [0.5, this.maxTrtDayMasterChart+0.5],
					tickvals : this.getRangeArray(this.maxTrtDayMasterChart),
					ticktext : this.xaxisLable,
					title_text: 'Days',
					showline : true, 
					linewidth : 1,  
					linecolor :'black'
				},
				yaxis2: {
					title : ChartConfig.plotlyConfig.yaxisTitle, 
					showgrid : false,
					ticks : '',
					tickmode : 'array',
					tickvals : ChartConfig.plotlyConfig.tickValues,				
					ticktext : ChartConfig.plotlyConfig.tickTexts, 
					tick0 :0, 
					dtick : 15,
					showline : true, 
					linewidth : 1, 
					linecolor : 'black',
					range : [0, 1440],
					domain: [0,  0.9]
				},
				shapes: null
			};				

			this.incrementalChartLayout = {		
				autosize: true,		
				showlegend :  false,
				hovermode : 'closest',
				hoverdistance : 2, 
				legend_orientation : "h",		  
				xaxis : {  
					title : ChartConfig.plotlyConfig.xaxisTitle,
					ticks : '',
					showgrid : false,
					tick0 : 0, 
					dtick : 1, 
					range : [0.5, this.maxTrtDayMasterChart+0.5],
					tickvals : this.getRangeArray(this.maxTrtDayMasterChart),
					ticktext : this.xaxisLable,
					title_text: 'Days',
					showline : true, 
					linewidth : 1,  
					linecolor :'black'
				},
				yaxis: {
					title : ChartConfig.plotlyConfig.yaxisTitle, 
					showgrid : false,
					ticks : '',
					tickmode : 'array',
					tickvals : ChartConfig.plotlyConfig.tickValues,				
					ticktext : ChartConfig.plotlyConfig.tickTexts, 
					tick0 :0, 
					dtick : 15,
					showline : true, 
					linewidth : 1, 
					linecolor : 'black',
					range : [0, 1440]
				},
				shapes: {}
			};
			
			
			this.drawMasterChart();						
		});	 
	}
}
