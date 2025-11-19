// External libraries
import type { ComponentFixture} from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Project components
import { LoginComponent } from './login.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        LoginComponent
      ],
      providers: [
        {provide: XHRBackend, useClass: MockBackend},
        UserService, AuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Digiclips search engine"', async(() => {
    expect(compiled.querySelector('.welcome-box').textContent)
      .toMatch('DigiClips search engine');
  }));

  it('should display the email input', async(() => {
    expect(compiled.querySelector('#email-input')).not.toBeNull();
  }));

  it('should display the password input', async(() => {
    expect(compiled.querySelector('#password-input')).not.toBeNull();
  }));

  it('should display the login button', async(() => {
    expect(compiled.querySelector('#login-btn').textContent)
      .toMatch('login');
  }));

  it('should display the register link', async(() => {
    expect(compiled.querySelector('#register-link').textContent)
      .toMatch('register');
  }));

  it('should display the forgot-password link', async(() => {
    expect(compiled.querySelector('#forgot-password').textContent)
      .toMatch('forgot password?');
  }));
});
