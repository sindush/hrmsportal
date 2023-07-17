import { Component } from '@angular/core';
import { UtilityService } from './shared/services/utility/utility.service';
import { SpinnerService } from './shared/services/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public spinnerService: SpinnerService) {}
  title = 'hrmsportal';
}
