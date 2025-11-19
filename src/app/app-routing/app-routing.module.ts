// External Libraries
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

// Project Components
import { VideoEditorComponent } from '../video-editor/video-editor.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../login/register/register.component';
import { ProfileComponent } from '../login/profile/profile.component';
import { AlertsComponent } from '../login/alerts/alerts.component';
import { SearchComponent } from '../search/search.component';
import { AddNewspaperComponent } from '../add-newspaper/addNewspaper.component';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { AuthGuard } from '../guards/auth.guard';
import { CustomizeLogoComponent } from '../customize-logo/customizeLogo.component';
import { AddMagazineComponent } from '../add-magazine/addMagazine.component';
import { AddRadioComponent } from '../add-radio/addRadio.component';
import { NewAlertsComponent } from '../login/newAlerts/newAlerts.component';
import { ContactUsComponent } from '../contactUs/contactUs.component';
import { HelpPageComponent } from '../helpPage/helpPage.component';
import { MediaAnalyticsComponent } from '../mediaAnalytics/mediaAnalytics.component';
import { TransferComponent } from '../media-transfer/pages/mediatransfer/mediatransfer.component';
import { TransferSuccessComponent } from '../media-transfer/pages/success/success.component';
import { TransferErrorComponent } from '../media-transfer/pages/error/error.component';
import { TransferRedirectComponent } from '../media-transfer/pages/redirect/redirect.component';
import { PasswordRecoveryComponent } from '../login/passwordRecovery/passwordRecovery.component';
import { SurveyComponent } from '../survey/survey.component';
import { Role } from '@/models/role';



const routes: Routes = [
    { path: 'video-editor', component: VideoEditorComponent },
    {
        path: '',
        component: LoginComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'passwordRecovery',
        component: PasswordRecoveryComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'alerts',
        component: AlertsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'search',
        component: SearchComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'customizeLogo',
        component: CustomizeLogoComponent,
        canActivate: [AuthGuard],
        data: {roles: [Role.Admin]}
    },
    {
        path: 'addNews',
        component: AddNewspaperComponent,
        canActivate: [AuthGuard],
        data: {roles: [Role.Admin]}
    },
    {
        path: 'addMags',
        component: AddMagazineComponent,
        canActivate: [AuthGuard],
        data: {roles: [Role.Admin]}
    },
    {
        path: 'addRads',
        component: AddRadioComponent,
        canActivate: [AuthGuard],
        data: {roles: [Role.Admin]}
    },
    {
        path: 'newAlerts',
        component: NewAlertsComponent,
        canActivate: [AuthGuard]
    },
    {
      path: 'contactUs',
      component: ContactUsComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'helpPage',
      component: HelpPageComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'survey',
        component: SurveyComponent,
        canActivate: [AuthGuard]
      },
    {
        path: 'mediaAnalytics',
        component: MediaAnalyticsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'mediaTransfer',
        component: TransferComponent,
        // canActivate: [AuthGuard]  // Removed auth requirement for direct access
    },
    {
        path: 'mediaTransfer/success',
        component: TransferSuccessComponent,
        // canActivate: [AuthGuard]
    },
    {
        path: 'mediaTransfer/error',
        component: TransferErrorComponent,
        // canActivate: [AuthGuard]
    },
    {
        path: 'languageTranslation',
        component: TransferComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'media-download/:email/:fileId',
        component: TransferRedirectComponent,
        // canActivate: [AuthGuard]
    },

    // otherwise redirect to SearchComponent
    { path: '**', redirectTo: ''}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
