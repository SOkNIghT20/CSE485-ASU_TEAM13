import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { SignUpForm} from '../../services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  newUser: SignUpForm = new SignUpForm();
  passwordCheck = '';
  errorMessage = '';
  successMessage = '';
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  register(): void {
    if (!this.newUser.password || !this.newUser.fname || !this.newUser.lname || !this.newUser.email){
  	    this.successMessage = '';
	    this.errorMessage = 'Error: Expected non-empty input';
	    return;
    }



    if (this.passwordCheck == this.newUser.password && this.newUser.password.length >= 7) {
      this.authService.register(this.newUser).subscribe(
	res => {
	    this.successMessage = res;
            this.errorMessage = '';
	  // this.router.navigate(['/']);
        },
	error => {
	  // console.log("error here with " + error.status);
	  if (error.status == 500) {
	    // console.log("there was an error");
            this.successMessage = '';
            this.errorMessage = 'there was an issue processing your request please try again later';
	  } else {
	  	this.successMessage = '';
	  	this.errorMessage = error.error;
	  }
        }
      );
    } else {
    	this.successMessage = '';
 	if (this.newUser.password.length < 7) {
		this.errorMessage = 'Please use a password of length greater than 7';
	} else {
		this.errorMessage = 'Passwords do not match';
	}
    }
  }

  togglePasswordVisibility(): void {
    const passwordInput = document.getElementById('password-input') as HTMLInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';

    const confirmPasswordInput = document.getElementById('confirm-password-input') as HTMLInputElement;
    confirmPasswordInput.type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
  }

}
