import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ROM } from '../../earthbound/rom/rom';
import { BackgroundLayer } from '../../earthbound/rom/background-layer';
import { Engine } from '../../earthbound/engine';
import { NUM_LAYERS } from '../../earthbound/constants';
import { BackgroundLayerDataService } from './background-layer-data.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-earthbound',
  templateUrl: './earthbound.component.html',
  styleUrls: ['./earthbound.component.scss']
})
export class EarthboundComponent implements OnInit, AfterViewInit {
  @ViewChild('earthboundCanvas') earthboundCanvas;
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

  constructor(private readonly backgrounds: BackgroundLayerDataService) {

  }

  ngOnInit() {

  }

  setupEngine(bgData: Uint8Array) {
    // initialize ROM Object

    this.rom = new ROM(bgData);
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
    if (this.engine != null) {
      const layer1 = new BackgroundLayer(this.layer1Val, this.rom);
      const layer2 = new BackgroundLayer(this.layer2Val, this.rom);
      this.engine.layers = [layer1, layer2];
    }
  }

  setRandomLayers(): void {
    const randomNumbers: Array<number> = this.getTwoRandomNumbers();
    this.updateLayers(randomNumbers[0], randomNumbers[1]);
  }

  getRandomLayer(): number {
    return Math.floor(Math.random() * NUM_LAYERS);
  }

  getTwoRandomNumbers(): number[] {
    const ret: Array<number> = new Array(2);

    ret[0] = this.getRandomLayer();
    do {
      ret[1] = this.getRandomLayer();
    } while (ret[0] === ret[1]);

    return ret;
  }

  ngAfterViewInit(): void {
    this.setRandomLayers();
    this.backgrounds.backgroundData$.pipe(take(1)).subscribe(bgData => {
      this.setupEngine(bgData);
    });
  }
}
