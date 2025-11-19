import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import { HttpClient} from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import { SendEmailService } from '../services/sendemail.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contactUs',
  templateUrl: './contactUs.component.html',
  styleUrls: ['./contactUs.component.scss']
})
export class ContactUsComponent implements OnInit {

  email  = '';
  info = '';
  errorMessage = '';
  url = '';
  constructor(private http: HttpClient, private authService: AuthService,  private emailService: SendEmailService) {
  	this.authService.isVerifiedToAccess();
  }

  ngOnInit() {
  }

  submitForm() {
     window.confirm('Are you sure you want to submit?');
     // window.alert("Form submitted");
     this.sendForm();

     // window.location.href= '/search.html';
     window.alert('Form sent');

  }

  sendForm(){
    // let params: URLSearchParams = new URLSearchParams();
    // params.set('email', this.email);
    // params.set('info', this.info);
    // this.url = 'http://localhost:3000/sendForm';

    this.emailService.sendForm(this.email,this.info).subscribe();


    // window.open('http://localhost:3000/sendForm?' + this.email + this.info));
  //  this.http.get(this.url, {params:params});


    // this.emailService.sendForm(this.email, this.info);
  }


}
