import { getAuthUser } from '../../../core/reducers/auth.selector';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { User } from '../../../core/models/user';
import { HttpService } from '../../../core/services/http';
import { Response } from '@angular/http';
import { UserActions } from '../../actions/user.actions';
import { Injectable } from '@angular/core';

@Injectable()
export class TeamHttpService {

  authUser: User;

  constructor(
    private userActions: UserActions,
    private http: HttpService,
    private store: Store<AppState>
  ) {
  }

  createTeam(team) {
    return this.http.post(
      `/api/team`, { team: team }
    ).map((res: Response) => {
      return res.json();
    });
  }

  updateUser(user) {
    const id = user.id;
    return this.http.put(
      `/api/v1/users/${id}`, { user: user }
    ).map((res: Response) => {
      return res.json();
    });
  }

  isLoggedInUser(user) {
    if (user && this.authUser) {
      return user.id === this.authUser.id;
    }
    return false;
  }

  readNotification(id: number) {
    return this.http.put(
      `/api/v1/notifications/read_notification`, { id: id}
    ).map((res: Response) => {});
  }

  getTeams(){
    return this.http.get(
      '/api/teams'
    ).map((res: Response) => {
      return res.json();
    })
  }

  getTeam(id: number){
    return this.http.get(
      `/api/team/${id}`
    ).map((res: Response) => {
      return res.json();
    })
  }

  updateTeam(team){
    return this.http.post(
      `/api/team`, { team: team }
    ).map((res: Response) => {
      return res.json();
    });
  }

  getMembers(id: number){
    return this.http.get(
      `/api/teams/members/${id}`
    ).map((res: Response) => {
      return res.json();
    })
  }

  newMember(member){
    return this.http.post(
      '/api/teams/members', { member: member }
    ).map((res: Response) => {
      return res.json();
    })
  }

  deleteMember(member){
    return this.http.post(
      '/api/teams/dMember', { member: member }
    ).map((res: Response) => {
      return res.json();
    })
  }

}
