/**
 * Represents a chunk of the ROM's data requested by an object for reading or writing.
 * A requested block should always correspond exactly to an area of strictly contiguous data within an object.
 */
import { decompress, getCompressedSize } from './rom-utils';


/**
 * Allocates a writeable block using the Unrestricted storage model. The
 * resulting block may be located anywhere in the ROM.
 *
 *
 * @param size
 * The size, in bytes, required for this block
 * @return A writeable block, or null if allocation failed
 */
/**
 * Returns a readable block at the given location. Nominally, should also
 * handle tracking free space depending on the type of read requested.
 * (i. e., an object may be interested in read-only access anywhere, but if
 * an object is reading its own data, it should specify this so the ROM can
 * mark the read data as "free")
 *
 * @param location
 * The address from which to read
 *
 * @return A readable block
 */
export class Block {
  address;
  pointer;
  data;

  constructor(location, data) {
    this.address = location;
    this.pointer = location;
    this.data = data;
  }

  /**
   * Decompresses data from the block's current position. Note that this
   * method first measures the compressed data's size before allocating the
   * destination array, which incurs a slight additional overhead.
   *
   * @return An array containing the decompressed data.
   */
  decompress() {
    const size = getCompressedSize(this.pointer, this.data); // TODO data reference comes from ROM.ts
    if (size < 1) {
      throw new Error(`Invalid compressed data: ${size}`);
    }
    let blockOutput = new Int16Array(size);
    const read = 0;
    blockOutput = decompress(this.pointer, this.data, blockOutput, read);
    if (blockOutput === null) {
      throw new Error('Computed and actual decompressed sizes do not match.');
    }
    return blockOutput;
  }

  /**
   * Reads a 16-bit integer from the block's current position and advances the
   * current position by 2 bytes.
   *
   * @return The 16-bit value at the current position.
   */
  readInt16() {
    return this.data[this.pointer++];
  }

  /* Reads a 32-bit integer from the block's current position and advances the current position by 4 bytes. */
  readInt32() {
    return this.readInt16() + (this.readInt16() << 8) + (this.readInt16() << 16) + (this.readInt16() << 24);
  }

  readDoubleShort() {
    const fakeShort = new Int16Array([this.readInt16() + (this.readInt16() << 8)]);
    return fakeShort[0];
  }
}
