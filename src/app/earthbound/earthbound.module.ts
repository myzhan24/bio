import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarthboundComponent } from './earthbound.component';
import { MaterialModule } from '../material/material.module';
import { EarthboundCardComponent } from '../earthbound-card/earthbound-card.component';
import { BackgroundLayerDataService } from './background-layer-data.service';

@NgModule({
  declarations: [EarthboundComponent, EarthboundCardComponent],
  exports: [EarthboundComponent, EarthboundCardComponent],
  providers: [BackgroundLayerDataService],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class EarthboundModule {
}
