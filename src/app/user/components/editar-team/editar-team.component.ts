
import { TeamEditService } from './../../services/forms/team-edit.service';
import { TeamHttpService } from './../../services/https/team-http.service';
import { ImageUploadComponent } from './../../../shared/components/image-upload/image-upload.component';
import { AppState } from './../../../app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Project } from './../../../core/models/project';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-editar-team',
  templateUrl: './editar-team.component.html',
  styleUrls: ['./editar-team.component.scss']
})
export class EditarTeamsComponent implements OnInit {

  private projectSub$: Subscription = new Subscription();
  @Input() user: User;
  @Input() teamId: any;
  @ViewChild('imageUpload') imageUpload: ImageUploadComponent;
  changeView = new EventEmitter<number>();
  selectedDate = new Date();

  formSubmit = false;
  projectForm: FormGroup;
  categories = [];
  teams: any;
  users: any;
  authUser: AuthUser;
  role_id: any;
  visible: any;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private teamHttpService: TeamHttpService,
    private teamFormService: TeamEditService,
    private toastyService: ToastyService,
    private userActions: UserActions,
    private userService: UserService
  ) {
    this.store.select(getAuthUser).subscribe((user) => {
      this.authUser = user;
      this.role_id = user.role_id;
    });
    
  }

  ngOnInit() {
    this.teams = this.teamId;
    console.log(this.teams.representative);
    this.initProjectForm(this.teams);
    this.fetchUsers();
  }

  isAuthUser() {
    return this.userService.isLoggedInUser(this.user);
  }

  isAdmin(){
    return this.userService.isLoggedInUser(this.user) && this.user.role_name === 'admin';
  }

  private initProjectForm(team) {
    this.projectForm = this.teamFormService.initTeamForm(team);
    this.selectedDate = new Date();
  }

  
  private setStartDate() {
    this.projectForm.controls['start_date'].setValue(this.selectedDate);
  }

  submitProject() {
    this.setStartDate();
    this.formSubmit = true;
    const project = this.projectForm.value;
    this.teamHttpService.updateTeam(project)
      .subscribe((res) => {
        let respuesta = res;
        console.log(respuesta);
      if (!respuesta.status) {
        this.toastyService.error('Nombre de grupo ya existe.');
      }else{
        this.toastyService.success('Grupo modificado con exito!');
        this.changeView.emit(9)
      }
    });;

  }

  private fetchUsers() {
    this.userService.fetchAllUsers().subscribe((data) => {
      this.users = data;
      if(this.teams.representative == null){
        (<FormControl>this.projectForm.controls['representative']).setValue(this.users[0].id);
      }else{
        (<FormControl>this.projectForm.controls['representative']).setValue(this.teams.representative);
      }
    });
  }
  


}
