import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ROM } from '../../earthbound/rom/rom';
import { BackgroundLayer } from '../../earthbound/rom/background-layer';
import { Engine } from '../../earthbound/engine';
import { BackgroundLayerDataService } from './background-layer-data.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-earthbound',
  templateUrl: './earthbound.component.html',
  styleUrls: ['./earthbound.component.scss']
})
export class EarthboundComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('earthboundCanvas') earthboundCanvas;
  fullscreen = false;
  rom: ROM;
  engineCollector: Engine[] = [];
  engineCollectorTask = null;
  engine: Engine;
  layer1Val = 0;
  bgData: Uint8Array;


  @Input()
  width: number;

  @Input()
  height: number;

  @Input()
  get layer1() {
    return this.layer1Val;
  }

  set layer1(val: number) {
    this.layer1Val = val;
    this.applyLayer1(val);
    this.layer1Change.emit(val);
  }

  @Output()
  layer1Change = new EventEmitter<number>();

  @Input()
  get layer2() {
    return this.layer2Val;
  }

  set layer2(val: number) {
    this.layer2Val = val;
    this.applyLayer2(val);
    this.layer2Change.emit(val);
  }

  @Output()
  layer2Change = new EventEmitter<number>();

  layer2Val = 1;

  /**
   * 0 = 8:7
   * 16 = 4:3
   * 48 = 2:1
   * 64 = 8:3
   */
  aspectRatio = 0;

  // fps = 30;
  // frameskip = 1;

  // toying with 60 fps for now
  fps = 60;
  frameskip = 0.5;
  alpha = 0.5;

  constructor(private readonly backgrounds: BackgroundLayerDataService) {
    this.setRandomLayers();
  }


  ngOnInit() {

  }

  /**
   * Run this one time
   * @param bgData - x
   */
  private setupEngine(bgData: Uint8Array) {
    if (this.engine != null) {
      this.engineCollector.push(this.engine);
    }

    // Create two layers
    const backgroundLayer1 = new BackgroundLayer(this.layer1Val, this.rom);
    const backgroundLayer2 = new BackgroundLayer(this.layer2Val, this.rom);

    // Create animation engine
    this.engine = new Engine([backgroundLayer1, backgroundLayer2], {
      fps: this.fps,
      aspectRatio: this.aspectRatio,
      frameSkip: this.frameskip,
      alpha: [this.alpha, this.alpha],
      canvas: this.earthboundCanvas.nativeElement,
      width: this.width,
      height: this.height
    });

    // Start animation loop
    this.engine.animate();

    // Destroy the last engine object if it exists
    if (this.engineCollector.length > 0) {
      const self = this;

      // todo this can request multiple animation frames, but each one after a first window is useless
      this.engineCollectorTask = requestAnimationFrame(() => {
        while (self.engineCollector.length > 0) {
          self.engineCollector.pop().cleanUp();
        }
      });
    }
  }

  updateLayers(layer1Val, layer2Val): void {
    this.layer1Val = layer1Val;
    this.layer2Val = layer2Val;
    this.applyLayers();
  }

  applyLayer1(val: number): void {
    this.resetEngine();
  }

  applyLayer2(val: number): void {
    this.resetEngine();
  }

  resetEngine(): void {
    // if (this.engine != null) {
    //   this.engine.cleanUp();
    // }

    if (this.bgData != null) {
      this.setupEngine(this.bgData);
    }
  }

  applyLayers(): void {
    // if (this.engine != null) {
    //   const layer1 = new BackgroundLayer(this.layer1Val, this.rom);
    //   const layer2 = new BackgroundLayer(this.layer2Val, this.rom);
    //   this.engine.layers = [layer1, layer2];
    //   console.log('mz engine layers', this.layer1Val, this.layer2Val, this.engine.layers);
    // }

    this.resetEngine();
  }

  setRandomLayers(): void {
    const randomNumbers: Array<number> = BackgroundLayer.getRandomLayers();
    this.updateLayers(randomNumbers[0], randomNumbers[1]);
  }

  ngAfterViewInit(): void {
    this.backgrounds.backgroundData$.pipe(take(1)).subscribe(bgData => {
      this.bgData = bgData;
      // initialize ROM Object
      this.rom = new ROM(bgData);
      this.setupEngine(bgData);
    });
  }

  ngOnDestroy(): void {
    this.engine.cleanUp();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('mz ngonchanges', changes);
    // if (changes['layer1'] || changes['layer2']) {
    //   console.log('mz layer1 and layer2', this.layer1Val, this.layer2Val);
    //   this.updateLayers(this.layer1Val, this.layer1Val);
    // }

  }

  enterFullscreen(): void {
    this.fullscreen = true;
  }

  exitFullscreen(): void {
    this.fullscreen = false;
  }
}
