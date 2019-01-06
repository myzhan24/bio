import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ROM } from '../../earthbound/rom/rom';
import { BackgroundLayer } from '../../earthbound/rom/background-layer';
import { Engine } from '../../earthbound/engine';

@Component({
  selector: 'app-earthbound',
  templateUrl: './earthbound.component.html',
  styleUrls: ['./earthbound.component.scss']
})
export class EarthboundComponent implements OnInit {
  backgroundData;
  rom: ROM;

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


    const layer1Val = 270;
    const layer2Val = 269;
    const frameskip = 1;
    const aspectRatio = 16;


    // const debug = params.debug === 'true';
    // const debug = true;
    const debug = false;

    const fps = 30;
    const alpha = 0.5;

    /*if (layer2Val === 0) {
      alpha = 1.0;
    }*/

    // Create two layers
    // document['BackgroundLayer'] = BackgroundLayer;
    const layer1 = new BackgroundLayer(layer1Val, this.rom);
    const layer2 = new BackgroundLayer(layer2Val, this.rom);

    // Create animation engine
    const engine = new Engine([layer1, layer2], {
      fps: fps,
      aspectRatio: aspectRatio,
      frameSkip: frameskip,
      alpha: [alpha, alpha],
      canvas: document.querySelector('canvas')
    });

    engine.animate(debug);
  }

}
