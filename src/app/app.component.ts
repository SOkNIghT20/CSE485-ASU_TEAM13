import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { NavigationEnd } from '@angular/router'; // Import NavigationEnd
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Role } from '@/models/role';
import { User } from '@/models/user';
import { GlobalVariables } from './common/global-variables';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentUser: User;
  public static logoImage = null;

  constructor(private router: Router, public auth: AuthService, private http: HttpClient) {
      this.auth.currentUser.subscribe(x => this.currentUser = x);
      this.auth.isVerifiedToAccess();
  }

  ngOnInit(): void {
    // this.http.get('/requestLogo')
    //   .subscribe(res => {
    //     AppComponent.logoImage = res;
    //   });
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  get isAccountVerifier() {
    if (this.currentUser) {
      return this.currentUser.email === 'bobshapiro40@gmail.com' || this.currentUser.email === 'demo@gmail.com' || this.currentUser.email === 'hbremers@gmail.com';
    } else {
      return false;
    }
  }

  getCompanyName() {
    return GlobalVariables.companyName;
  }

  getCompanyLogo() {
    return AppComponent.logoImage;
  }

  logout() {
    this.auth.logout();
  }

  // Add this function to handle navigation to the search page
  navigateToSearch() {
    const currentRoute = this.router.url;
    if (currentRoute === '/search') {
      location.reload();
    } else {
      this.router.navigate(['/search']);
    }
  }

  // Function to handle navigation to the alerts page
  navigateToAlerts(){
    const currentRoute = this.router.url;
    if(currentRoute == '/alerts'){
      location.reload();
    }else{
      this.router.navigate(['/alerts']);
    }
  }

  navigateToMedia(){
    const currentRoute = this.router.url;
    if(currentRoute == '/mediaAnalytics'){
      location.reload();
    }else{
      this.router.navigate(['/mediaAnalytics']);
    }
  }

  navigateToTransfer(){
    const currentRoute = this.router.url;
    if(currentRoute == '/mediaTransfer'){
      location.reload();
    }else{
      this.router.navigate(['/mediaTransfer']);
    }
  }

  navigateToTransferSuccess(){
    const currentRoute = this.router.url;
    if(currentRoute == '/mediaTransfer/success'){
      location.reload();
    }else{
      this.router.navigate(['/mediaTransfer/success']);
    }
  }

  navigateToTransferError(){
    const currentRoute = this.router.url;
    if(currentRoute == '/mediaTransfer/error'){
      location.reload();
    }else{
      this.router.navigate(['/mediaTransfer/error']);
    }
  }

  navigateToTransferRedirect(){
    const currentRoute = this.router.url;
    if(currentRoute == '/mediaTransfer/redirect'){
      location.reload();
    }else{
      this.router.navigate(['/mediaTransfer/redirect']);
    }
  }

  navigateToUser(){
    const currentRoute = this.router.url;
    if(currentRoute == '/profile'){
      location.reload();
    }else{
      this.router.navigate(['/profile']);
    }
  }

  navigateToContact(){
    const currentRoute = this.router.url;
    if(currentRoute == '/contactUs'){
      location.reload();
    }else{
      this.router.navigate(['/contactUs']);
    }
  }

  navigateToHelp(){
    const currentRoute = this.router.url;
    if(currentRoute == '/helpPage'){
      location.reload();
    }else{
      this.router.navigate(['/helpPage']);
    }
  }

  navigateToSurvey(){
    const currentRoute = this.router.url;
    if(currentRoute == '/survey'){
      location.reload();
    }else{
      this.router.navigate(['/survey']);
    }
  }
}
