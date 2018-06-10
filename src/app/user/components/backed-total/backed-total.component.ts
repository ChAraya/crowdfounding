
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
import { ModalDirective } from 'ngx-bootstrap';

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
  @ViewChild('lgModal') lgModal: ModalDirective;
  @Output()
  teamId = new EventEmitter<any>();
  @ViewChild('imageUpload') imageUpload: ImageUploadComponent;
  selectedDate = new Date();
  projectId: any;
  formSubmit = false;
  projectForm: FormGroup;
  categories = [];
  backed: any;
  authUser: AuthUser;
  role_id: any;

  rows = [];
  columns = [
    { prop: 'Nombre' },
    { prop: 'Telefono' },
    { prop: 'Email' },
    { prop: 'Monto' }
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

  openModal(id){
    this.teamHttpService.getBackers(id).subscribe((data) => {
      this.rows = data.project;
      this.projectId = id;
      this. showModal();
    });
    //this.teamId.emit(id)    
  }

  showModal() {
    this.lgModal.show();
  }

  hideModal() {
    this.lgModal.hide();
  }

  download(){
    this.teamHttpService.getBackers(this.projectId).subscribe((data) => {
      let csvHeader = [
        'Nombre',
        'Telefono',
        'Email',
        'Monto'
      ]
      let csv =  data.project;
      let csvData = this.ConvertToCSV(csv, csvHeader);
      let blob = new Blob([csvData], { type: 'text/csv' });
      let dwldLink = document.createElement("a");
      let url= window.URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
          if (isSafariBrowser) { //if Safari open in new window to save file with random filename.
              dwldLink.setAttribute("target", "_blank");
          }
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", "Enterprise.csv");
          dwldLink.style.visibility = "hidden";
          document.body.appendChild(dwldLink);
          dwldLink.click();
          document.body.removeChild(dwldLink);
    });

    
    
  }

  ConvertToCSV(objArray, headerList) {
    //console.log('convert to array called');
     var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
     var str = '';
     var row = 'N°,';

     for (var index in headerList) { //objArray[0]
         //Now convert each value to string and comma-separated
         row += headerList[index] + ',';
     }
     row = row.slice(0, -1);
     //append Label row with line break
     str += row + '\r\n';
     for (var i = 0; i < array.length; i++) {
         var line = (i+1)+'';
         for (var index in headerList) {//array[i]
            let head = headerList[index];

             //if (line != '') line += ','
             line += ',' + array[i][head];
         }
         str += line + '\r\n';
     }
     return str;
 }



}
