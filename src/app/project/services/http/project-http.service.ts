import { ToastyService } from 'ng2-toasty';
import { AuthService } from './../../../core/services/auth.service';
import { Response } from '@angular/http';
import { Project } from './../../../core/models/project';
import { HttpService } from './../../../core/services/http';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class ProjectHttpService {

  public savingDraft = new Subject();

  constructor(
    private http: HttpService,
    private authService: AuthService
  ) { }

  fetchAllCategories() {
    return this.http.get(
      '/api/category'
    ).map(res => {
      return res.json();
    });
  }

  fetchAllTeams() {
    return this.http.get(
      '/api/team'
    ).map(res => {
      return res.json();
    });
  }

    createProject(params) {
    this.savingDraft.next(true);
    return this.http.post(
      '/api/projects',
      params
    ).map((res) => {
      let project = res.json();
      project = project.project;
      this.savingDraft.next(false);
      return project;
    });
  }

  removeFromDraftProject(params) {
    return this.http.post(
      '/api/projects',
      params
    ).map((res) => {
      let json = res.json();
      return json.project;
    });
  }

  getProjects() {
    return this.http.get(
      `/api/projects`
    ).map((res) => {
      let json = res.json();
      return json.project;
    });
  }

  getProjectsByCategory(category: string) {
    return this.http.get(
      `/api/projects/categories/${category}`
    ).map((res) => {
      let json = res.json();
      return json.project;
    });
  }

  fetchProject(id) {
    return this.http.get(
      `/api/projects/${id}`
    ).map((res) => {
      let json = res.json();
      return json.project;
    });
  }

  updateProject(project: Project) {
    this.savingDraft.next(true);
    console.log("sasdasd", project);
    return this.http.put(
      `/api/projects/${project.id}`, project
    ).map((res) => {
      let json = res.json();
      this.savingDraft.next(false);
      return json.project;
    });
  }

  initDraftProject() {
    return this.http.get(
      `/api/projects/draft`
    ).map((res) => {
      let project = res.json();
      project = project.project;
      return project;
    });
  }

  launchProject(id: string) {
    return this.http.post(
      `/api/projects/launch`, { id: id }
    ).map((res) => {
      return res.json();
    });
  }

  getVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  }

  getUserKycInfo() {
    return this.http.get(
      `/api/v1/users/get_user_kyc_info`
    ).map((res) => {
      return res.json();
    });
  }

  updateUserKycInfo(data) {
    this.savingDraft.next(true);
    return this.http.post(
      `/api/v1/users/update_user_kyc_info`, data
    ).map((res) => {
      this.savingDraft.next(false);
    });
  }

  reportProject(reason: string, id: number) {
    return this.http.post(
      `/api/v1/projects/report_project`, { reason: reason, id: id }
    ).map((res) => {
      return res.json();
    });
  }

  fetchProjectBackers(projectId: number) {
     return this.http.get(
      `/api/projects/get_project_backers?id=${projectId}`
    ).map((res) => {
      return res.json();
    });
  }

  sendNotification(projectId: number, description: string) {
    return this.http.post(
      `/api/projects/send_notifications_to_backers`, { description: description, id: projectId }
    ).map((res) => {
      return res.json();
    });
  }

  contribution(params) {
     console.log("entre al contribution, paso 1 http service") 
    return this.http.post(
      '/api/contribute',
      params
    ).map((res) => {
      let project = res.json();
      project = project.project;
      return project;
    });
  }

}
