import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GlobalVariables } from '../../common/global-variables';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  errorMessage = '';

  currentPassword  = '';
  newPassword  = '';
  newPasswordCopy  = '';

  constructor(private authService: AuthService) {
 	this.authService.isVerifiedToAccess();
  }

  ngOnInit() {
  }

  submit() {
  }

  changePassword(){
    // var email = JSON.parse(localStorage.getItem('user')).email;
    const email = GlobalVariables.userEmail;
    this.authService.changepassword({password : this.currentPassword, email,
                                     newPassword : this.newPassword}).subscribe( res => {

    },
    err => {
      if (err.status == 500) {
        this.errorMessage = 'there was an issue processing your request please try again later';
      }
      if (err.status == 400) {
        this.errorMessage =  err._body;
      }
    });
  }

  togglePasswordVisibility(): void {
    const currentPasswordInput = document.getElementById('current-password-input') as HTMLInputElement;
    currentPasswordInput.type = currentPasswordInput.type === 'password' ? 'text' : 'password';

    const newPasswordInput = document.getElementById('new-password-input') as HTMLInputElement;
    newPasswordInput.type = newPasswordInput.type === 'password' ? 'text' : 'password';

    const confirmPasswordInput = document.getElementById('confirm-password-input') as HTMLInputElement;
    confirmPasswordInput.type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
  }

}
