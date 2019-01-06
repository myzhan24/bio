import { HEIGHT, WIDTH } from '../constants';
import { Distorter } from './distorter';
import { BattleBackground } from './battle-background';
import { BackgroundGraphics } from './background-graphics';
import { DistortionEffect } from './distortion-effect';
import { PaletteCycle } from './palette-cycle';
import { BackgroundPalette } from './background-palette';

export class BackgroundLayer {
  rom;
  graphics;
  paletteCycle;
  pixels;
  distorter;
  entry;

  constructor(entry, rom) {
    this.rom = rom;
    this.graphics = null;
    this.paletteCycle = null;
    this.pixels = new Int16Array(WIDTH * HEIGHT * 4);
    this.distorter = new Distorter(this.pixels);
    this.loadEntry(entry);
  }

  /**
   * Renders a frame of the background animation into the specified Bitmap
   *
   * @param dst
   *            Bitmap object into which to render
   * @param letterbox
   *            Size in pixels of black borders at top and bottom of image
   * @param ticks
   *            Time value of the frame to compute
   * @param alpha
   *            Blending opacity
   * @param erase
   *            Whether or not to clear the destination bitmap before
   *            rendering
   */
  overlayFrame(bitmap, letterbox, ticks, alpha, erase) {
    if (this.paletteCycle !== null) {
      this.paletteCycle.cycle();
      this.graphics.draw(this.pixels, this.paletteCycle);
    }
    return this.distorter.overlayFrame(bitmap, letterbox, ticks, alpha, erase);
  }

  loadGraphics(index) {
    this.graphics = this.rom.getObject(BackgroundGraphics, index);
  }

  loadPalette(background) {
    this.paletteCycle = new PaletteCycle({
      background,
      palette: this.rom.getObject(BackgroundPalette, background.paletteIndex)
    });
  }

  loadEffect(index) {
    this.distorter.effect = new DistortionEffect(index, this.rom.data);
  }

  loadEntry(index) {
    this.entry = index;
    const background = this.rom.getObject(BattleBackground, index);
    /* Set graphics/palette */
    this.loadGraphics(background.graphicsIndex);
    this.loadPalette(background);
    const animation = background.animation;
    const e1 = (animation >> 24) & 0xFF;
    const e2 = (animation >> 16) & 0xFF;
    this.loadEffect(e2 || e1);
  }
}