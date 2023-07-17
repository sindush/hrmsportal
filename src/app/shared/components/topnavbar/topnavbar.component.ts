import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../interface/navitem';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router } from '@angular/router';
@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css'],
})
export class TopnavbarComponent implements OnInit {
  mobileQuery: MediaQueryList;
  constructor( media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {}
}
