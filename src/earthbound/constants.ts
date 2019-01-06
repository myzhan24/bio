// Todo replace magic numbers with constants?
export const SNES_WIDTH = 256;
export const SNES_HEIGHT = 224;
export const WIDTH = 256;
export const HEIGHT = 256;
export const STRUCT_SIZE = 17;
export const MINIMUM_INDEX = 0;
export const MAXIMUM_INDEX = 326;
export const UNCOMPRESSED_BLOCK = 0;
export const RUN_LENGTH_ENCODED_BYTE = 1;
export const RUN_LENGTH_ENCODED_SHORT = 2;
export const INCREMENTAL_SEQUENCE = 3;
export const REPEAT_PREVIOUS_DATA = 4;
export const REVERSE_BITS = 5;
export const UNKNOWN_1 = 6;
export const UNKNOWN_2 = 7;

function generateReversedBytes() {
  const reversedBytes = new Int16Array(256);
  for (let i = 0; i < reversedBytes.length; ++i) {
    // todo may need to fix this
    const binary = i.toString(2).padStart(8, '0');
    const reversed = binary.split('').reverse().join('');
    const value = Number.parseInt(reversed, 2);
    reversedBytes[i] = value;
  }
  return reversedBytes;
}

// todo optimize?
export const REVERSED_BYTES = generateReversedBytes();
export const HORIZONTAL = 1;
export const HORIZONTAL_INTERLACED = 2;
export const VERTICAL = 3;
