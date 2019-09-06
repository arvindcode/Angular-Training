import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  template: `
    <div>
      <h2>Welcome {{name}}</h2>
      <h2>{{2+2}}</h2>
      <h2>{{"Welcome " + name}}</h2>
      <h2>{{name.length}}</h2>
      <h2>{{name.toUpperCase()}}</h2>
      <h2>{{greetUser()}}</h2>
      <h2>{{url}}</h2>


      <input [id]="myId" bind-disabled="isDisabled"  type="text" value="Arvind">
      <input id="{{myId}}" [disabled]="isDisabled"  type="text" value="Arvind">
      

      <h2 class="text-success">Code</h2>
      <h2 [class]="successClass">Code</h2>
      <h2 class="text-special" [class]="successClass">Code </h2>
      <h2 [class.text-danger]="hasError">Codev</h2>
      <h2 [ngClass]="messageClasses">Message</h2>
      
      <h2 [style.color]="'orange'">Style Binding</h2> 
      <h2 [style.color]="hasError ? 'red' : 'green'">Style Binding 2</h2>            
      <h2 [style.color]="highlightColor">Style Binding 3</h2>
      <h2 [ngStyle]="titleStyles">Style Binding 4</h2>


      <button (click)="onClick($event)">Greet</button>
      <button (click)="greeting = 'Welcome Arvind'">Greet Arvind</button> 
      <h2>{{greeting}}</h2>


      <input #myInput type="text">
      <button (click)="logMessage(myInput.value)">Log</button>


      <input type="text" [(ngModel)]="name">
      {{name}}
    </div>
  `,
  styles: [`
    .text-success{
      color: green;
    }
    .text-danger{
      color: red;
    }
    .text-special{
      font-style: italic;
    }
  `]
})
export class TestComponent implements OnInit {

  public name = "Code";
  public url = window.location.href;
  public myId = "testId";
  public isDisabled = true;
  public successClass = "text-success";
  public hasError = false;
  public isSpecial = true;
  public messageClasses = {
    "text-success": !this.hasError,
    "text-danger": this.hasError,
    "text-special": this.isSpecial
  }

  public highlightColor = "orange";
  public titleStyles = {
    color: "blue",
    fontStyle: "italic"
  }

  public greeting = "";
  
  constructor() { }

  ngOnInit() {
  }

  greetUser(){
    return "Hello " + this.name;
  }

  onClick(event){
    console.log(event)
    this.greeting = event.type;
  }
  
  logMessage(value){
    console.log(value)
  }

}
