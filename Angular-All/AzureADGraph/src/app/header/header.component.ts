import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
	@Input() userInfo:any;
	@Output() callback = new EventEmitter();
	userDetails:any;
	isLoggedIn:boolean=false;
	
	ngOnChanges(param) {			
		if(param.userInfo['currentValue']) {	  
			this.userDetails = param.userInfo['currentValue'];			
			if(this.userDetails['isLoggedIn']) {
				this.isLoggedIn	=	true;
			}
		}
	}
	
	logout() {
		this.callback.emit(null);
	}	
}
