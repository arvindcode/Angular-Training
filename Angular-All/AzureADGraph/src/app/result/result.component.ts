import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
declare var $: any;
import * as $ from 'jquery';

@Component({
  selector: 'result-component',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent  {

	constructor(private router: Router, private adalSvc: MsAdalAngular6Service) {
		
		console.log(this.adalSvc.userInfo);
		
		if(this.adalSvc.LoggedInUserEmail) {
			//this.router.navigate(['/']);
			$('.right-block').html('');
		}
		else {
			$('.right-block').html('');
		}
	}
}