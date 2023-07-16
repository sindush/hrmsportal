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
    phone1: [{ type: 'required', message: 'Primary phone number is required' }],
    email: [{ type: 'required', message: 'Email is required' }],
    gender: [{ type: 'required', message: 'Gender is required' }],
    dob: [{ type: 'required', message: 'DOB is required' }],
  };
  currentAction: string;
  currentUsetId: any;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public employeeData: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateEmployeeComponent>,
    // private datePipe: DatePipe,
    private apiService: ApiService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    debugger;
    this.createForms();
    if (
      this.employeeData.dataKey &&
      Object.keys(this.employeeData.dataKey).length
    ) {
      this.currentAction = this.employeeData.action;
      console.log('this.currentAction', this.currentAction);
      this.setFormValues(this.employeeData.dataKey);
      this.currentUsetId = this.employeeData.dataKey.id;
    } else {
      this.currentAction = this.CREATE;
      console.log('this.currentAction', this.currentAction);
    }
  }

  createForms() {
    let country = new FormControl('', Validators.required);
    let phone = new FormControl('', {
      validators: Validators.compose([Validators.required]),
    });
    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone,
    });
    // user details form validations
    this.userDetailsForm = this.fb.group({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      gender: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(256),
      ]),
      city: new FormControl('', Validators.required),
      county: new FormControl('', Validators.required),
      postal: new FormControl('', Validators.required),
      phone1: new FormControl('', Validators.required),
      phone2: new FormControl(''),
      email: new FormControl('', Validators.required),
      web: new FormControl(''),
      workingfrom: new FormControl(''),
    });
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
    debugger;
    console.log(employeeDetails);
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
    debugger;
    this.apiService
      .updateEmployeeDetails(employeeDetails)
      .subscribe((response) => {
        debugger;
        console.log(response);
        if (response.status === 200) {
          this.callGetCustomerDetails();
        }
      });
  }

  createEmployee(employeeDetails: employeeDetails) {
    this.apiService
      .createEmployeeDetails(employeeDetails)
      .subscribe((response: any) => {
        debugger;
        console.log(response);
        if (response.status === 201) {
          this.callGetCustomerDetails();
        }
      });
  }

  callGetCustomerDetails() {
    this.apiService.getEmployeeData().subscribe((details) => {
      this.utilityService.setEmployeeData.next(details);
      this.closeDialog();
    });
  }
}
