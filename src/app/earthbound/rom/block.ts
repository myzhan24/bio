/* Represents a chunk of the ROM's data requested by an object for reading or writing. A requested block should always correspond exactly to an area of strictly contiguous data within an object. */

const UNCOMPRESSED_BLOCK = 0;
const RUN_LENGTH_ENCODED_BYTE = 1;
const RUN_LENGTH_ENCODED_SHORT = 2;
const INCREMENTAL_SEQUENCE = 3;
const REPEAT_PREVIOUS_DATA = 4;
const REVERSE_BITS = 5;
const UNKNOWN_1 = 6;
const UNKNOWN_2 = 7;

const REVERSED_BYTES = generateReversedBytes();
function generateReversedBytes() {
  const reversedBytes = new Int16Array(256);
  for (let i = 0; i < reversedBytes.length; ++i) {
    // todo may need to fix this
    const binary = i.toString(2).padStart( 8, '0');
    const reversed = binary.split('').reverse().join('');
    const value = Number.parseInt(reversed, 2);
    reversedBytes[i] = value;
  }
  return reversedBytes;
}

export default class Block {
  data;
  address;
  pointer;

  constructor(location, data) {
    this.data = data;
    this.address = location;
    this.pointer = location;
  }

  /**
   * Decompresses data from the block's current position. Note that this
   * method first measures the compressed data's size before allocating the
   * destination array, which incurs a slight additional overhead.
   *
   * @return An array containing the decompressed data.
   */
  decompress() {
    const size = getCompressedSize(this.pointer, this.data);
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

// Do not try to understand what this is doing. It will hurt you.
// The only documentation for this decompression routine is a 65816
// disassembly.
// This function can return the following error codes:
//
// ERROR MEANING
// -1 Something went wrong
// -2 I dunno
// -3 No idea
// -4 Something went _very_ wrong
// -5 Bad stuff
// -6 Out of ninjas error
// -7 Ask somebody else
// -8 Unexpected end of data
/**
 * @param start
 * @param data
 * @param output
 * Must already be allocated with at least enough space
 * @param read
 * "Out" parameter which receives the number of bytes of
 * compressed data read
 * @return The size of the decompressed data if successful, null otherwise
 */
export function decompress(start, data, output, read) {
  const maxLength = output.length;
  let pos = start;
  let bpos = 0;
  let bpos2 = 0;
  let tmp;
  let newRead = read; // eslint-disable-line
  while (data[pos] !== 0xFF) {
    // Data overflow before end of compressed data
    if (pos >= data.length) {
      newRead = pos - start + 1;
      return null;
    }
    let commandType = data[pos] >> 5;
    let len = (data[pos] & 0x1F) + 1;
    if (commandType === 7) {
      commandType = (data[pos] & 0x1C) >> 2;
      len = ((data[pos] & 3) << 8) + data[pos + 1] + 1;
      ++pos;
    }
    // Error: block length would overflow maxLength, or block endpos
    // negative?
    if (bpos + len > maxLength || bpos + len < 0) {
      newRead = pos - start + 1;
      return null;
    }
    ++pos;
    if (commandType >= 4) {
      bpos2 = (data[pos] << 8) + data[pos + 1];
      if (bpos2 >= maxLength || bpos2 < 0) {
        newRead = pos - start + 1;
        return null;
      }
      pos += 2;
    }
    switch (commandType) {
      case UNCOMPRESSED_BLOCK:
        while (len-- !== 0) {
          output[bpos++] = data[pos++];
        }
        break;
      case RUN_LENGTH_ENCODED_BYTE:
        while (len-- !== 0) {
          output[bpos++] = data[pos];
        }
        ++pos;
        break;
      case RUN_LENGTH_ENCODED_SHORT:
        if (bpos + 2 * len > maxLength || bpos < 0) {
          newRead = pos - start + 1;
          return null;
        }
        while (len-- !== 0) {
          output[bpos++] = data[pos];
          output[bpos++] = data[pos + 1];
        }
        pos += 2;
        break;
      case INCREMENTAL_SEQUENCE:
        tmp = data[pos++];
        while (len-- !== 0) {
          output[bpos++] = tmp++;
        }
        break;
      case REPEAT_PREVIOUS_DATA:
        if (bpos2 + len > maxLength || bpos2 < 0) {
          newRead = pos - start + 1;
          return null;
        }
        for (let i = 0; i < len; ++i) {
          output[bpos++] = output[bpos2 + i];
        }
        break;
      case REVERSE_BITS:
        if (bpos2 + len > maxLength || bpos2 < 0) {
          newRead = pos - start + 1;
          return null;
        }
        while (len-- !== 0) {
          output[bpos++] = REVERSED_BYTES[output[bpos2++] & 0xFF];
        }
        break;
      case UNKNOWN_1:
        if (bpos2 - len + 1 < 0) {
          newRead = pos - start + 1;
          return null;
        }
        while (len-- !== 0) {
          output[bpos++] = output[bpos2--];
        }
        break;
      default:
      case UNKNOWN_2:
        newRead = pos - start + 1;
        return null;
    }
  }
  newRead = pos - start + 1;
  return output;
}

export function getCompressedSize(start, data) {
  /* I use `var` as a workaround, because babili's transform currently binds it to the wrong scope! */
  var bpos = 0;
  let pos = start;
  let bpos2 = 0;
  while (data[pos] !== 0xFF) {
    /* Data overflow before end of compressed data */
    if (pos >= data.length) {
      return -8;
    }
    let commandType = data[pos] >> 5;
    let length = (data[pos] & 0x1F) + 1;
    if (commandType === 7) {
      commandType = (data[pos] & 0x1C) >> 2;
      length = ((data[pos] & 3) << 8) + (data[pos + 1]) + 1;
      ++pos;
    }
    if (bpos + length < 0) {
      return -1;
    }
    pos++;
    if (commandType >= 4) {
      bpos2 = (data[pos] << 8) + (data[pos + 1]);
      if (bpos2 < 0) {
        return -2;
      }
      pos += 2;
    }
    switch (commandType) {
      case UNCOMPRESSED_BLOCK:
        bpos += length;
        pos += length;
        break;
      case RUN_LENGTH_ENCODED_BYTE:
        bpos += length;
        ++pos;
        break;
      case RUN_LENGTH_ENCODED_SHORT:
        if (bpos < 0) {
          return -3;
        }
        bpos += 2 * length;
        pos += 2;
        break;
      case INCREMENTAL_SEQUENCE:
        bpos += length;
        ++pos;
        break;
      case REPEAT_PREVIOUS_DATA:
        if (bpos2 < 0) {
          return -4;
        }
        bpos += length;
        break;
      case REVERSE_BITS:
        if (bpos2 < 0) {
          return -5;
        }
        bpos += length;
        break;
      case UNKNOWN_1:
        if (bpos2 - length + 1 < 0) {
          return -6;
        }
        bpos += length;
        break;
      default:
      case UNKNOWN_2:
        return -7;
    }
  }
  return bpos;
}
