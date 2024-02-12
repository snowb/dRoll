//modify constructor to allow for input of an array of numbers
//constructor(_minimum_value, _maximum_value, _modifier) 
//or
//constructor(_array_of_numbers, _modifier)
// -- min and max values are read from Array
// -- array need not be in a specific order
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
  getMinimumModified(){
    return this.#minimum_modified_value;
  };
  /**
   * Returns the modified maximum value
   * @returns {Number} - maximum_value
   */
  getMaximumModified(){
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
