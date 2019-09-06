import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // template:`<app-observable></app-observable>
  // <app-promise></app-promise>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title:string = 'demoapp';
  heroes = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];
  myHero = this.heroes[0];
   
  constructor(private http:HttpClient){

  }
  ngOnInit(){
  
    //this.result = this. http.get("http://localhost:64027/api/values/asjson/123")
    //.map(response => console.log(response));
    let obs = this.http.get("http://10.18.31.40:8085/ingestions?dmid=49");
    obs.subscribe(()=> console.log('got responce'));
  }

  

}
