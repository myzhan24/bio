import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarthboundComponent } from './earthbound.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [EarthboundComponent],
  exports: [EarthboundComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class EarthboundModule { }
