import { ROMGraphics } from './rom-graphics';
import { snesToHex } from './rom-utils';
import { Block } from './block';

export class BackgroundGraphics {
  arrayROMGraphics;
  romGraphics;
  backgroundData;

  constructor(index, bitsPerPixel, backgroundData) {
    this.backgroundData = backgroundData;
    this.arrayROMGraphics = null;
    this.romGraphics = new ROMGraphics(bitsPerPixel);
    this.read(index);
  }

  read(index) {
    /* Graphics pointer table entry */
    const graphicsPointerBlock = new Block(0xD7A1 + index * 4, this.backgroundData);
    /* Read graphics */
    this.romGraphics.loadGraphics(new Block(snesToHex(graphicsPointerBlock.readInt32()), this.backgroundData));
    /* Arrangement pointer table entry */
    const arrayPointerBlock = new Block(0xD93D + index * 4, this.backgroundData);
    const arrayPointer = snesToHex(arrayPointerBlock.readInt32());
    /* Read and decompress arrangement */
    const arrayBlock = new Block(arrayPointer, this.backgroundData);
    this.arrayROMGraphics = arrayBlock.decompress();
  }

  draw(bitmap, palette) {
    return this.romGraphics.draw(bitmap, palette, this.arrayROMGraphics);
  }
}
