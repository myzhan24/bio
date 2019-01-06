import { Component, OnInit, ViewChild } from '@angular/core';
import { BackgroundLayer } from '../../earthbound/rom/background-layer';
import { ROM } from '../../earthbound/rom/rom';
import { NUM_LAYERS } from '../../earthbound/constants';
import { Engine } from '../../earthbound/engine';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-earthbound-card',
  templateUrl: './earthbound-card.component.html',
  styleUrls: ['./earthbound-card.component.scss']
})
export class EarthboundCardComponent implements OnInit {
  @ViewChild('canvasElement') canvasElement;
  backgroundData;
  rom: ROM;
  engine: Engine;
  layer1Val = 0;
  layer2Val = 1;
  frameskip = 1;
  aspectRatio = 16;
  debug = false;
  fps = 30;
  alpha = 0.5;

  constructor(private readonly http: HttpClient) {
    this.http.get('assets/data/truncated_backgrounds.dat', {
      responseType: 'arraybuffer'
    }).subscribe(data => {
      console.log(data);
      // let backgroundData = new Uint8Array(Array.from(data).map(x => x.charCodeAt(0)));
      // let fr = new FileReader();
      // let xx = fr.readAsArrayBuffer(data);
      // console.log(xx);
      this.backgroundData = new Uint8Array(data);
      this.rom = new ROM(this.backgroundData);
      this.setupEngine();
    });
  }

  ngOnInit() {
  }

  setupEngine() {
    // this.rom = new Rom(backgroundData);
    // const params = getJsonFromUrl();
    // const loader = null;

    /*
        const layer1Val = parseLayerParam(params.layer1, {firstLayer: true});
        const layer2Val = parseLayerParam(params.layer2, {firstLayer: false});
        const frameskip = parseFrameskipParam(params.frameskip);
        const aspectRatio = parseAspectRatioParam(params.aspectRatio);
        parseFullscreen(params.fullscreen);
        */


    // const debug = params.debug === 'true';
    // const debug = true;


    /*if (layer2Val === 0) {
      alpha = 1.0;
    }*/

    // Create two layers
    // document['BackgroundLayer'] = BackgroundLayer;
    const layer1 = new BackgroundLayer(this.layer1Val, this.rom);
    const layer2 = new BackgroundLayer(this.layer2Val, this.rom);

    // Create animation engine
    this.engine = new Engine([layer1, layer2], {
      fps: this.fps,
      aspectRatio: this.aspectRatio,
      frameSkip: this.frameskip,
      alpha: [this.alpha, this.alpha],
      canvas: this.canvasElement.nativeElement
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
