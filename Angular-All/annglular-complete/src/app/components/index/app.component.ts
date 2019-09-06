

import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})


export class AppComponent {
	title = 'Student Store';

	// Add few students for initial listing
	studentsList = [
	{	
		id : 1,
		first_name : "Raj",
		last_name : "Kumar",
		email : "raj@gmail.com",
		phone : 9503733178,
		department : "Science"
	},
	{
		id : 2,
		first_name : "Pawan",
		last_name : "Kumar",
		email : "pawan@gmail.com",
		phone : 8574889658,
		department : "Commerce"
	},
	{
		id : 3,
		first_name : "Rakesh",
		last_name : "K",
		email : "rakesh@gmail.com",
		phone : 7485889658,
		department : "Science"
	},
	{
		id : 4,
		first_name : "Veer",
		last_name : "Kumar",
		email : "veer@gmail.com",
		phone : 9685589748,
		department : "Arts"
	},
	{
		id : 5,
		first_name : "Prabhat",
		last_name : "P",
		email : "prabhat@gmail.com",
		phone : 8595856547,
		department : "Engineering"
	}
	];

	constructor() {
		// Save students to localStorage
		localStorage.setItem('students', JSON.stringify(this.studentsList));
	}
}
