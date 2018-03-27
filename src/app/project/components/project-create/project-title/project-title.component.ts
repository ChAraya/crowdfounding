import { ProjectFormService } from './../../../services/forms/project-form.service';
import { ProjectHttpService } from './../../../services/http/project-http.service';
import { ImageUploadComponent } from './../../../../shared/components/image-upload/image-upload.component';
import { getDraftProject, getSelectedProject } from './../../../reducers/project.selector';
import { ProjectActions } from './../../../actions/project.actions';
import { AppState } from './../../../../app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Project } from './../../../../core/models/project';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { UserService } from '../../../../user/services/user.service';
import { getAuthUser } from './../../../../core/reducers/auth.selector';
import { ActivatedRoute } from '@angular/router';
import { UserActions } from '../../../../user/actions/user.actions';
import { getUser } from '../../../../user/reducers/user.selectors';
import { User } from '../../../../core/models/user';
import { Subscription } from 'rxjs/Subscription';
import { AuthUser } from '../../../../core/models/auth-user';
@Component({
  selector: 'app-project-title',
  templateUrl: './project-title.component.html',
  styleUrls: ['./project-title.component.scss']
})
export class ProjectTitleComponent implements OnInit, OnDestroy {

  private projectSub$: Subscription = new Subscription();
  @Input() isEditing;
  @ViewChild('imageUpload') imageUpload: ImageUploadComponent;
  selectedDate = new Date();

  formSubmit = false;
  projectForm: FormGroup;
  categories = [];
  teams = [];
  project: any;
  user: User;
  authUser: AuthUser;
  role_id: any;
  constructor(
    private actions: ProjectActions,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private projectHttpService: ProjectHttpService,
    private projectFormService: ProjectFormService,
    private userActions: UserActions,
    private userService: UserService
  ) {
    this.fetchCategories();
    
    this.store.select(getAuthUser).subscribe((user) => {
      this.authUser = user;
      this.role_id = user.role_id;
      
    });

    if(this.isAdmin()){
      this.fetchTeams();
    }
    
  }

  ngOnInit() {
    console.log('editing', this.isEditing);
    if (this.isEditing) {
      this.projectSub$ = this.store.select(getSelectedProject).subscribe((project) => {
        this.initProjectForm(project);
        this.project = project;
      });
    } else {
      this.projectSub$ = this.store.select(getDraftProject).subscribe((project) => {
          
        this.initProjectForm(project);
        this.project = project;
        // (this.project.id) ? this.project = project : this.project = project[0].project;
      });
    }
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

  removePictureAttribue(i) {
    (<FormArray>this.projectForm.get('pictures_attributes')).controls[i].patchValue({
      _destroy: true
    });
    const project = this.projectForm.value;
    if (!this.isEditing) {
      this.store.dispatch(this.actions.removeFromDraft(project));
    } else {
      this.store.dispatch(this.actions.updateProject(project));
    }
  }

  removeImageData(i) {
    (<FormArray>this.projectForm.get('images_data')).removeAt(i);
  }

  submitProject() {
    this.setStartDate();
    this.formSubmit = true;
    const project = this.projectForm.value;
    //console.log(project);
    Object.keys(this.projectForm.controls).forEach(key => {
  
      const controlErrors: ValidationErrors = this.projectForm.get(key).errors;
      if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            });
          }
        });
    if (this.projectForm.valid) {
      console.log(project);
      if (!this.isEditing) {
        this.store.dispatch(this.actions.saveDraft(project));
      } else {
        this.store.dispatch(this.actions.updateProject(project));
      }
    }
  }
  getFormValidationErrors() {
    Object.keys(this.projectForm.controls).forEach(key => {
  
    const controlErrors: ValidationErrors = this.projectForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    }

  private setStartDate() {
    this.projectForm.controls['start_date'].setValue(this.selectedDate);
  }

  private fetchCategories() {
    this.projectHttpService.fetchAllCategories().subscribe((data) => {
      this.categories = data.categories;
      (<FormControl>this.projectForm.controls['category_id']).setValue(this.categories[0].id);
    });
  }

  private fetchTeams() {
    this.projectHttpService.fetchAllTeams().subscribe((data) => {
      this.teams = data.teams;
      if(this.project.team_id == null){
        (<FormControl>this.projectForm.controls['team_id']).setValue(this.teams[0].id);
      }else{
        (<FormControl>this.projectForm.controls['team_id']).setValue(this.teams[this.project.team_id].id);
      }
    });
  }

  private  initProjectForm(project) {
    this.projectForm = this.projectFormService.initProjectForm(project);
    project.start_date ? this.selectedDate = new Date(project.start_date) : this.selectedDate = new Date();
  }
 

  isAdmin() {
    console.log(this.role_id);
    return this.userService.isLoggedInUser(this.authUser) && this.role_id == 1;
  }

  ngOnDestroy() {
    this.projectSub$.unsubscribe();
  }

}
