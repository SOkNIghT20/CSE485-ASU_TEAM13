import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { GlobalVariables } from '../common/global-variables';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
declare let jquery:any;
declare let $ :any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  password = '';
  email  = '';
  errorMessage = '';
  onMain = false;
  url = environment.serverUrl;
  termsAndServicesLocation = environment.serverUrl + '/' +  environment.termsOfUseDocumentName;

  // New properties for demo request modal
  showDemoRequestModal = false;
  demoRequestSubmitted = false;

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.errorMessage = '';
    this.httpClient.get<any>(this.url + '/getCompanyName').subscribe(
      res => {
        GlobalVariables.companyName = res;
        console.log('Company Name 1: ' + res);
      },
      err => {
        console.error('Error fetching company name:', err);
      }
    );
    console.log('Company Name 2: ' + GlobalVariables.companyName);
  }

  // Replace continueAsGuest with applyForDemo
  applyForDemo() {
    const ele = document.getElementById('check1') as HTMLInputElement;
    if (!ele.checked) {
      this.errorMessage = 'Please accept the terms and conditions to continue';
      return;
    }

    // Clear any previous error messages
    this.errorMessage = '';

    // Check if user already has an approved demo
    this.authService.checkDemoStatus().subscribe({
      next: (response) => {
        if (response.approved) {
          // User has an approved demo, proceed with guest login
          this.continueAsGuestWithApprovedDemo();
        } else {
          // Show the demo request modal
          this.showDemoRequestModal = true;
        }
      },
      error: (err) => {
        console.error('Demo status check error:', err);
        this.errorMessage = 'Error checking demo status. Please try again.';
      }
    });
  }

  // Original continueAsGuest logic, now only called for approved demos
  continueAsGuestWithApprovedDemo() {
    this.authService.setGuestUser().subscribe({
      next: (user) => {
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        } else {
          window.location.href = '/search';
        }
      },
      error: (err) => {
        console.error('Guest registration error:', err);
        this.errorMessage = 'Error registering as guest. Please try again.';
      }
    });
  }

  // Keep the original for backward compatibility
  continueAsGuest() {
    this.applyForDemo();
  }

  // Handle demo request modal close
  onDemoModalClose() {
    this.showDemoRequestModal = false;
  }

  // Handle demo request submission
  onDemoRequestSubmitted() {
    this.showDemoRequestModal = false;
    this.demoRequestSubmitted = true;
  }

  loginclicked() {
    const ele = document.getElementById('check1') as HTMLInputElement;
    if (!ele.checked) {
      this.errorMessage = 'Please accept the terms and conditions to continue';
      return;
    }

    this.login();
  }

  login() {
    console.log('Try email: ', this.email);

    this.authService.login(this.email, this.password).subscribe(
      res => {
        window.location.reload();
      },
      err => {
        if (err.status == 500) {
          this.errorMessage = 'Sorry we are unable to log you in at this time';
        } else {
          this.errorMessage = err.error;
        }
        console.error('Login error:', err);
      }
    );
  }

  getTermsAndServicesLocation() {
    return this.termsAndServicesLocation;
  }

  togglePasswordVisibility(): void {
    const passwordInput = document.getElementById('password-input') as HTMLInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

}
