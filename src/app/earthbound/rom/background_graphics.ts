import ROMGraphics from './rom_graphics';
import { readBlock, snesToHex } from './rom-utils';

export default class BackgroundGraphics {
  arrayROMGraphics;
  romGraphics;
  data;

  constructor(index, bitsPerPixel, data) {
    this.data = data;
    this.arrayROMGraphics = null;
    this.romGraphics = new ROMGraphics(bitsPerPixel);
    this.read(index);
  }

  read(index) {
    /* Graphics pointer table entry */
    const graphicsPointerBlock = readBlock(0xD7A1 + index * 4, this.data);
    /* Read graphics */
    this.romGraphics.loadGraphics(readBlock(snesToHex(graphicsPointerBlock.readInt32()), this.data));
    /* Arrangement pointer table entry */
    const arrayPointerBlock = readBlock(0xD93D + index * 4, this.data);
    const arrayPointer = snesToHex(arrayPointerBlock.readInt32());
    /* Read and decompress arrangement */
    const arrayBlock = readBlock(arrayPointer, this.data);
    this.arrayROMGraphics = arrayBlock.decompress();
  }

  draw(bitmap, palette) {
    return this.romGraphics.draw(bitmap, palette, this.arrayROMGraphics);
  }
}
