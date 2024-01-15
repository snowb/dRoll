//modify constructor to allow for input of an array of numbers
//constructor(_minimum_value, _maximum_value, _modifier) 
//or
//constructor(_array_of_numbers, _modifier)
// -- min and max values are read from Array
// -- array need not be in a specific order
import { isNumeric } from "./isNumeric.js";
import { Dice } from "./dice-class.js";

/**
 * @typedef {Object} Metrics_Dice - The Metrics_Dice object to compute metrics from a Dice object
 * @property {number} minimum_modified_value - Minimum modified value from Dice object
 * @property {number} maximum_modified_value - Maximum modified value from Dice object
 * @property {function} modifier_function - function of modifier provided to constructor
 */
export class Metrics_Dice extends Dice {
  #minimum_modified_value = undefined; //minimum modified value
  #maximum_modified_value = undefined; //maximum modified value
  #modifier_function = undefined;

  constructor(_minimum_value, _maximum_value, _modifier){
    super(_minimum_value, _maximum_value, _modifier);
    this.#modifier_function = super.getModifierFunction();
    this.#maximum_modified_value = this.#modifier_function(_maximum_value);
    this.#minimum_modified_value = this.#modifier_function(_minimum_value);
  }
  /**
   * Returns the modified minimum value
   * @returns {Number} - minimum_value
   */
  getMinimum(){
    return this.#minimum_modified_value;
  };
  /**
   * Returns the modified maximum value
   * @returns {Number} - maximum_value
   */
  getMaximum(){
    return this.#maximum_modified_value;
  };
  /**
   * @returns {number} -  returns the average of all rolls
   */
  getAverage(){
    let sum = this.getResults().reduce((_sum, _result)=>{
      return _sum+=_result.value;
    },0);
    return sum / this.getResults().length;
  };
  /**
   * returns all values above the input value
   * @param {string|number} _value - value to match
   * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
   */
  getAbove (_value) {//get all values above _value
    if(!isNumeric(_value)){console.error("metrics-dice-class.js: getAbove requires a number for input.");return undefined;}
    let above_results = this.getResults().filter((_element)=>{return _element.value>+_value;});
    return {count:above_results.length, values:above_results};
  };
  /**
   * returns all values below the input value
   * @param {string|number} _value - value to match
   * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
   */
  getBelow (_value) {//get all values below _value
    if(!isNumeric(_value)){console.error("metrics-dice-class.js: getBelow requires a number for input.");return undefined;}
    let below_results = this.getResults().filter((_element)=>{return _element.value<+_value;});
    return {count:below_results.length, values:below_results};
  };
  /**
   * returns all values equal to the input value
   * @param {string|number} _value - value to match
   * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
   */
  getEqual (_value) {//get all values equal to _value
    if(!isNumeric(_value)){console.error("metrics-dice-class.js: getEqual requires a number for input.");return undefined;}
    let equal = this.getResults().filter((_element)=>{return _element.value==+_value;});
    return {count:equal.length, values:equal};
  };
  /**
   * returns all values within the to the input range, inclusive
   * @param {string|number} _min_value - starting value to compare
   * @param {string|number} _max_value - ending value to compare
   * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
   */
  getWithinRange (_min_value, _max_value) {//return all values within the specified range, inclusive
    if(!isNumeric(_min_value) || !isNumeric(_max_value)){console.error("metrics-dice-class.js: getWithinRange requires a number for Minimum and Maximum values.");return undefined;}
    let range = this.getResults().filter((_element)=>{return _element.value>=+_value && _element.value<=+_value;});
    return {count:equal.length, values:range};
  };
  /**
   * Returns Even values from Dice object
   * @returns {count: Number, values: Number[]} - object with count and Array of values
   */
  getEven(){
    let even = this.getResults().filter((_element)=>{return _element.value%2==0;});
    return {count:even.length, values:even};
  };
  /**
   * Returns Odd values from Dice object
   * @returns {count: Number, values: Number[]} - object with count and Array of values
   */
  getOdd(){
    let odd = this.getResults().filter((_element)=>{return _element.value%2==1;});
    return {count:odd.length, values:odd};
  };
  /**
   * runs all getAbove/Below/Equal/etc functions
   * returns all generated results
   * also returns the private properties of average and results
   * @param {string|number} _value - value to match
   * @returns {Object}
   */
  getAllForValue (_value) {//get above, below, equal, average, and all results
    if(!isNumeric(_value)){console.error("metrics-dice-class.js: getAllForValue requires a number for input.");return undefined;}
    let allForValue={};
    allForValue["Above_"+_value]=this.getAbove(_value);
    allForValue["Below_"+_value]=this.getBelow(_value);
    allForValue["Equal_To_"+_value]=this.getEqual(_value);
    allForValue["All_Results"]=this.getResults();
    return allForValue;
  };
  /**
   * generates output of all possible modified values,
   * then counts how many actual occurances of that value,
   * and provides ratio
   * @returns {Object[]} - [{value:{number}, count:{number}, ratio:{number}}]
   */
  getMetrics (){
    //return all possible values, the occurance count, and the ratio of occurance
    let metrics=[];
    for(let value=this.#minimum_modified_value; value<=this.#maximum_modified_value; value++) {
      let modifiedValue=this.#modifier_function(value);
      let count=this.getEqual(modifiedValue).count;
      let ratio=count/this.getIterations();
      metrics.push({value:modifiedValue, count:count, ratio:ratio});
    }
    return metrics;
  };
  /**
   * 
   * @param {Dice} _dice - convert from Dice object to Metrics_Dice object
   * @param {string|undefined} _method - "transcribe" or anything, whether to transcribe the values after setting up Metrics_Dice
    * @returns {undefined} - undefined on error
  */
  convertDice(_dice, _transcribe){
    if(!_dice instanceof Dice){
      console.error("metrics-dice-class.js: convertDice requires a Dice object for input.");
      return undefined;
    }
    if(_transcribe=="transcribe"){
      super.updateValues(_dice.getResults());
    }
  }
}
