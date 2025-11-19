import { OnInit} from '@angular/core';
import {Component} from '@angular/core';
import {AddMediaService} from '../services/addmedia.service';

/**
 * The magazine object to create.
 */
export class Radio {
  name = '';
  url = '';
  country = '';
  state = '';
  city = '';
}

@Component({
  selector: 'app-addRadio',
  templateUrl: './addRadio.component.html',
  styleUrls: ['./addRadio.component.scss']
})

/**
 * Adds a new radio to the database.
 */
export class AddRadioComponent implements OnInit {
  radio: Radio = new Radio();

  ngOnInit(): void {}

  constructor(private addMediaService: AddMediaService) {
  }

  /**
   * Sends the new radio to the database and displays a response message.
   */
  addRadio(): void {
    this.addMediaService.addRadioToDatabase(this.radio).subscribe(
      // res => {
      //   // Alert user of success/failure
      //   if (res.status === 200) {
      //     alert("Successful add of radio to database.");
      //   } else {
      //     alert("Failure adding radio to database.");
      //   }
      // }
    );
    this.radio = new Radio();
  }

  /**
   * Validates that all input criteria has been given.
   */
  checkFilled(): boolean {
    return this.radio.name != '' && this.radio.url != ''
      && this.radio.country != '' && this.radio.state != '' && this.radio.city != '';
  }
}
