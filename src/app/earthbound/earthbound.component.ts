import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ROM } from '../../earthbound/rom/rom';
import { BackgroundLayer } from '../../earthbound/rom/background-layer';
import { Engine } from '../../earthbound/engine';
import { NUM_LAYERS } from '../../earthbound/constants';

@Component({
  selector: 'app-earthbound',
  templateUrl: './earthbound.component.html',
  styleUrls: ['./earthbound.component.scss']
})
export class EarthboundComponent implements OnInit {
  @ViewChild('earthboundCanvas') earthboundCanvas;
  backgroundData;
  rom: ROM;
  engine: Engine;
  layer1Val = 0;
  layer2Val = 1;
  frameskip = 1;
  /**
   * 0 = 8:7
   * 16 = 4:3
   * 48 = 2:1
   * 64 = 8:3
   */
  aspectRatio = 0;
  debug = false;
  fps = 30;
  alpha = 0.5;

  constructor(private readonly http: HttpClient) {
    this.layer1Val = this.getRandomLayer();
    this.layer2Val = this.getRandomLayer();

    this.http.get('assets/data/truncated_backgrounds.dat', {
      responseType: 'arraybuffer'
    }).subscribe(data => {
      this.backgroundData = new Uint8Array(data);
      this.rom = new ROM(this.backgroundData);
      this.setupEngine();
    });
  }

  ngOnInit() {
  }

  setupEngine() {
    // Create two layers
    const layer1 = new BackgroundLayer(this.layer1Val, this.rom);
    const layer2 = new BackgroundLayer(this.layer2Val, this.rom);

    // Create animation engine
    this.engine = new Engine([layer1, layer2], {
      fps: this.fps,
      aspectRatio: this.aspectRatio,
      frameSkip: this.frameskip,
      alpha: [this.alpha, this.alpha],
      canvas: this.earthboundCanvas.nativeElement
    });

    this.engine.animate(this.debug);
  }

  mz(): void {
    this.updateLayers(++this.layer1Val, ++this.layer2Val);
  }

  updateLayers(layer1Val, layer2Val): void {
    this.layer1Val = layer1Val;
    this.layer2Val = layer2Val;
    const layer1 = new BackgroundLayer(this.layer1Val, this.rom);
    const layer2 = new BackgroundLayer(this.layer2Val, this.rom);
    this.engine.layers = [layer1, layer2];
  }

  setRandomLayers(): void {
    this.updateLayers(this.getRandomLayer(), this.getRandomLayer());
  }

  getRandomLayer(): number {
    return Math.floor(Math.random() * NUM_LAYERS);
  }
}
