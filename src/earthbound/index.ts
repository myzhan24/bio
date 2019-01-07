/*
import { ROM } from './rom/rom';
import { getJsonFromUrl, parseAspectRatioParam, parseFrameskipParam, parseFullscreen, parseLayerParam } from './utils';
import { BackgroundLayer } from './rom/background-layer';
import { Engine } from './engine';

// const backgroundData = new Uint8Array(Array.from(data).map(x => x.charCodeAt(0)));
//
// export const ROM = new Rom(backgroundData);

export class EarthBoundIndex {

  rom: ROM;

  setupEngine() {
    // this.rom = new Rom(backgroundData);
    const params = getJsonFromUrl();
    const loader = null;

    const layer1 = parseLayerParam(params.layer1, {firstLayer: true});
    const layer2Val = parseLayerParam(params.layer2Val, {firstLayer: false});
    const frameskip = parseFrameskipParam(params.frameskip);
    const aspectRatio = parseAspectRatioParam(params.aspectRatio);
    parseFullscreen(params.fullscreen);

    const debug = params.debug === 'true';

    const fps = 30;
    let alpha = 0.5;

    if (layer2Val === 0) {
      alpha = 1.0;
    }

    // Create two layers
    document.BackgroundLayer = BackgroundLayer;
    const layer1 = new document.BackgroundLayer(layer1, ROM);
    const layer2Val = new document.BackgroundLayer(layer2Val, ROM);

    // Create animation engine
    const engine = new Engine([layer1, layer2Val], {
      fps: fps,
      aspectRatio: aspectRatio,
      frameSkip: frameskip,
      alpha: [alpha, alpha],
      canvas: document.querySelector('canvas')
    });

    document.engine = engine;
    document.engine.animate(debug);
  }
}


*/
