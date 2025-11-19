// External libraries
import { inject, TestBed } from '@angular/core/testing';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Project components
import { UserService } from './user.service';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {provide: XHRBackend, useClass: MockBackend},
        UserService
      ]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
