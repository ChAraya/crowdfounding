import { Component, OnInit, EventEmitter, Input, ElementRef, Renderer, Output } from '@angular/core';
import { TeamHttpService } from './../../../services/https/team-http.service';

@Component({
  selector: 'app-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.scss']
})
export class TeamMembersComponent {
  @Input() team: any;
  _ref:any;
  @Output() changeView = new EventEmitter<any>();  
  email: string;
  exp: number;
  privilegio: any;
  Privil: any[] = [
    { id: 0, data: 'Solo ver' },
    { id: 1, data: 'Editar'}
  ];
  constructor(private teamHttpService: TeamHttpService,  private el: ElementRef, private renderer: Renderer) {
    this.privilegio = this.Privil[0].id;
  }

  removeObject(){
    this.email = "";
    this.privilegio = this.Privil[0].id;
  }
  
  save(){
    if(this.email){
      let member = {
        team: this.team,
        email: this.email,
        editor: this.privilegio
      }
      this.email = "";
      this.privilegio = this.Privil[0].id;
      this.changeView.emit(member);
    }else{
      alert('Please enter value to save');
    }
  }
}
