import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
// import { UserService } from "../../services/user.service";
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { GlobalVariables } from "../../common/global-variables";




@Component({
   selector: 'app-login',
   templateUrl: './passwordRecovery.component.html',
   styleUrls: ['./passwordRecovery.component.scss']
 })

 export class PasswordRecoveryComponent implements OnInit {
  errorMessage = '';
  email = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.errorMessage = '';
  }

  /*
  * Verifies that the given email belongs to a user and if so it sends a verification link to it
  */
  SendResetLink() {
  console.log('Email to check:', this.email);

  this.authService.checkEmailExists(this.email).subscribe(
    (response) => {
      console.log('Response from checkEmailExists:', response);
      if (response.exists) {
        alert('Good'); // Email exists
      } else {
        alert('Bad'); // Email does not exist
      }
    },
    (error) => {
      console.error('Error checking if email exists', error);
      alert('Error occurred');
    }
  );
}



}
