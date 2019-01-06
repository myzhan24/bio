import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarthboundComponent } from './earthbound.component';
import { MaterialModule } from '../material/material.module';
import { EarthboundCardComponent } from '../earthbound-card/earthbound-card.component';

@NgModule({
  declarations: [EarthboundComponent, EarthboundCardComponent],
  exports: [EarthboundComponent, EarthboundCardComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class EarthboundModule {
}
