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
  constructor(private router: Router) {}

  ngOnInit(): void {}
  menu: NavItem[] = [
    {
      displayName: 'Employeed List',
      iconName: 'desktop_windows',
      route: '/employeeList',
    }
  ];

  navigate(urlDetails: NavItem) {
    this.router.navigate([urlDetails.route]);
  }
}
