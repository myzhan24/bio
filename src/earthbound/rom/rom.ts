// import padStart from 'string.prototype.padstart'
// import BattleBackground from './battle_background'
// import BackgroundGraphics from './background_graphics'
// import BackgroundPalette from './background_palette'
// import Block from './block'

import { MAXIMUM_INDEX, MINIMUM_INDEX } from '../constants';
import { BattleBackground } from './battle-background';
import { BackgroundGraphics } from './background-graphics';
import { BackgroundPalette } from './background-palette';

/**
 * Adds an object to the ROM container.
 *
 * @param objects - x
 * @param o
 * The ROMObject to add
 */
function add(objects, o) {
  const constructor = o.constructor;
  if (!objects.has(constructor)) {
    objects.set(constructor, []);
  }
  objects.get(constructor).push(o);
}

export class ROM {
  objects;
  data;

  constructor(stream) {
    this.data = stream;
    this.objects = new Map();

    /* The only way to determine the bit depth of each BG Palette is to check the bit depth of the backgrounds that use it.
    So, first we create an array to track Palette bit depths: */
    const paletteBits = new Int32Array(114);
    const graphicsBits = new Int32Array(103);
    for (let i = MINIMUM_INDEX; i <= MAXIMUM_INDEX; ++i) {
      const background = new BattleBackground(i, this.data);
      add(this.objects, background);
      /* Now that the background has been read, update the BPP entry for its palette.
      We can also check to make sure palettes are used consistently: */
      const palette = background.paletteIndex;
      const bitsPerPixel = background.bitsPerPixel;
      if (paletteBits[palette] && paletteBits[palette] !== bitsPerPixel) {
        throw new Error('BattleBackground palette Error: Inconsistent bit depth');
      }
      paletteBits[palette] = bitsPerPixel;
      graphicsBits[background.graphicsIndex] = bitsPerPixel;
    }
    /* Now load palettes */
    for (let i = 0; i < 114; ++i) {
      add(this.objects, new BackgroundPalette(i, paletteBits[i], this.data));
    }
    /* Load graphics */
    for (let i = 0; i < 103; ++i) {
      add(this.objects, new BackgroundGraphics(i, graphicsBits[i], this.data));
    }
  }

  getObject(constructor, i) {
    return this.objects.get(constructor)[i];
  }
}
