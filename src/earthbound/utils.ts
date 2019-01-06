// give me some JSON based on the "?" params
/*
export function getJsonFromUrl() {
  var query = location.search.substr(1);
  if (query === '')
    return '';

  var data = query.split('&');
  var result = {};
  for (var i = 0; i < data.length; i++) {
    var item = data[i].split('=');
    result[item[0]] = item[1];
  }
  return result;
}

export function parseLayerParam(number, options) {
  var defaultLayer = options.firstLayer ? 270 : 269;
  // todo canvas
  var canvas = document.querySelector('canvas');
  var num = Number(number);
  if (isNaN(num))
    num = defaultLayer;
  else if (num < 0 || num > 326)
    num = defaultLayer;

  options.firstLayer ? (canvas.dataset.layerOne = num) : (canvas.dataset.layerTwo = num);
  return num;
}


export function parseFrameskipParam(number) {
  var canvas = document.querySelector('canvas');
  var num = Number(number);
  if (isNaN(num))
    return num = 1;
  else if (num < 1 || num > 10)
    return num = 1;

  canvas.dataset.frameskip = num;
  return num;
}

export function parseAspectRatioParam(number) {
  var canvas = document.querySelector('canvas');
  var num = Number(number);
  if (isNaN(num))
    return num = 0;
  else if (num != 0 && num != 16 && num != 48 && num != 64)
    return num = 0;

  canvas.dataset.aspectRatio = num;
  return num;
}

export function parseFullscreen(fullscreen) {
  if (fullscreen == 'true') {
    // setupFullscreen();
    // todo, don't think we need to port this
  }
}*/

import { Block } from './rom/block';

export function isIOS() {
  return /(iPad|iPhone|iPod)/gi.test(navigator.userAgent);
}

export function isSafari() {
  return /\(KHTML, like Gecko\)\s+Version\//gi.test(navigator.userAgent);
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
export function readBlock(location) {
  // NOTE: there's no address conversion implemented yet;
  // we're assuming all addresses are file offsets (with header)
  // For now, just return a readable block; we'll worry about
  // typing and free space later
  return new Block(location);
}
