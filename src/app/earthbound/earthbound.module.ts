import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarthboundComponent } from './earthbound.component';
import { MaterialModule } from '../material/material.module';
import { EarthboundCardComponent } from '../earthbound-card/earthbound-card.component';
import { BackgroundLayerDataService } from './background-layer-data.service';
import { EarthboundGridComponent } from '../earthbound-grid/earthbound-grid.component';

@NgModule({
  declarations: [EarthboundComponent, EarthboundCardComponent, EarthboundGridComponent],
  exports: [EarthboundComponent, EarthboundCardComponent, EarthboundGridComponent],
  providers: [BackgroundLayerDataService],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class EarthboundModule {
}
