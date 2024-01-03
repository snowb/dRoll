/**
 * Returns whether the passed value is numeric
 * @function
 * @param {String|Number} _input - expects a numeric value (String or Number)
 * @returns {Boolean} - true if numeric, otherwise false
 */
export const isNumeric=(_input)=>
{
  return typeof _input!=='undefined' && !isNaN(parseFloat(_input)) && isFinite(_input);
};