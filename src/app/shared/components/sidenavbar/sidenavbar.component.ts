import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../interface/navitem';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.css']
})
export class SidenavbarComponent implements OnInit {
  // events: string[] = [];
  // opened: boolean = false;

  // shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
  constructor() { }

  ngOnInit(): void {
  }
  menu: NavItem[] = [
    {
      displayName: 'Escritorio',
      iconName: 'desktop_windows',
      route: 'escritorio',
    },
  ];

}
