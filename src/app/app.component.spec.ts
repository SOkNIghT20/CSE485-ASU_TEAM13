// External libraries
import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
// import { XHRBackend } from "@angular/common/http";
import { HttpXhrBackend } from '@angular/common/http';
// import { MockBackend } from "@angular/common/http/testing"; DEPRECATED
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Project services
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: HttpXhrBackend},
        UserService,
        AuthService
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
