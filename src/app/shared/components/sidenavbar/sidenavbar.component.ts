import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../interface/navitem';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.css'],
})
export class SidenavbarComponent implements OnInit {
  // events: string[] = [];
  // opened: boolean = false;

  // shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
  constructor(private router: Router) {}

  ngOnInit(): void {}
  menu: NavItem[] = [
    {
      displayName: 'Employeed List',
      iconName: 'desktop_windows',
      route: '/employeeList',
    },
    {
      displayName: 'Create Employee',
      iconName: 'desktop_windows',
      route: '/create',
    },
  ];

  navigate(urlDetails: NavItem) {
    debugger;
    // console.log(`${environment.URL}${urlDetails.route}`)
    this.router.navigate(['http://localhost:4200/create']);
  }
}
