// External libraries
import type { ComponentFixture} from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Project components
import { RegisterComponent } from './register.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule,

      ],
      declarations: [
        RegisterComponent
      ],
      providers: [
        {provide: XHRBackend, useClass: MockBackend},
        UserService, AuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "registration"', async(() => {
    expect(compiled.querySelector('.main-text-box').textContent)
      .toMatch('registration');
  }));

  it('should display the username input', async(() => {
    expect(compiled.querySelector('#username-input')).not.toBeNull();
  }));

  it('should display the first name input', async(() => {
    expect(compiled.querySelector('#first-name-input')).not.toBeNull();
  }));

  it('should display the last name input', async(() => {
    expect(compiled.querySelector('#last-name-input')).not.toBeNull();
  }));

  it('should display the password input', async(() => {
    expect(compiled.querySelector('#password-input')).not.toBeNull();
  }));

  it('should display the confirm password input', async(() => {
    expect(compiled.querySelector('#confirm-password-input')).not.toBeNull();
  }));

  it('should display the register button', async(() => {
    expect(compiled.querySelector('#register-btn')).not.toBeNull();
  }));

  it('should display the cancel button', async(() => {
    expect(compiled.querySelector('#cancel-btn')).not.toBeNull();
  }));

  // TODO: unit test register()
});
