import Block from './block';

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
export function readBlock(location, data) {
  // NOTE: there's no address conversion implemented yet;
  // we're assuming all addresses are file offsets (with header)
  // For now, just return a readable block; we'll worry about
  // typing and free space later
  return new Block(location, data);
}
