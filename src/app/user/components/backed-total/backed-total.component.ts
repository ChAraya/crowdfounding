
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
  selector: 'app-backed-total',
  templateUrl: './backed-total.component.html',
  styleUrls: ['./backed-total.component.scss']
})
export class BackedTotalComponent implements OnInit {

  private projectSub$: Subscription = new Subscription();
  @Input() user: User;
  @Output()
  changeView = new EventEmitter<number>();

  @Output()
  teamId = new EventEmitter<any>();
  @ViewChild('imageUpload') imageUpload: ImageUploadComponent;
  selectedDate = new Date();

  formSubmit = false;
  projectForm: FormGroup;
  categories = [];
  backed: any;
  authUser: AuthUser;
  role_id: any;

  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];

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
    });
  }

  ngOnInit() {
    this.getProjectsBacked();
  }


  getProjectsBacked(){
    this.teamHttpService.getBackedProjects().subscribe((data) => {
      this.backed = data.project;
    });
  }

  isAuthUser() {
    return this.userService.isLoggedInUser(this.user);
  }

  isAdmin(){
    return this.userService.isLoggedInUser(this.user) && this.user.role_name === 'admin';
  }

  changeTab(id){
    this.teamHttpService.getTeam(id).subscribe((data) => {
      this.teamId.emit(data.project);
      this.changeView.emit(10);
    });
    //this.teamId.emit(id)    
  }



}
