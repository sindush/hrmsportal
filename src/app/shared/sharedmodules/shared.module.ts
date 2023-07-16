import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavbarComponent } from '../components/sidenavbar/sidenavbar.component';
import { SharedMaterialModule } from './sharedmaterial.module';
import { TopnavbarComponent } from '../components/topnavbar/topnavbar.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedtableComponent } from '../components/sharedtable/sharedtable.component';



@NgModule({
  declarations: [
    SidenavbarComponent,
    TopnavbarComponent,
    SharedtableComponent
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    AppRoutingModule
  ],
  exports:[
    SidenavbarComponent,
    TopnavbarComponent,
    SharedtableComponent
  ]
})
export class SharedModule { }
