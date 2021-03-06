import { UserActions } from './actions/user.actions';
import { UserService } from './services/user.service';
import { TeamFormService } from './services/forms/team-form.service';
import { TeamEditService } from './services/forms/team-edit.service';
import { TeamHttpService } from './services/https/team-http.service';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './effects/user.effects';
import { routes } from './user.routes';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { EasyPieChartModule } from 'ng2modules-easypiechart';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { UserComponent } from './user.component';
import { NameContactsInfoComponent } from './components/name-contacts-info/name-contacts-info.component';
import { QuickViewComponent } from './components/quick-view/quick-view.component';
import { BackedProjectsComponent } from './components/backed-projects/backed-projects.component';
import { ProjectBackersComponent } from './components/project-backers/project-backers.component';
import { UserCampaignsComponent } from './components/user-campaigns/user-campaigns.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { CreateTeamsComponent } from './components/create-team/create-team.component';
import { CreatedTeamsComponent } from './components/created-teams/created-teams.component';
import { EditarTeamsComponent } from './components/editar-team/editar-team.component';
import { LeaderSettingsComponent } from './components/leader-settings/leader-settings.component';
import { TeamMembersComponent } from './components/leader-settings/team-members/team-members.component';
import { BasicInfoComponent } from './components/name-contacts-info/basic-info/basic-info.component';
import { PaymentInfoComponent } from './components/name-contacts-info/payment-info/payment-info.component';
import { EmailPasswordComponent } from './components/name-contacts-info/email-password/email-password.component';
import { SocialMediaLinksComponent } from './components/name-contacts-info/social-media-links/social-media-links.component';
import { ProfilePicComponent } from './components/name-contacts-info/profile-pic/profile-pic.component';
import { UserNotificationsComponent } from './components/user-notifications/user-notifications.component';
import { BackedTotalComponent } from './components/backed-total/backed-total.component';
import { TruncatePipe } from './../core/pipes/truncate';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';




@NgModule({
  imports: [
    RouterModule.forChild(routes),
    EffectsModule.run(UserEffects),
    SharedModule,
    NgxDatatableModule,
    EasyPieChartModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    NgSelectModule,
  ],
  declarations: [
    UserComponent,
    NameContactsInfoComponent,
    QuickViewComponent,
    BackedProjectsComponent,
    ProjectBackersComponent,
    UserCampaignsComponent,
    ComingSoonComponent,
    CreateTeamsComponent,
    CreatedTeamsComponent,
    EditarTeamsComponent,
    LeaderSettingsComponent,
    TeamMembersComponent,
    BasicInfoComponent,
    PaymentInfoComponent,
    EmailPasswordComponent,
    SocialMediaLinksComponent,
    ProfilePicComponent,
    BackedTotalComponent,
    UserNotificationsComponent,
    TruncatePipe
  ],
  providers: [
    UserService,
    UserActions,
    TeamFormService,
    TeamEditService,
    TeamHttpService
  ],
  entryComponents: [
    TeamMembersComponent
  ]
})
export class UserModule { }
