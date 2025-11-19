import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Project components
import { LoggedInGuard } from './logged-in.guard';
import { AuthService } from '../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        LoggedInGuard,
        AuthService
      ]
    });
  });

  it('should be created', inject([LoggedInGuard], (guard: LoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});
