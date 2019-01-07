import { Component, OnInit, ViewChild } from '@angular/core';
import { EarthboundComponent } from '../earthbound/earthbound.component';

@Component({
  selector: 'app-earthbound-card',
  templateUrl: './earthbound-card.component.html',
  styleUrls: ['./earthbound-card.component.scss']
})
export class EarthboundCardComponent implements OnInit {
  @ViewChild('earthboundComponent') earthboundComponent: EarthboundComponent;

  constructor() {
  }

  ngOnInit() {
  }

  setRandomLayers(): void {
    this.earthboundComponent.setRandomLayers();
  }

}
