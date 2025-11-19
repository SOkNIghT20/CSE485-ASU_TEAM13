import { OnInit} from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import {Router} from '@angular/router';
import { MediaTransferService } from '../../../services/media-transfer.service';
import { ProgressSpinnerComponent } from '../../shared/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-mediatransfer',
  templateUrl: './mediatransfer.component.html',
  styleUrls: ['./mediatransfer.component.scss']
})
export class TransferComponent implements OnInit {
  @ViewChild(ProgressSpinnerComponent) spinner!: ProgressSpinnerComponent;

  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  filenameRegex = /^[^\s\\/:\*\?"<>\|]+$/; // no spaces allowed
  warningMessage = '';
  errorMessage = '';
  successMessage = '';
  username = '';
  fileId = '';
  fileLinks = '';
  selectedFiles: File[] = [];
  message = '';
  subject = '';
  body = '';
  sender = '';
  recipient = '';
  showEmailForm = false;
  fileSelected = false;
  isUploading = false;
  uploadProgress: number | null = null;
  recipientEmails: string[] = [];
  currentEmail = '';
  uid = '';

  constructor(private router: Router, private mediaTransferService: MediaTransferService) {}

  ngOnInit() {
  }

  onFileSelected(event: any): void {
    this.addFiles(event);
    if(this.selectedFiles.length > 0){
      this.fileSelected = true;
      this.showEmailForm = true;
    }
  }

  addFiles(event: any): void {
    const files: FileList = event.target.files;
    const maxFileSize = 2 * 1024 * 1024 * 1024; // 2GB in bytes
    
    if (files) {
      for (let i = 0; i < files.length; i++) {
        // Check file size
        if (files[i].size > maxFileSize) {
          this.errorMessage = `File "${files[i].name}" exceeds the 2 GB size limit.`;
          this.successMessage = '';
          this.warningMessage = '';
          continue;
        }
        
        if(files[i].name.match(this.filenameRegex)){
          this.selectedFiles.push(files[i]);
        }
      }
    }
    event.target.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    if (this.selectedFiles.length === 0) {
      this.fileSelected = false;
      this.isUploading = false;
      this.showEmailForm = false;
    }
  }

  // addEmail and addEmailOnBlur likely both need checking for email validity
  addEmail(event: KeyboardEvent): void {
    event.preventDefault();
    const trimmed = this.currentEmail.trim();
    if(trimmed.match(this.emailRegex)){
this.recipientEmails.push(trimmed);
}
    this.currentEmail = '';
  }
  addEmailOnBlur(): void {
    const trimmed = this.currentEmail.trim();
    if(trimmed.match(this.emailRegex)){
this.recipientEmails.push(trimmed);
}
    this.currentEmail = '';
  }

  removeEmail(email: string): void {
    this.recipientEmails = this.recipientEmails.filter(e => e !== email);
  }

  downloadFile(username: string, fileId: string): void {

      this.mediaTransferService.downloadFile(username, fileId).subscribe(
        (response: any) => {
          this.successMessage = response.message;
          this.errorMessage = '';


        },
        (error) => {
          this.errorMessage = error.error?.message || 'An error occurred while downloading the file';
          this.successMessage = '';


        }
      );

  }

  uploadFile(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.warningMessage = '';
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'Please select a file to upload';
      return;
    }

    if (this.recipientEmails.length === 0) {
      this.warningMessage = 'Please enter at least one valid email.';
      this.errorMessage = '';
      this.successMessage = '';
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.spinner.simulateProgress();

    this.uid = '' + self.crypto.randomUUID();
    this.mediaTransferService.uploadMultipleFiles(this.recipientEmails[0], this.uid, this.selectedFiles).subscribe(
      (response: any) => {
        if (response.type === HttpEventType.Response) {
          console.log('Upload response:', response);
          const uploadedFileNames = this.selectedFiles.map(file => file.name).join(',');
          
          // Send email to all recipients
          this.recipientEmails.forEach((user) => {
            if (user && uploadedFileNames) {
              this.sendEmail(user, this.uid, uploadedFileNames, this.subject, this.body, this.sender);
            } else {
              this.warningMessage = 'All files uploaded successfully, No Email Sent';
            }
          });

          // Send confirmation email to sender if sender email is provided
          if (this.sender && this.sender.includes('@') && uploadedFileNames) {
            this.sendConfirmationToSender(this.sender, this.recipientEmails, uploadedFileNames);
          }

          this.uploadProgress = 100;
          this.isUploading = false;
          this.spinner.stopProgress();
        }
      },
      (error) => {
        console.error('Upload error:', error);
        this.errorMessage = error.status === 413
          ? 'One of the files exceeds the 2 GB size limit.'
          : error.error?.message || 'An error occurred while uploading the files';

        this.successMessage = '';
        this.warningMessage = '';
        this.uploadProgress = null;
        this.isUploading = false;
        this.spinner.stopProgress();
      }
    );
  }

  sendEmail(username: string, uid: string, fileId: string, subject: string, body: string, sender: string): void {
    const recipients = username.split(',').map(email => email.trim()).filter(email => email.includes('@'));

    if (recipients.length === 0) {
      this.successMessage = '';
      this.errorMessage = '';
      this.warningMessage = 'Invalid Email(s) entered';
      return;
    }

    recipients.forEach(email =>{
      if(!username || !username.includes('@')) {
        this.successMessage = '';
          this.errorMessage = '';
          this.warningMessage = 'Invalid Email(s) entered';
        return;
      }
      this.mediaTransferService.sendEmail(username, uid, fileId, subject, body, sender).subscribe(
        (response: any) => {
          this.successMessage = 'Files uploaded and emails sent successfully!';
          this.errorMessage = '';
          this.warningMessage = '';
        },
        (error) => {
          this.errorMessage = 'Error Sending Email';
          this.successMessage = '';
          this.warningMessage = '';
        }
      );
    });
  }

  sendConfirmationToSender(senderEmail: string, recipients: string[], fileNames: string): void {
    const recipientList = recipients.join(', ');
    const confirmationSubject = 'DigiClips - Media Transfer Confirmation';
    const confirmationBody = `Your files (${fileNames}) have been successfully sent to: ${recipientList}`;
    
    this.mediaTransferService.sendEmail(
      senderEmail, 
      this.uid, 
      fileNames, 
      confirmationSubject, 
      confirmationBody, 
      'DigiClips Media Transfer'
    ).subscribe(
      (response: any) => {
        console.log('Confirmation email sent to sender');
      },
      (error) => {
        console.error('Error sending confirmation to sender:', error);
      }
    );
  }
}
