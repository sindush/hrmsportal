import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerComponent } from './container.component';
import { ApiService } from '../shared/services/apiendpoint/api.service';
import { SpinnerService } from '../shared/services/spinner/spinner.service';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { of, Subject } from 'rxjs';
import { employeeDetails } from '../shared/interface/employeeDetails';
import { leaves } from '../shared/interface/leaves';
import { UtilityService } from '../shared/services/utility/utility.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('ContainerComponent', () => {
  let component: ContainerComponent;
  let fixture: ComponentFixture<ContainerComponent>;

  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockSpinnerService: jasmine.SpyObj<SpinnerService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMediaMatcher: jasmine.SpyObj<MediaMatcher>;

  let mockUtilityService: {
    getName: jasmine.Spy;
    setEmployeeProfile: Subject<employeeDetails>;
    setEmployeeLeaves: Subject<leaves>;
    setEmployeeData: Subject<employeeDetails[]>;
  }

  const mockEmployeeList: employeeDetails[] = [{
    "first_name": "darshan",
    "last_name": "velagaleti",
    "gender": "male",
    "dob": "1992-06-24T18:30:00.000Z",
    "address": "14 Taylor St",
    "city": "Vijayawada",
    "county": "India",
    "postal": "520004",
    "phone1": "1234567890",
    "phone2": "01944-369967",
    "email": "123123@hotmail.com",
    "web": "asdasdsad",
    "workingfrom": "home",
    "id": "32123"
  },
  {
    "first_name": "Anusha",
    "last_name": "velagaleti",
    "gender": "female",
    "dob": "1992-06-24T18:30:00.000Z",
    "address": "18 Taylor St",
    "city": "Vijayawada",
    "county": "India",
    "postal": "520004",
    "phone1": "1234567890",
    "phone2": "01944-369971",
    "email": "123123@hotmail.com",
    "web": "asdasdsad",
    "workingfrom": "home",
    "id": "25612"
  }];

  const mockProfile: employeeDetails = {
    "first_name": "darshan",
    "last_name": "velagaleti",
    "gender": "male",
    "dob": "1992-06-24T18:30:00.000Z",
    "address": "14 Taylor St",
    "city": "Vijayawada",
    "county": "India",
    "postal": "520004",
    "phone1": "1234567890",
    "phone2": "01944-369967",
    "email": "123123@hotmail.com",
    "web": "asdasdsad",
    "workingfrom": "home",
    "id": "32123"
  }

  const mockLeaves: leaves = {
    totlaLeavesApplied: 12,
    approvedLeaves: 6,
    pendingApprovalLeaves: 6,
    employeeOnLeave: []
  }

  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('ApiService', ['getEmployeeProfile', 'getEmployeeLeaves', 'getEmployeeData']);
    mockSpinnerService = jasmine.createSpyObj('SpinnerService', ['setLoading']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMediaMatcher = jasmine.createSpyObj('MediaMatcher', ['matchMedia']);

    const fakeMediaQueryList = { matches: false, media: '(max-width: 600px)' } as MediaQueryList;
    mockMediaMatcher.matchMedia.and.returnValue(fakeMediaQueryList);

    mockUtilityService = {
      getName: jasmine.createSpy('getName').and.callFake((val: string) => val.toUpperCase()),
      setEmployeeProfile: new Subject<employeeDetails>(),
      setEmployeeLeaves: new Subject<leaves>(),
      setEmployeeData: new Subject<employeeDetails[]>()
    }

    mockApiService.getEmployeeProfile.and.returnValue(of(mockProfile));
    mockApiService.getEmployeeLeaves.and.returnValue(of(mockLeaves));
    mockApiService.getEmployeeData.and.returnValue(of(mockEmployeeList))

    await TestBed.configureTestingModule({
      declarations: [ContainerComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: UtilityService, useValue: mockUtilityService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: Router, useValue: mockRouter },
        { provide: MediaMatcher, useValue: mockMediaMatcher }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('constructor', () => {

    it('should create container component', () => {
      expect(component).toBeTruthy();
    });

    it('should call MediaMatcher.matchMedia with the mobile breakpoint', () => {
      expect(mockMediaMatcher.matchMedia).toHaveBeenCalledWith('(max-width: 600px)');
    });

    it('should assign the MediaQueryList result to component.mobileQuery', () => {
      const expected = mockMediaMatcher.matchMedia('(max-width: 600px)');
      expect(component.mobileQuery).toBe(expected);
    });
  })
});

