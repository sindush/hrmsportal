// ─────────────────────────────────────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
// TestBed      → Angular's main testing utility to configure a mini Angular
//                module specifically for your test (replaces app.module.ts).
// ComponentFixture → A wrapper Angular gives you around the created component.
//                    Lets you access the component instance, trigger
//                    change detection, and inspect the DOM.
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ContainerComponent } from './container.component';
import { ApiService } from '../shared/services/apiendpoint/api.service';
import { UtilityService } from '../shared/services/utility/utility.service';
import { SpinnerService } from '../shared/services/spinner/spinner.service';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

// of() → RxJS helper that creates an Observable which immediately emits
//        a value and then completes. Perfect for mocking HTTP calls in tests.
import { of, Subject } from 'rxjs';

import { employeeDetails } from '../shared/interface/employeeDetails';
import { leaves } from '../shared/interface/leaves';

// NO_ERRORS_SCHEMA → Tells Angular to ignore unknown HTML elements/attributes
//                    in the component's template (child components, directives)
//                    so the test doesn't fail on unrelated template errors.
import { NO_ERRORS_SCHEMA } from '@angular/core';


// ─────────────────────────────────────────────────────────────────────────────
// describe()
// Groups related tests into a named block. Think of it as a "folder" for tests.
// Nest describe() blocks to organise by method or feature.
// ─────────────────────────────────────────────────────────────────────────────
describe('ContainerComponent', () => {

  // Variables declared here are accessible in every test inside this describe.
  let component: ContainerComponent;

  // ComponentFixture gives you the component instance + change-detection
  // control + access to the rendered DOM.
  let fixture: ComponentFixture<ContainerComponent>;

  // jasmine.SpyObj<T> → A typed mock object whose methods are all replaced
  // with spies. Lets you assert how many times a method was called and with
  // which arguments, without running real logic.
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockSpinnerService: jasmine.SpyObj<SpinnerService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMediaMatcher: jasmine.SpyObj<MediaMatcher>;

  // UtilityService has Subject properties (setEmployeeProfile, etc.) which are
  // plain object properties, not methods — createSpyObj only spies on methods.
  // So we build a plain object manually and spy only on the getName() method.
  let mockUtilityService: {
    getName: jasmine.Spy;
    setEmployeeProfile: Subject<employeeDetails>;
    setEmployeeLeaves: Subject<leaves>;
    setEmployeeData: Subject<employeeDetails[]>;
  };

  // ── Reusable test data ────────────────────────────────────────────────────
  // Defined once here and reused across tests so a single change updates
  // all expectations automatically.
  const mockEmployeeList: employeeDetails[] = [
    { id: 1, name: 'John Doe', department: 'Engineering' }
  ];

  const mockProfile: employeeDetails = { id: 1, name: 'John Doe', department: 'Engineering' };

  const mockLeaves: leaves = { total: 20, used: 5, remaining: 15 };

  // ─────────────────────────────────────────────────────────────────────────
  // beforeEach()
  // Runs BEFORE every single it() block in this describe.
  // Use it to reset state so tests never bleed into each other.
  // ─────────────────────────────────────────────────────────────────────────
  beforeEach(() => {

    // ── 1. Create mocks ────────────────────────────────────────────────────
    //
    // jasmine.createSpyObj('ServiceName', ['method1', 'method2'])
    //   → Creates a fake object with those methods replaced by spies.
    //   → Real service code NEVER runs — tests stay fast and isolated.
    mockApiService = jasmine.createSpyObj('ApiService', ['getEmployeeProfile', 'getEmployeeLeaves', 'getEmployeeData']);
    mockSpinnerService = jasmine.createSpyObj('SpinnerService', ['setLoading']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMediaMatcher = jasmine.createSpyObj('MediaMatcher', ['matchMedia']);

    // MediaMatcher.matchMedia() must return a MediaQueryList object.
    // We give it a minimal fake that satisfies TypeScript and the component.
    const fakeMediaQueryList = { matches: false, media: '(max-width: 600px)' } as MediaQueryList;
    mockMediaMatcher.matchMedia.and.returnValue(fakeMediaQueryList);

    // UtilityService: Subjects are public properties accessed via .next(),
    // not methods. We create real Subject instances so subscriptions work,
    // and spy only on the getName() method.
    mockUtilityService = {
      getName: jasmine.createSpy('getName').and.callFake((val: string) => val.toUpperCase()),
      //                                              └─ and.callFake() runs our own function
      //                                                 instead of the real one. Here we just
      //                                                 uppercase the key — simple and predictable.
      setEmployeeProfile: new Subject<employeeDetails>(),
      setEmployeeLeaves: new Subject<leaves>(),
      setEmployeeData: new Subject<employeeDetails[]>()
    };

    // ── 2. Wire up API spy return values ──────────────────────────────────
    //
    // .and.returnValue(of(data))
    //   → Every time this spy is called it returns an Observable that
    //     immediately emits `data` and completes — mimicking a real HTTP call.
    mockApiService.getEmployeeProfile.and.returnValue(of(mockProfile));
    mockApiService.getEmployeeLeaves.and.returnValue(of(mockLeaves));
    mockApiService.getEmployeeData.and.returnValue(of(mockEmployeeList));

    // ── 3. Configure the test module ──────────────────────────────────────
    //
    // TestBed.configureTestingModule() replaces AppModule for this test.
    // 'providers' is where we swap real services for our mocks using
    // { provide: RealToken, useValue: mockObject }.
    TestBed.configureTestingModule({
      declarations: [ContainerComponent],  // The component under test
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: UtilityService, useValue: mockUtilityService },
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: Router, useValue: mockRouter },
        { provide: MediaMatcher, useValue: mockMediaMatcher }
      ],
      schemas: [NO_ERRORS_SCHEMA]  // Ignore unknown child elements in template
    });

    // ── 4. Create the component ───────────────────────────────────────────
    //
    // TestBed.createComponent() instantiates the component in a test host.
    // It does NOT yet trigger ngOnInit — that only happens when you call
    // fixture.detectChanges() or component.ngOnInit() explicitly.
    // This gives us full control over WHEN the lifecycle runs.
    fixture = TestBed.createComponent(ContainerComponent);
    component = fixture.componentInstance;  // The actual component class instance
  });


  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1 — Constructor
  // The constructor runs as soon as the component is created (createComponent).
  // We don't need ngOnInit to have run for these tests.
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Constructor', () => {

    // it('description', () => { ... })
    //   → One individual test case. The description should read like a sentence:
    //     "it should ..."
    it('should create the component successfully', () => {
      // toBeTruthy() → passes if the value is not null / undefined / false / 0
      expect(component).toBeTruthy();
    });

    it('should call MediaMatcher.matchMedia with the mobile breakpoint', () => {
      // toHaveBeenCalledWith() → checks the spy was called with exact arguments.
      expect(mockMediaMatcher.matchMedia).toHaveBeenCalledWith('(max-width: 600px)');
    });

    it('should assign the MediaQueryList result to component.mobileQuery', () => {
      // toBe() → strict reference equality (===), not just deep equality.
      const expected = mockMediaMatcher.matchMedia('(max-width: 600px)');
      expect(component.mobileQuery).toBe(expected);
    });
  });


  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2 — ngOnInit
  // ═══════════════════════════════════════════════════════════════════════════
  describe('ngOnInit', () => {

    it('should call getEmployeeDetails() and getEmployeeSList()', () => {
      // spyOn(object, 'methodName')
      //   → Wraps an EXISTING method with a spy so you can track calls.
      //   → Unlike createSpyObj, this works on already-created objects.
      //   .and.callThrough() → The spy still runs the real implementation
      //   (important here so the component doesn't break).
      spyOn(component, 'getEmployeeDetails').and.callThrough();
      spyOn(component, 'getEmployeeSList').and.callThrough();

      component.ngOnInit();

      // toHaveBeenCalledOnce() → Stricter than toHaveBeenCalled(); ensures
      // the method was called exactly once.
      expect(component.getEmployeeDetails).toHaveBeenCalledOnce();
      expect(component.getEmployeeSList).toHaveBeenCalledOnce();
    });

    it('should subscribe to employeeProfile$ and push data to setEmployeeProfile', () => {
      // spyOn the Subject's .next() method so we can assert it was called.
      // The real next() still works because we don't use .and.stub().
      spyOn(mockUtilityService.setEmployeeProfile, 'next');

      component.ngOnInit();

      // toHaveBeenCalledOnceWith() → Called exactly once AND with this value.
      expect(mockUtilityService.setEmployeeProfile.next)
        .toHaveBeenCalledOnceWith(mockProfile);
    });

    it('should subscribe to employeeLeaves$ and push data to setEmployeeLeaves', () => {
      spyOn(mockUtilityService.setEmployeeLeaves, 'next');

      component.ngOnInit();

      expect(mockUtilityService.setEmployeeLeaves.next)
        .toHaveBeenCalledOnceWith(mockLeaves);
    });
  });


  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3 — getEmployeeDetails()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('getEmployeeDetails()', () => {

    // A nested beforeEach runs ONLY for tests inside this describe block.
    beforeEach(() => {
      component.getEmployeeDetails();
    });

    it('should call apiService.getEmployeeProfile()', () => {
      // toHaveBeenCalled() → passes as long as the spy was called at least once.
      expect(mockApiService.getEmployeeProfile).toHaveBeenCalled();
    });

    it('should assign the returned Observable to component.employeeProfile$', () => {
      // toBeDefined() → passes if the value is not undefined.
      expect(component.employeeProfile$).toBeDefined();
    });

    it('should call apiService.getEmployeeLeaves()', () => {
      expect(mockApiService.getEmployeeLeaves).toHaveBeenCalled();
    });

    it('should assign the returned Observable to component.employeeLeaves$', () => {
      expect(component.employeeLeaves$).toBeDefined();
    });
  });


  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4 — getEmployeeSList()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('getEmployeeSList()', () => {

    it('should call spinnerService.setLoading(true) before fetching data', () => {
      component.getEmployeeSList();

      // .calls.first() → Gets the metadata about the very first call made.
      // .args          → The array of arguments passed in that call.
      expect(mockSpinnerService.setLoading.calls.first().args).toEqual([true]);
    });

    it('should call apiService.getEmployeeData()', () => {
      component.getEmployeeSList();

      expect(mockApiService.getEmployeeData).toHaveBeenCalled();
    });

    it('should populate component.employeedData with the API response', () => {
      component.getEmployeeSList();

      // toEqual() → Deep equality check (compares values, not references).
      // Use toEqual for arrays/objects; use toBe for primitives or same ref.
      expect(component.employeedData).toEqual(mockEmployeeList);
    });

    it('should call spinnerService.setLoading(false) after data arrives', () => {
      component.getEmployeeSList();

      // .calls.mostRecent() → Gets the metadata about the LAST call made.
      // Ensures setLoading(false) was the most recent call (i.e., called after true).
      expect(mockSpinnerService.setLoading.calls.mostRecent().args).toEqual([false]);
    });

    it('should emit employee data through utilityService.setEmployeeData', () => {
      spyOn(mockUtilityService.setEmployeeData, 'next');

      component.getEmployeeSList();

      expect(mockUtilityService.setEmployeeData.next)
        .toHaveBeenCalledOnceWith(mockEmployeeList);
    });

    it('should build columns by mapping the keys of the first employee record', () => {
      component.getEmployeeSList();

      // Build the expected columns the same way the component does,
      // accounting for our getName spy (uppercases the key).
      const expectedColumns = Object.keys(mockEmployeeList[0]).map(key => ({
        columnDef: key,
        header: key.toUpperCase()  // matches and.callFake in our spy
      }));

      expect(component.columns).toEqual(expectedColumns);
    });

    it('should call utilityService.getName() once for each employee key', () => {
      component.getEmployeeSList();

      const numberOfKeys = Object.keys(mockEmployeeList[0]).length;

      // toHaveBeenCalledTimes(n) → Spy was called exactly n times.
      expect(mockUtilityService.getName).toHaveBeenCalledTimes(numberOfKeys);
    });

    it('should call spinnerService.setLoading in the correct order: true then false', () => {
      component.getEmployeeSList();

      // .calls.allArgs() → Returns an array of argument arrays for every call.
      // e.g. [[true], [false]]
      const callArgs = mockSpinnerService.setLoading.calls.allArgs();
      expect(callArgs).toEqual([[true], [false]]);
    });
  });


  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5 — navigate()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('navigate()', () => {

    it('should call router.navigate with the URL wrapped in an array', () => {
      component.navigate('/dashboard');

      // The Angular Router's navigate() expects an array of path segments.
      // e.g. navigate(['/dashboard']) NOT navigate('/dashboard').
      expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/dashboard']);
    });

    it('should work correctly with different route strings', () => {
      component.navigate('/profile');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should handle an empty string without throwing', () => {
      // Tests a boundary/edge case: what if an empty URL is passed?
      expect(() => component.navigate('')).not.toThrow();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    });
  });

});


// ─────────────────────────────────────────────────────────────────────────────
// QUICK REFERENCE — Key Jasmine / Angular Testing APIs used in this file
// ─────────────────────────────────────────────────────────────────────────────
//
//  SETUP
//  ─────
//  TestBed.configureTestingModule({ declarations, providers, schemas })
//    → Configures a test-only Angular module. Always called in beforeEach.
//
//  TestBed.createComponent(ComponentClass)
//    → Instantiates the component WITHOUT triggering ngOnInit.
//    → Returns a ComponentFixture.
//
//  fixture.detectChanges()
//    → Triggers Angular change detection AND runs ngOnInit for the first time.
//    → Call this when you want ngOnInit to run automatically.
//
//  component = fixture.componentInstance
//    → Direct reference to the component class — use to call methods or
//      read properties in assertions.
//
//  MOCKING
//  ───────
//  jasmine.createSpyObj('Name', ['method1', 'method2'])
//    → Creates a fake service object. All listed methods become spies.
//    → Inject this with { provide: RealService, useValue: mockService }.
//
//  spyOn(existingObject, 'methodName')
//    → Wraps an existing method (on a real or mock object) with a spy.
//    → Use when the object already exists (e.g. component.someMethod).
//
//  spy.and.returnValue(value)   → Spy always returns this value.
//  spy.and.callFake(fn)         → Spy runs your function instead of real code.
//  spy.and.callThrough()        → Spy records the call AND runs the real code.
//  spy.and.stub()               → Spy does nothing (swallows the call).
//
//  of(value)  [from 'rxjs']
//    → Creates an Observable that emits value immediately then completes.
//    → The simplest way to fake an HTTP observable.
//
//  ASSERTIONS
//  ──────────
//  expect(x).toBeTruthy()               → x is truthy (not null/undefined/false)
//  expect(x).toBeDefined()              → x is not undefined
//  expect(x).toBe(y)                    → x === y (strict / same reference)
//  expect(x).toEqual(y)                 → deep equality (for objects / arrays)
//  expect(x).not.toThrow()              → calling x() doesn't throw an error
//  expect(spy).toHaveBeenCalled()       → spy was called at least once
//  expect(spy).toHaveBeenCalledOnce()   → spy was called exactly once
//  expect(spy).toHaveBeenCalledWith(…)  → spy was called with these args
//  expect(spy).toHaveBeenCalledOnceWith(…) → exactly once, with these args
//  expect(spy).toHaveBeenCalledTimes(n) → spy was called exactly n times
//  spy.calls.first().args               → args array from the first call
//  spy.calls.mostRecent().args          → args array from the most recent call
//  spy.calls.allArgs()                  → [[…], […]] — args from every call
