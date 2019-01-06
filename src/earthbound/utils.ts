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

export function isIOS() {
  return /(iPad|iPhone|iPod)/gi.test(navigator.userAgent);
}

export function isSafari() {
  return /\(KHTML, like Gecko\)\s+Version\//gi.test(navigator.userAgent);
}

// export function readBlock(location) {
//   // NOTE: there's no address conversion implemented yet;
//   // we're assuming all addresses are file offsets (with header)
//   // For now, just return a readable block; we'll worry about
//   // typing and free space later
//   return new Block(location);
// }
