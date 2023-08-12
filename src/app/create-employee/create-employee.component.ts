import { UtilityService } from './../shared/services/utility/utility.service';
import { employeeDetails } from './../shared/interface/employeeDetails';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ApiService } from '../shared/services/apiendpoint/api.service';
import { EmployeeState } from '../store/state/employee.state';
import { Store } from '@ngrx/store';
import {
  addEmployee, updateEmployee
} from '../store/state/employee.actions';
import { getEmployeeDetailsList } from '../store/state/employee.selector';
// import { PhoneValidator } from '../shared/validators/phone.validator';
// import { Country, UsernameValidator, ParentErrorStateMatcher, PasswordValidator, PhoneValidator } from '../validators';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent implements OnInit {
  CREATE = 'Create';
  UPDATE = 'Update';
  userDetailsForm: FormGroup;
  matching_passwords_group: FormGroup;
  country_phone_group: FormGroup;
  genders = ['Masculino', 'Femenino'];
  countries = [
    // new Country('AR', 'Argentina'),
    // new Country('UY', 'Uruguay'),
    // new Country('US', 'United States')
  ];
  validation_messages = {
    first_name: [{ type: 'required', message: 'First name is required' }],
    last_name: [{ type: 'required', message: 'Last name is required' }],
    company_name: [{ type: 'required', message: 'Company is required' }],
    address: [{ type: 'required', message: 'Address is required' }],
    city: [{ type: 'required', message: 'City is required' }],
    county: [{ type: 'required', message: 'Country is required' }],
    postal: [{ type: 'required', message: 'Postal code is required' }],
    phone1: [
      { type: 'required', message: 'Primary phone number is required' },
      { type: 'pattern', message: 'Enter valid phone number' },
    ],
    phone2: [{ type: 'pattern', message: 'Enter valid phone number' }],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter valid email' },
    ],
    gender: [{ type: 'required', message: 'Gender is required' }],
    dob: [{ type: 'required', message: 'DOB is required' }],
  };
  gender = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];
  currentAction: string;
  currentUsetId: any;
  isValidNumber: boolean;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public employeeData: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateEmployeeComponent>,
    // private datePipe: DatePipe,
    private apiService: ApiService,
    private utilityService: UtilityService,
    private store: Store<EmployeeState>
  ) {}

  ngOnInit(): void {
    this.createForms();
    if (
      this.employeeData.dataKey &&
      Object.keys(this.employeeData.dataKey).length
    ) {
      this.currentAction = this.employeeData.action;
      this.setFormValues(this.employeeData.dataKey);
      this.currentUsetId = this.employeeData.dataKey.id;
    } else {
      this.currentAction = this.CREATE;
    }
  }

  createForms() {
    let country = new FormControl('');
    let phone = new FormControl('', {
      validators: Validators.compose([Validators.required]),
    });
    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone,
    });
    // user details form validations
    this.userDetailsForm = this.fb.group({
      first_name: new FormControl('',),
      last_name: new FormControl('',),
      gender: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(256),
      ]),
      city: new FormControl('',),
      county: new FormControl('',),
      postal: new FormControl('',),
      phone1: new FormControl('', [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      phone2: new FormControl('', [
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      web: new FormControl(''),
      workingfrom: new FormControl('')
    });

    // this.userDetailsForm = this.fb.group({
    //   first_name: new FormControl(''),
    //   last_name: new FormControl(''),
    //   gender: new FormControl(''),
    //   dob: new FormControl(''),
    //   address: new FormControl(''),
    //   city: new FormControl(''),
    //   county: new FormControl(''),
    //   postal: new FormControl(''),
    //   phone1: new FormControl(''),
    //   phone2: new FormControl(''),
    //   email: new FormControl(''),
    //   web: new FormControl(''),
    //   workingfrom: new FormControl(''),
    // });
  }

  setFormValues(employeeDetails: employeeDetails) {
    this.userDetailsForm.patchValue({
      first_name: employeeDetails.first_name,
      last_name: employeeDetails.last_name,
      dob: employeeDetails.dob,
      gender: employeeDetails.gender,
      address: employeeDetails.address,
      city: employeeDetails.city,
      county: employeeDetails.county,
      postal: employeeDetails.postal,
      phone1: employeeDetails.phone1,
      phone2: employeeDetails.phone2,
      email: employeeDetails.email,
      web: employeeDetails.web,
      workingfrom: employeeDetails.workingfrom,
    });
  }

  onSubmitUserDetails(employeeDetails: employeeDetails) {
    let randomId = Math.floor(Math.random() * 500) + 500;
    if (this.currentAction === this.UPDATE) {
      this.updateEmployeeDetails({
        ...employeeDetails,
        id: this.currentUsetId,
      });
    } else {
      this.createEmployee({
        ...employeeDetails,
        id: randomId.toString(),
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateEmployeeDetails(employeeDetails: employeeDetails) {
    this.apiService
      .updateEmployeeDetails(employeeDetails)
      .subscribe((response) => {
        if (response.status === 200) {
          this.store.dispatch(updateEmployee({ employeDetails: employeeDetails }));
          this.callGetCustomerDetails();
        }
      });
  }

  createEmployee(employeeDetails: employeeDetails) {
    this.apiService
      .createEmployeeDetails(employeeDetails)
      .subscribe((response: any) => {
        debugger;
        if (response.status === 200) {
          const employeeData = { ...employeeDetails, id: response.body.name };
          this.store.dispatch(addEmployee({ employeDetails: employeeData }));
          this.callGetCustomerDetails();
        }
      });
  }

  callGetCustomerDetails() {
    this.store.select(getEmployeeDetailsList).subscribe((details) => {
      this.closeDialog();
    });
    // this.apiService.getEmployeeData()
  }

  validateNumber(value: number) {
    // Check if the input value is within the range 0 to 3
    this.isValidNumber = value >= 0 && value <= 3;
  }
  onKeyDown(event: KeyboardEvent) {
    debugger;
    if (['0', '1', '2', '3'].includes(event.key)) {
      this.isValidNumber = true;
    } else {
      event.preventDefault();
      this.isValidNumber = false;
    }
    // Allow certain key codes: digits 0 to 3, arrow keys, backspace, delete, and tab
    // if (
    //   (event.keyCode >= 48 && event.keyCode <= 51) || // Digits 0 to 3
    //   (event.keyCode >= 96 && event.keyCode <= 99) || // Numpad digits 0 to 3
    //   event.keyCode === 37 || // Arrow left
    //   event.keyCode === 39 || // Arrow right
    //   event.keyCode === 8 || // Backspace
    //   event.keyCode === 46 || // Delete
    //   event.keyCode === 9 // Tab
    // ) {
    //   // Allow the key press
    //   debugger

    // } else {
    //   debugger
    //   // Prevent the key press and display an error message

    // }
  }
}
