import { ToastyService } from 'ng2-toasty';
import { DateService } from './../../../core/services/date.service';
import { ProjectHttpService } from './../../services/http/project-http.service';
import { ProjectActions } from './../../actions/project.actions';
import { ActivatedRoute } from '@angular/router';
import { getSelectedProject } from './../../reducers/project.selector';
import { CommentActions } from './../../actions/comment.actions';
import { Subscription } from 'rxjs/Subscription';
import { Project } from './../../../core/models/project';
import { Observable } from 'rxjs/Observable';
import { AppState } from './../../../app.state';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  projectSub$: Subscription;
  routeSub$: Subscription;
  project: any;
  selectedTab = 1;
  amount: number;
  safeEmbedUrl: SafeResourceUrl;
  carouselIndex = 0;

  //variables
  nombre: string;
  telefono: string;
  correo: string;
  aporte: string;
  fonook: boolean;
  emailok: boolean;
  montook: boolean;
  nameok: boolean;
  lnameok: boolean;

  constructor(
    private store: Store<AppState>,
    private commentActions: CommentActions,
    private route: ActivatedRoute,
    private projectActions: ProjectActions,
    private projectHttpService: ProjectHttpService,
    private sanitizer: DomSanitizer,
    private zone: NgZone,
    private dateService: DateService,
    private metaService: Meta,
    private toastyService: ToastyService,
    ) {
    this.routeSub$ = this.route.params.subscribe((params) => {
      const id = params['id'];
      this.store.dispatch(this.projectActions.fetchProject(id));
    });

    this.projectSub$ = this.store.select(getSelectedProject).subscribe((project) => {
      this.project = project;
      if (this.project) {
        // this.removeMetaTags();
        this.addMetaTags();
        this.zone.run(() => {
          this.getVideoEmbedUrl(this.project.video_url);
        });
      }
    });
  }

  ngOnInit() {}

  changeTab(number) {
    this.selectedTab = number;
  }

  showImage(index) {
    this.carouselIndex = index;
  }

  getVideoThumbnail(url) {
    const videoId = this.projectHttpService.getVideoId(url);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
    return thumbnailUrl;
  }

  getVideoEmbedUrl(url) {
    if (!url) {
      return;
    }
    const videoId = this.projectHttpService.getVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
    this.safeEmbedUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  daysToGo() {
    this.dateService.daysBetweenDates(this.project.start_date, this.project.end_date);
  }

  ngOnDestroy() {
    this.store.dispatch(this.commentActions.clearComments());
    this.projectSub$.unsubscribe();
    this.routeSub$.unsubscribe();
  }

  removeMetaTags() {
    this.metaService.removeTag('title');
  }

  addMetaTags() {
    this.metaService.addTag({name: 'title',  content: this.project.title});
  }

  guardarRegistro(name:string, lname:string, fono:string, email:string, monto:string){
    this.fonook = true;
    this.emailok = true;
    this.montook = true;
    this.nameok = true;
    this.lnameok = true;

    if (name != ''){
      this.nombre = name
    }else{
      this.nameok=false;
    }

    if (lname != ''){
      this.nombre = this.nombre + ' ' + lname;
    }else{
      this.lnameok = false;
    }
    
    if (+fono && this.verificartelefono(fono)==true){
      this.telefono = '+569'+fono;
    }else{
      this.fonook=false;
    }
    if (this.verificaremail(email) == true){
      this.correo = email;
    }else{
      this.emailok=false;
    }
    if (+monto>=1){
      this.aporte = monto;
    }else{
      this.montook=false;
    }

    if (this.fonook==true && this.emailok==true && this.montook==true && this.nameok==true && this.lnameok==true){
      this.contribution();
      this.toastyService.success('Aporte recibido con éxito');
    }else{
      if (this.nameok==false) {
        this.toastyService.error('Nombre no válido');
      }
      if (this.lnameok==false) {
        this.toastyService.error('Apellidos no válidos');
      }
      if (this.fonook==false) {
        this.toastyService.error('Ingresar Teléfono Válido');
      }
      if (this.emailok==false) {
        this.toastyService.error('Ingresar Correo Electrónico Válido');
      }
      if (this.montook==false) {
        this.toastyService.error('Ingresar Monto Válido');
      }
    }
  }


  contribution() {
    let aux = {nombre:this.nombre, telefono:this.telefono, correo:this.correo,aporte:this.aporte}

    this.projectHttpService.contribution(aux)
      .subscribe((res) => {
        let respuesta = res;
        console.log(respuesta);
      if (!respuesta.status) {
        this.toastyService.error('Error en el ingreso');
      }else{
        this.toastyService.success('Gracias por tu aporte!');
      }
    });;

  }
  
  verificaremail(email:string){
    var trigger = email,
    regexp = new RegExp('^(([^<>()[\\]\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$'),
    test = regexp.test(trigger);
    console.log("email: " + test);
    return test;
  }

  verificartelefono(fono:string){
    var trigger = fono,
    regexp = new RegExp('^[1-9][0-9]\\d{6}$'),
    test = regexp.test(fono);
    console.log("fono: " + regexp.test(fono))
    return regexp.test(fono);
  }
}
