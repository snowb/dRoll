import { isNumeric } from "./isNumeric.js";

export const getRandomInt=(_min, _max)=>
{
  if(!isNumeric(_min) || !isNumeric(_max)){
    console.log("getRandomIn: _min or _max is not a number");
    return undefined;
  }
  let byteArray = new Uint8Array(1);
  window.crypto.getRandomValues(byteArray);

  let range = _max - _min + 1;
  let max_range = 256;//hard limit of 256/8bits due to
  if (byteArray[0] >= Math.floor(max_range / range) * range)
      return getRandomInt(_min, _max);
  return _min + (byteArray[0] % range);
};