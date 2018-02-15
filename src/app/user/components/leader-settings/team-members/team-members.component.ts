import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.scss']
})
export class TeamMembersComponent {
  _ref:any;
  email: string;
  exp: number;
  constructor() { }

  removeObject(){
    this._ref.destroy();
  }
  
  save(){
    if(this.email && this.exp)
      alert(`Language: ${this.email} & Experience: ${this.exp}`);
    else
      alert('Please enter value to save');
  }
}
