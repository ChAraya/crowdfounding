import { DateService } from './../core/services/date.service';
import { getAllProjects } from './../project/reducers/project.selector';
import { ProjectActions } from './../project/actions/project.actions';
import { AppState } from './../app.state';
import { Project } from './../core/models/project';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-projects-listing',
  templateUrl: './projects-listing.component.html',
  styleUrls: ['./projects-listing.component.scss']
})
export class ProjectsListingComponent implements OnInit, OnDestroy {

  categorySub$: Subscription;
  routeSub$: Subscription;
  category: string;
  projects: Project[];
  trendingProject: Project;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private projectActions: ProjectActions,
    private dateService: DateService
  ) {
    this.routeSub$ = this.route.params.subscribe((params) => {
      this.category = params['category'];
      this.category = this.category.replace("_"," ")
      this.store.dispatch(this.projectActions.fetchCategoryProjects(this.category));
    });
    console.log(this.category.replace("_"," "));
    this.categorySub$ = this.store.select(getAllProjects)
    .map((projects: Project[]) => {
      if(this.category.replace("_"," ") == 'Todo'){
        return projects;
      }else{
        console.log(this.category.replace("_"," "));
        return projects.filter((project) => project.category_name === this.category.replace("_"," "));
      }
    }).subscribe((projects) => {
      this.projects = projects;
      this.trendingProject = this.projects[0];
      console.log(this.projects);
    });

  }

  ngOnInit() {
  }

  daysToGo(end_date) {
    return this.dateService.daysBetweenDates(new Date(), end_date);
  }

  ngOnDestroy() {
    this.categorySub$.unsubscribe();
    this.routeSub$.unsubscribe();
  }

  CortarDescripcion(aux: String){
    var desc :String = aux
    //  if(desc.length > 130){
    //    desc = "<p>" + desc.slice(3,130) + "</p>";
    //  }
    console.log(desc);
    return desc;
  }
}
