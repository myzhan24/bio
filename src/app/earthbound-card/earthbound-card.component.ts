import { Component, OnInit, ViewChild } from '@angular/core';
import { EarthboundComponent } from '../earthbound/earthbound.component';
import { NUM_LAYERS } from '../../earthbound/constants';

@Component({
  selector: 'app-earthbound-card',
  templateUrl: './earthbound-card.component.html',
  styleUrls: ['./earthbound-card.component.scss']
})
export class EarthboundCardComponent implements OnInit {
  @ViewChild('earthboundComponent') earthboundComponent: EarthboundComponent;

  layer1 = 0;
  layer2 = 1;

  layerNumbers: Array<number>;

  constructor() {
    this.layerNumbers = new Array<number>(NUM_LAYERS);
    for (let i = 0; i < NUM_LAYERS; i++) {
      this.layerNumbers[i] = i;
    }
  }

  ngOnInit() {
  }

  setRandomLayers(): void {
    this.earthboundComponent.setRandomLayers();
  }

}
