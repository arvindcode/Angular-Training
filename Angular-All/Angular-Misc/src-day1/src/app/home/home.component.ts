import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  customers = [
    {"first_name":"Ravi", "Age": 30},
    {"first_name":"Raj", "Age": 40},
    {"first_name":"Ramesh", "Age": 30},
    {"first_name":"Akash", "Age": 35}
  ]

  amount = 5000;

  sayHi(){
    window.alert("Hello, Welcome")
  }

  constructor() { }

  ngOnInit() {

  
  }

}
