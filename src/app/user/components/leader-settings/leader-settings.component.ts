
import { TeamFormService } from './../../services/forms/team-form.service';
import { TeamHttpService } from './../../services/https/team-http.service';
import { ImageUploadComponent } from './../../../shared/components/image-upload/image-upload.component';
import { AppState } from './../../../app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Project } from './../../../core/models/project';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ComponentFactoryResolver, ViewContainerRef, SimpleChange } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService } from '../../../user/services/user.service';
import { getAuthUser } from '../../../core/reducers/auth.selector';
import { ActivatedRoute } from '@angular/router';
import { UserActions } from '../../../user/actions/user.actions';
import { getUser } from '../../../user/reducers/user.selectors';
import { User } from '../../../core/models/user';
import { Subscription } from 'rxjs/Subscription';
import { AuthUser } from '../../../core/models/auth-user';
import { ToastyService } from 'ng2-toasty';
import { TeamMembersComponent } from './team-members/team-members.component'

@Component({
  selector: 'app-leader-settings',
  templateUrl: './leader-settings.component.html',
  styleUrls: ['./leader-settings.component.scss']
})
export class LeaderSettingsComponent implements OnInit {

  private projectSub$: Subscription = new Subscription();
  @ViewChild('parent', { read: ViewContainerRef }) container: ViewContainerRef;
  @Input() user: User;
  @Output()
  changeView = new EventEmitter<number>();
  @ViewChild('imageUpload') imageUpload: ImageUploadComponent;
  selectedDate = new Date();

  formSubmit = false;
  projectForm: FormGroup;
  categories = [];
  teams: any;
  authUser: AuthUser;
  role_id: any;
  members: any;
  privilegio: any;
  Privil: any[] = [
    { id: 0, data: 'Solo ver' },
    { id: 1, data: 'Editar'}
  ];
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private teamHttpService: TeamHttpService,
    private teamFormService: TeamFormService,
    private toastyService: ToastyService,
    private userActions: UserActions,
    private userService: UserService,
    private _cfr: ComponentFactoryResolver
  ) {
    this.store.select(getAuthUser).subscribe((user) => {
      this.authUser = user;
      this.role_id = user.role_id;
    });
  }

  ngOnInit() {
    this.getMembers();
    this.addComponent();    
  }

  isAuthUser() {
    return this.userService.isLoggedInUser(this.user);
  }

  isAdmin(){
    return this.userService.isLoggedInUser(this.user) && this.user.role_name === 'admin';
  }

  changeTab(id){
    this.teamHttpService.getTeam(id).subscribe((data) => {
      this.changeView.emit(10);
    });
    //this.teamId.emit(id)    
  }

  loadMembers(event){
    this.teamHttpService.newMember(event).subscribe((res) => {
      let respuesta = res;
      if (respuesta.error) {
        this.toastyService.error(respuesta.message);
      }else{
        this.toastyService.success(respuesta.message);
      }
      this.getMembers();
    });
  }

  getMembers(){
    this.teamHttpService.getMembers(this.user.team_id).subscribe((data) => {
      this.members = data.members;
    })
  }

  addComponent(){    
    var comp = this._cfr.resolveComponentFactory(TeamMembersComponent);    
    var expComponent = this.container.createComponent(comp);
    let myPost: TeamMembersComponent = <TeamMembersComponent>expComponent.instance;
    myPost.team = this.user.team_id;
    myPost.changeView.subscribe(msg => this.loadMembers(msg));
    expComponent.instance._ref = expComponent;
  }

  removeObject(event){
    event.team = this.user.team_id
    this.teamHttpService.deleteMember(event).subscribe((res) => {
      let respuesta = res;
      if (respuesta.error) {
        this.toastyService.error(respuesta.message);
      }else{
        this.toastyService.success(respuesta.message);
      }
      this.getMembers();
    });
  }
  
  save(event){
    event.team = this.user.team_id;
    this.loadMembers(event);

  }
}
