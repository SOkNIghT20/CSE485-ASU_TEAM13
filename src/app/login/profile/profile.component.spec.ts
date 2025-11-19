// External libraries
import type { ComponentFixture} from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Project components
import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        ProfileComponent
      ],
      providers: [
        {provide: XHRBackend, useClass: MockBackend},
        UserService, AuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "editing user profile"', async(() => {
    expect(compiled.querySelector('.main-text-box').textContent)
      .toMatch('editing user profile');
  }));

  it('should display the current password input', async(() => {
    expect(compiled.querySelector('#current-password-input')).not.toBeNull();
  }));

  it('should display the new password input', async(() => {
    expect(compiled.querySelector('#new-password-input')).not.toBeNull();
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
});
