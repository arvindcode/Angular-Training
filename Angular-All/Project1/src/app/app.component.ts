import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app1';
  users: any
  constructor(private htpp: HttpClient){

  }

  ngOnInit(){
    let obs = this.htpp.get('http://localhost:64027/api/values/asjson/123');
    obs.subscribe((data)=> {
      this.users = data
      //console.log(data)
      console.log(this.users) 
    });
    
  }
}
