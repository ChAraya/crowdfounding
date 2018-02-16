
import { TeamFormService } from './../../services/forms/team-form.service';
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
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamsComponent implements OnInit {

  private projectSub$: Subscription = new Subscription();
  @Input() user: User;
  @ViewChild('imageUpload') imageUpload: ImageUploadComponent;
  selectedDate = new Date();
  
  formSubmit = false;
  projectForm: FormGroup;
  categories = [];
  team: any;
  users: any;
  authUser: AuthUser;
  selectedUser: any;
  changeView = new EventEmitter<number>();
  role_id: any;
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private teamHttpService: TeamHttpService,
    private teamFormService: TeamFormService,
    private toastyService: ToastyService,
    private userActions: UserActions,
    private userService: UserService
  ) {
    this.store.select(getAuthUser).subscribe((user) => {
      this.authUser = user;
      this.role_id = user.role_id;
      console.log("asdsad", user);      
    });
    
  }

  ngOnInit() {
    this.fetchUsers();
    this.initProjectForm(this.team);
    
  }

  getPictures() {
    return (<FormArray>this.projectForm.get('pictures_attributes')).value;
  }

  setImageData(image) {
    (<FormArray>this.projectForm.get('images_data')).push(
      this.fb.control(image)
    );
  }

  uploadImage() {
    this.imageUpload.showImageBrowseDlg();
  }

  // removePictureAttribue(i) {
  //   (<FormArray>this.projectForm.get('pictures_attributes')).controls[i].patchValue({
  //     _destroy: true
  //   });
  //   const project = this.projectForm.value;
  //   if (!this.isEditing) {
  //     this.store.dispatch(this.actions.removeFromDraft(project));
  //   } else {
  //     this.store.dispatch(this.actions.updateProject(project));
  //   }
  // }

  removeImageData(i) {
    (<FormArray>this.projectForm.get('images_data')).removeAt(i);
  }

  submitProject() {
    this.setStartDate();
    this.formSubmit = true;
    const project = this.projectForm.value;
    project.representative = this.selectedUser;
    console.log(project);
    this.teamHttpService.createTeam(project)
      .subscribe((res) => {
        let respuesta = res;
        console.log(respuesta);
      if (!respuesta.status) {
        this.toastyService.error('Nombre de grupo ya existe.');
      }else{
        this.toastyService.success('Grupo creado con exito!');
      }
    });;

  }

  private setStartDate() {
    this.projectForm.controls['start_date'].setValue(this.selectedDate);
  }

  private initProjectForm(team) {
    this.projectForm = this.teamFormService.initTeamForm(team);
    this.selectedDate = new Date();
  }
 

  isAdmin() {
    return this.userService.isLoggedInUser(this.authUser) && this.role_id == 1;
  }

  ngOnDestroy() {
    this.projectSub$.unsubscribe();
  }
  
  private fetchUsers() {
    this.userService.fetchAllUsers().subscribe((data) => {
      this.users = data;
    });
  }

  changeTab(id){
    this.changeView.emit(9);
  }
}
