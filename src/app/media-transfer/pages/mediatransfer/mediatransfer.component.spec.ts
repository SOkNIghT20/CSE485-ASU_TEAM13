// External libraries
import type { ComponentFixture} from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MediaTransferService } from '../../../services/media-transfer.service';

// Created and Edited by Jisan Amin 3/17/2025

// Project components
import { TransferComponent } from './mediatransfer.component';

describe('TransferComponent', () => {
  let component: TransferComponent;
  let fixture: ComponentFixture<TransferComponent>;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let compiled: any;
  let mediaTransferService: MediaTransferService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule,

      ],
      declarations: [
        TransferComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    mediaTransferService = TestBed.inject(MediaTransferService);


    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  afterEach(() => {
    httpMock.verify(); // Ensures no unmatched requests remain
  });

  // Frontend Display Test Cases

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "media transfer request"', async(() => {
    expect(compiled.querySelector('.main-text-box').textContent)
      .toMatch('media transfer request');
  }));

  it('should display the username input', async(() => {
    expect(compiled.querySelector('#username-input')).not.toBeNull();
  }));

  it('should display the fileid input', async(() => {
    expect(compiled.querySelector('#file-id-input')).not.toBeNull();
  }));

  it('should display the transfer button', async(() => {
    expect(compiled.querySelector('#transfer-btn')).not.toBeNull();
  }));

  it('should display the cancel button', async(() => {
    expect(compiled.querySelector('#cancel-btn')).not.toBeNull();
  }));

  // File Upload Test Cases

  describe('File Upload', () => {
    it('should set an error message if no file is selected', () => {
      component.uploadFile('henry');
      expect(component.errorMessage).toBe('Please select a file to upload');
    });

    it('should upload a file successfully', () => {
      spyOn(mediaTransferService, 'uploadFile').and.returnValue(of({ message: 'Upload successful' }));

      component.selectedFiles[0] = new File(['test content'], 'test.txt', { type: 'text/plain' });
      component.uploadFile('henry');

      expect(component.successMessage).toBe('Upload successful');
      expect(component.errorMessage).toBe('');
    });

    it('should handle file upload errors', () => {
      spyOn(mediaTransferService, 'uploadFile').and.returnValue(throwError({ error: { message: 'Upload failed' } }));

      component.selectedFiles[0] = new File(['test content'], 'test.txt', { type: 'text/plain' });
      component.uploadFile('henry');

      expect(component.errorMessage).toBe('Upload failed');
      expect(component.successMessage).toBe('');
    });
  });

  // File Download Test Cases

  describe('File Download', () => {
    it('should download a file successfully', () => {
      spyOn(mediaTransferService, 'downloadFile').and.returnValue(of({ message: 'Download successful' }));

      component.downloadFile('henry', 'file123');

      expect(component.successMessage).toBe('Download successful');
      expect(component.errorMessage).toBe('');
    });

    it('should handle download errors', () => {
      spyOn(mediaTransferService, 'downloadFile').and.returnValue(throwError({ error: { message: 'Download failed' } }));

      component.downloadFile('henry', 'file123');

      expect(component.errorMessage).toBe('Download failed');
      expect(component.successMessage).toBe('');
    });
  });
});


