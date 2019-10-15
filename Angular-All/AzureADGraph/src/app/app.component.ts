import { Component } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  
	userInfo:any={name: '', icon: '', isLoggedIn: false};
	
	constructor(private router: Router, private activeRoute: ActivatedRoute, private adalSvc: MsAdalAngular6Service) {

		let path = window.location.href;
		let page = path.split("/").pop();
				
		if(this.adalSvc.userInfo) {
			let iconText	=	''
			,	given_name	=	this.adalSvc.userInfo.profile['given_name']
			,	family_name	=	this.adalSvc.userInfo.profile['family_name'];
			
			if(given_name[0] !== undefined && given_name[0])
				iconText	=	iconText+given_name[0];
			
			if(family_name[0] !== undefined && family_name[0])
				iconText	=	iconText+family_name[0];		
			
			this.userInfo['name']		=	given_name;
			this.userInfo['icon']		=	iconText;
			this.userInfo['isLoggedIn']	=	true;	
			
			let token = this.adalSvc.acquireToken('https://graph.microsoft.com').subscribe((token: string) => {
				//console.log(token);
			});
		}
		else if(page == "#") {
			this.router.navigate(['/result']);
		}
	}
	
	ngOninit() {}
	
	logout(param) {
		this.adalSvc.logout();
	}
}
