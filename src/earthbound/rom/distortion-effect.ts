/* The data in effects is stored as uint8, but when we compute with them, we need to cast the results to int16. */

import { HORIZONTAL, HORIZONTAL_INTERLACED, VERTICAL } from '../constants';
import { Block } from './block';

function asInt16(value) {
  return new Int16Array([value])[0];
}

export class DistortionEffect {
  distortionData;
  data;

  constructor(index = 0, data) {
    this.data = data;
    this.distortionData = new Uint8Array(17);
    this.read(index);
  }

  /* Is not caching distortion effects doing any harm? */
  //   static handler() {
  //     for (let i = 0; i < 135; ++i) {
  //       ROM.add(new DistortionEffect(i));
  //     }
  //   }
  static sanitize(type) {
    if (type !== HORIZONTAL && type !== VERTICAL) {
      return HORIZONTAL_INTERLACED;
    } else {
      return type;
    }
  }

  get type() {
    return DistortionEffect.sanitize(this.distortionData[2]);
  }

  set type(value) {
    this.distortionData[2] = DistortionEffect.sanitize(this.distortionData[2]);
  }

  //   get duration() {
  //     return asInt16(this.distortionData[0] + (this.distortionData[1] << 8));
  //   }
  //   set duration(value) {
  //     this.distortionData[0] = value;
  //     this.distortionData[1] = value >> 8;
  //   }
  get frequency() {
    return asInt16(this.distortionData[3] + (this.distortionData[4] << 8));
  }

  set frequency(value) {
    this.distortionData[3] = value;
    this.distortionData[4] = value >> 8;
  }

  get amplitude() {
    return asInt16(this.distortionData[5] + (this.distortionData[6] << 8));
  }

  set amplitude(value) {
    this.distortionData[5] = value;
    this.distortionData[6] = value >> 8;
  }

  get compression() {
    return asInt16(this.distortionData[8] + (this.distortionData[9] << 8));
  }

  set compression(value) {
    this.distortionData[8] = value;
    this.distortionData[9] = value >> 8;
  }

  get frequencyAcceleration() {
    return asInt16(this.distortionData[10] + (this.distortionData[11] << 8));
  }

  set frequencyAcceleration(value) {
    this.distortionData[10] = value;
    this.distortionData[11] = value >> 8;
  }

  get amplitudeAcceleration() {
    return asInt16(this.distortionData[12] + (this.distortionData[13] << 8));
  }

  set amplitudeAcceleration(value) {
    this.distortionData[12] = value;
    this.distortionData[13] = value >> 8;
  }

  get speed() {
    return asInt16(this.distortionData[14]);
  }

  set speed(value) {
    this.distortionData[14] = value;
  }

  get compressionAcceleration() {
    return asInt16(this.distortionData[15] + (this.distortionData[16] << 8));
  }

  set compressionAcceleration(value) {
    this.distortionData[15] = value;
    this.distortionData[16] = value >> 8;
  }

  read(index) {
    const main = new Block(0xF708 + index * 17, this.data);
    for (let i = 0; i < 17; ++i) {
      this.distortionData[i] = main.readInt16();
    }
  }
}
