import {
  INCREMENTAL_SEQUENCE,
  REPEAT_PREVIOUS_DATA,
  REVERSE_BITS, REVERSED_BYTES,
  RUN_LENGTH_ENCODED_BYTE,
  RUN_LENGTH_ENCODED_SHORT,
  UNCOMPRESSED_BLOCK, UNKNOWN_1, UNKNOWN_2
} from '../constants';

export function snesToHex(address, header = true) {
  let newAddress = address;
  if (newAddress >= 0x400000 && newAddress < 0x600000) {
    newAddress -= 0x0;
  } else if (newAddress >= 0xC00000 && newAddress < 0x1000000) {
    newAddress -= 0xC00000;
  } else {
    throw new Error(`SNES address out of range: ${newAddress}`);
  }
  if (header) {
    newAddress += 0x200;
  }
  return newAddress - 0xA0200;
}

export function hexToSnes(address, header = true) {
  let newAddress = address;
  if (header) {
    newAddress -= 0x200;
  }
  if (newAddress >= 0 && newAddress < 0x400000) {
    return newAddress + 0xC00000;
  } else if (newAddress >= 0x400000 && newAddress < 0x600000) {
    return newAddress;
  } else {
    throw new Error(`File offset out of range: ${newAddress}`);
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
 * @param start - x
 * @param myData - y
 * @param output - z
 * Must already be allocated with at least enough space
 * @param read
 * "Out" parameter which receives the number of bytes of
 * compressed data read
 * @return The size of the decompressed data if successful, null otherwise
 */
export function decompress(start, myData, output, read) {
  const maxLength = output.length;
  let pos = start;
  let bpos = 0;
  let bpos2 = 0;
  let tmp;
  let newRead = read; // eslint-disable-line
  while (myData[pos] !== 0xFF) {
    // Data overflow before end of compressed data
    if (pos >= myData.length) {
      newRead = pos - start + 1;
      return null;
    }
    let commandType = myData[pos] >> 5;
    let len = (myData[pos] & 0x1F) + 1;
    if (commandType === 7) {
      commandType = (myData[pos] & 0x1C) >> 2;
      len = ((myData[pos] & 3) << 8) + myData[pos + 1] + 1;
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
      bpos2 = (myData[pos] << 8) + myData[pos + 1];
      if (bpos2 >= maxLength || bpos2 < 0) {
        newRead = pos - start + 1;
        return null;
      }
      pos += 2;
    }
    switch (commandType) {
      case UNCOMPRESSED_BLOCK:
        while (len-- !== 0) {
          output[bpos++] = myData[pos++];
        }
        break;
      case RUN_LENGTH_ENCODED_BYTE:
        while (len-- !== 0) {
          output[bpos++] = myData[pos];
        }
        ++pos;
        break;
      case RUN_LENGTH_ENCODED_SHORT:
        if (bpos + 2 * len > maxLength || bpos < 0) {
          newRead = pos - start + 1;
          return null;
        }
        while (len-- !== 0) {
          output[bpos++] = myData[pos];
          output[bpos++] = myData[pos + 1];
        }
        pos += 2;
        break;
      case INCREMENTAL_SEQUENCE:
        tmp = myData[pos++];
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

export function getCompressedSize(start, myData) {
  /* I use `var` as a workaround, because babili's transform currently binds it to the wrong scope! */

  let bpos = 0;
  let pos = start;
  let bpos2 = 0;
  while (myData[pos] !== 0xFF) {
    /* Data overflow before end of compressed data */
    if (pos >= myData.length) {
      return -8;
    }
    let commandType = myData[pos] >> 5;
    let length = (myData[pos] & 0x1F) + 1;
    if (commandType === 7) {
      commandType = (myData[pos] & 0x1C) >> 2;
      length = ((myData[pos] & 3) << 8) + (myData[pos + 1]) + 1;
      ++pos;
    }
    if (bpos + length < 0) {
      return -1;
    }
    pos++;
    if (commandType >= 4) {
      bpos2 = (myData[pos] << 8) + (myData[pos + 1]);
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
