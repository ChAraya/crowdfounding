import { UserService } from './services/user.service';
import { getAuthUser } from './../core/reducers/auth.selector';
import { ActivatedRoute, Router } from '@angular/router';
import { UserActions } from './actions/user.actions';
import { getUser } from './reducers/user.selectors';
import { User } from './../core/models/user';
import { AppState } from './../app.state';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  selectedTab = 1;
  user: User;
  teamId: any;
  userId: number;
  constructor(
    private store: Store<AppState>,
    private userActions: UserActions,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.store.dispatch(this.userActions.loadUser(this.userId));
    });
    this.selectedTab = 1;

    // this.route.fragment.subscribe((fragment: string) => {
    //   if (fragment === 'notifications') {
        
    //   }
    //   if (fragment === 'quick-view') {
    //     this.selectedTab = 2;
    //   }

      
    // });

    

    
  }

  ngOnInit() {
    this.store.select(getUser).subscribe((user) => {
      this.user = user;      
    });
  }

  ngAfterContentInit() {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    
  }

  changeTab(tab) {
    this.selectedTab = tab;
  }

  changeTabChild(event){
    this.selectedTab = event;
  }

  getTeamId(event){
    this.teamId = event[0];
  }

  isCreator() {
    return this.userService.isLoggedInUser(this.user) && this.user.role_name === 'creator';
  }

  isAdmin() {
    return this.userService.isLoggedInUser(this.user) && this.user.role_name === 'admin';
  }

  isAuthUser() {
    return this.userService.isLoggedInUser(this.user);
  }

  isInTeam(){
    if(this.isAdmin()){
      return true;
    }
    if(this.user.team_id != 0){
      return true;
    }
    return false;
  }

  isLeader(){
    return this.user.leader ? true : false;
  }
  

  canCreate(){
    if(this.isAdmin()){
      return true;
    }
    if(this.user.can_edit){
      return true;
    }
    return false;
  }

  createProject(){
    this.router.navigate(['/projects/new']);
  }

}


