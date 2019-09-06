import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app2';
  amount: number = 500;
  deposit(){
    this.amount +=100;
  }

  @Input()  name: string;
  @Output() voted = new EventEmitter<boolean>();
  didVote = false;

  vote(agreed: boolean) {
    this.voted.emit(agreed);
    this.didVote = true;
  }

  myVariable = ""
  disableApp = false
  constructor(){
    setInterval(()=> {this.myVariable = Math.random().toString() 
    this.disableApp = Math.random() > 0.5
    }, 500)
  }
  into = "hello"
  updateValue(e)
  {
    this.into = e.target.value
    console.log(this.into)
  }

  //------------------------@input, @output----------------------------
  // Parent
//   import { Component, EventEmitter, Input, Output } from '@angular/core';

// @Component({
//   selector: 'app-voter',
//   template: `
//     <h4>{{name}}</h4>
//     <button (click)="vote(true)"  [disabled]="didVote">Agree</button>
//     <button (click)="vote(false)" [disabled]="didVote">Disagree</button>
//   `
// })
// export class VoterComponent {
//   @Input()  name: string;
//   @Output() voted = new EventEmitter<boolean>();
//   didVote = false;

//   vote(agreed: boolean) {
//     this.voted.emit(agreed);
//     this.didVote = true;
//   }
// }
// //-------------------------------------Child-----------
// import { Component }      from '@angular/core';

// @Component({
//   selector: 'app-vote-taker',
//   template: `
//     <h2>Should mankind colonize the Universe?</h2>
//     <h3>Agree: {{agreed}}, Disagree: {{disagreed}}</h3>
//     <app-voter *ngFor="let voter of voters"
//       [name]="voter"
//       (voted)="onVoted($event)">
//     </app-voter>
//   `
// })
// export class VoteTakerComponent {
//   agreed = 0;
//   disagreed = 0;
//   voters = ['Narco', 'Celeritas', 'Bombasto'];

//   onVoted(agreed: boolean) {
//     agreed ? this.agreed++ : this.disagreed++;
//   }
// }

} 
