import { isNumeric } from "./isNumeric.js";
import { Dice } from "./dice-class.js";
/**
 * Pool object an Array of Dice objects and an optional iterations counts 
 * Generates calls .roll() on the provided Dice objects and stores the results
 * Generate secondary and abbreviated results as well
 * @typedef {Object} Pool - The Pool object
 * @property {number} iterations - number of iterations
 * @property {Object[]} fullRollResults - Array of objects containing Dice objects
 * @property {Object[]} rollResults - Array of objects containing abbreviated data [{index:number, roll:number[]}]
 * @property {Object} secondaryResults - Contains sum, mean, min, and max values for all roll
 * @property {Object} groupResults - contains sets, sequences, and metrics for both
 */
export class Pool {
  #iterations=10000;
  #fullRollResults=null;
  #rollResults=null;
  #secondaryResults={
    sum:[],mean:[],
    min:[],max:[],
    pool_max:null,pool_min:null,
    pool_mean:null, pool_mode:null, pool_median:null
  }; 
  #groupResults={
    sets:[], 
    sequences:[], 
    totalSetsCount:undefined, 
    totalRollsWithSets:undefined, 
    totalSequencesCount:undefined, 
    totalRollsWithSequences:undefined
  };
  /**
   * Populates private properties and rolls the Dice object provided
   * @class
   * @param {Dice[]} _dice_objects_array - array of Dice objects to roll and generate data
   * @param {string|number} [_iterations=10_000] - number of iterations to roll
   */
  constructor (_dice_objects_array, _iterations) {
    //input: array of Dice objects
    if(_dice_objects_array===undefined) {
      //empty new Pool() call, create empty array and calculate nothing
      //needs addDice() to stuff
      this.#fullRollResults=[];
      if(isNumeric(_iterations)) {this.#iterations=+_iterations;}
      else if(typeof _iterations!=="undefined") {
        console.warn("pool-class.js: Invalid iterations passed, assuming 10,000.");
      }
    } else if(!_dice_objects_array instanceof Array) {
      console.error("pool-class.js: Pool constructor requires an Array of Dice objects.");
    } else {
      this.#fullRollResults = _dice_objects_array.reduce((_dice_array, _element)=>{
        if(_element instanceof Dice) {_dice_array.push(_element);}
        return _dice_array;
      },[]);
      let all_dice_objects=this.#fullRollResults.length==_dice_objects_array.length;
      if (this.#fullRollResults.length==0) {
        console.error("pool-class.js: No valid Dice objects passed to constructor.");
      } else if(this.#fullRollResults.length>0 && !all_dice_objects) {
        console.warn("pool-class.js: Not all objects are Dice objects, reducing to valid Dice objects.");
      }
      if(isNumeric(_iterations)) {this.#iterations=+_iterations;}
      else if(typeof _iterations!=="undefined") {
        console.warn("pool-class.js: Invalid iterations passed, assuming 10,000.");
      }
      this.rollPool();
    }
  };
  /**
   * returns iterations value
   * @returns {number} - pool's iterations
   */
  getIterations () {
    return this.#iterations;
  }
  /**
   * update iterations and re-roll;
   * @param {number} _iterations 
   */
  setIterations (_iterations) {
    this.#iterations=_iterations;
    this.rollPool();
  }
  /**
   * return #fullRollResults private property
   * @returns {Dice[]}
   */
  getFullRollResults () { return this.#fullRollResults; };
  /**
   * return #rollResults private property
   * @returns {Object[]} - [{index:number, roll:number[]}]
   */
  getRollResults () { return this.#rollResults; };
  /**
   * return sum from #secondaryResults
   * @returns {number[]}
   */
  getSumRolled () { return this.#secondaryResults.sum; };
  /**
   * return mean from #secondaryResults
   * @returns {number[]}
   */
  getMeanRolled () { return this.#secondaryResults.mean; };
  /**
   * return min from #secondaryResults
   * @returns {number[]}
   */
  getMinRolled () { return this.#secondaryResults.min; };
  /**
   * return max from #secondaryResults
   * @returns {number[]}
   */
  getMaxRolled () { return this.#secondaryResults.max; };
  getPoolMin(){ return this.#secondaryResults.pool_min; }
  getPoolMax(){ return this.#secondaryResults.pool_max; }
  getPoolMean(){ return this.#secondaryResults.pool_mean; }
  /**
   * return total number of sequences
   * @returns {number}
   */
  getTotalSequencesCount(){return this.#groupResults.totalSequencesCount};
  /**
   * return total number of rolls with sequences
   * @returns {number}
   */
  getTotalRollsWithSequences(){return this.#groupResults.totalRollsWithSequences};
  /**
   * return total number of sets
   * @returns {number}
   */
  getTotalSetsCount(){return this.#groupResults.totalSetsCount};
  /**
   * return total number of rolls with sets
   * @returns {number}
   */
  getTotalRollsWithSets(){return this.#groupResults.totalRollsWithSets};
  /**
   * @returns {number} - length/size of pool
   */
  getPoolSize(){
    return this.#fullRollResults.length;
  };
  /**
   * rolls all Dice in the Pool, calculates secondary values
   */
  rollPool () {
    this.#fullRollResults.forEach((_element)=>{_element.roll(this.#iterations)});
    this.#calculatePoolOtherValues();
  };
  #calculatePoolOtherValues(){
    this.#calculateSecondaryValues();
    this.#calculateSequences();
    this.#calculateSets();
  }
  /**
   * private property
   * calculates secondary values; sum, mean, min, max and stores in #secondaryResults private prop
   * calculates abbreviated and sorted roll data and stores in #rollResults private prop
   */
  #calculateSecondaryValues () {
    this.#secondaryResults.sum=Array(this.#iterations);
    this.#secondaryResults.mean=Array(this.#iterations);
    this.#secondaryResults.min=Array(this.#iterations);
    this.#secondaryResults.max=Array(this.#iterations);
    this.#rollResults=Array(this.#iterations);
    for(let index=0;index<this.#iterations;index++){
      //generate secondary results; sums, mins, maxes, means
      this.#secondaryResults.sum[index]=0;
      let roll=0;//for determine mean in next step
      let min=null;
      let max=null;
      let temp_rolls=[];
      for(;roll<this.#fullRollResults.length;roll++){
        let roll_result_value=this.#fullRollResults[roll].getResults()[index].value;
        this.#secondaryResults.sum[index]+=roll_result_value===undefined ? 0 : roll_result_value;
        if(min === null || min > roll_result_value) {
          min = roll_result_value;
        }
        if(max === null || max < roll_result_value) {
          max = roll_result_value;
        }
        temp_rolls.push(roll_result_value);
      }
      this.#secondaryResults.mean[index]=this.#secondaryResults.sum[index]/roll;
      this.#secondaryResults.min[index]=min;
      this.#secondaryResults.max[index]=max;
      this.#rollResults[index]={index:index,roll:temp_rolls.sort()};
    }
    this.#secondaryResults.pool_min=this.#rollResults.reduce((_min, _values_array)=>{
      let values_sum=_values_array.roll.reduce((_sum, _value)=>{
        return _sum + (_value===undefined ? 0 : _value);
      },0);
      if(values_sum<_min){return values_sum}
      return _min;
    },Infinity);
    this.#secondaryResults.pool_max=this.#rollResults.reduce((_max, _values_array)=>{
      let values_sum=_values_array.roll.reduce((_sum, _value)=>{
        return _sum + (_value===undefined ? 0 : _value);
      },0);
      if(values_sum>_max){return values_sum}
      return _max;
    },-Infinity);
    this.#secondaryResults.pool_mean=this.#secondaryResults.sum.reduce((_avg,_value)=>{
      return _avg + _value;
    },0) / this.#iterations;
    let temp_median=this.#secondaryResults.sum.toSorted((_a, _b)=>{
      return _a >= _b ? 1 : -1;
    });

    if(temp_median.length%2==0){
      this.#secondaryResults.pool_median = (temp_median[temp_median.length/2]+temp_median[(temp_median.length/2)-1])/2;
    } else {
      this.#secondaryResults.pool_median = temp_median[Math.floor(temp_median.length/2)];
    } 
  }
  /**
   * calls #getGroups private function for Sequences
   * stores relevant metrics
   */
  #calculateSequences() {
    this.#groupResults.sequences=this.#getGroups("sequences");
    this.#groupResults.totalSequencesCount=this.#groupResults.sequences.reduce((_count, _sequence)=>{
      return _count+_sequence.sequences.length;
    },0);
    this.#groupResults.totalRollsWithSequences=this.#groupResults.sequences.length;
  }
  /**
   * calls #getGroups private function for Sets
   * stores relevant metrics
   */
  #calculateSets() {
    this.#groupResults.sets=this.#getGroups("sets");
    this.#groupResults.totalSetsCount=this.#groupResults.sets.reduce((_count, _set)=>{
      return _count+_set.sets.length;
    },0);
    this.#groupResults.totalRollsWithSets=this.#groupResults.sets.length;
  }
  /**
   * core function for retrieving roll result comparison data for individual rolls
   * @param {string} [_operation="equal"] - operation to execute
   * @param {number} _first_value - value to compare
   * @param {number} [_second_value] - second value for range compare
   * @returns {Object[]} - [{index:number, values:number[]}]
   */
  #getOperation (_operation, _first_value, _second_value) {
    let operation_result=[];
    const rolls=this.#fullRollResults.length;
    let is_even=[];
    for(let index=0;index<this.#iterations;index++){
      let dice_results=[];
      let is_keep=false;
      for(let roll=0;roll<rolls;roll++){
        let dice_value=this.#fullRollResults[roll].getResults()[index].value
        dice_results.push(dice_value);
        switch(_operation) {
          case "even":
            is_keep = dice_value%2 == 0 ? true : is_keep;
            break;
          case "odd":
            is_keep = dice_value%2 == 1 ? true : is_keep;
            break;
          case "above":
            is_keep = dice_value > _first_value ? true : is_keep;
            break;
          case "below":
            is_keep = dice_value < _first_value ? true : is_keep;
            break;
          case "range":
            is_keep = dice_value >= _first_value && dice_value <= _second_value ? true : is_keep;
            break;
          case "equal":
          default:
            if(Array.isArray(_first_value)){
              is_keep = _first_value.includes(dice_value) ? true : is_keep;
            }
            else{
              is_keep = dice_value == +_first_value ? true : is_keep;
            }
          }
      }
      if(is_keep) {
        operation_result.push({index:index, values:dice_results});
      }
    }
    return operation_result;
  };
  /**
   * core function for retrieving roll result comparison data for the Sum of all rolls
   * @param {string} [_operation="equal"] - operaton to execute
   * @param {number} _first_value - first value to compare, or Array of values if getEqual
   * @param {number} [_second_value] - second value for range compare
   * @returns {Object[]} - [{index:number, values:number[]}]
   */
  #getSumOperation (_operation, _first_value, _second_value) {
    return this.#secondaryResults.sum.reduce((_operation_result, _sum_value, _index)=>{
      let is_keep=false;
      switch(_operation) {
        case "even":
          is_keep = _sum_value%2 == 0? true : false;
          break;
        case "odd":
          is_keep = _sum_value%2 == 1 ? true : false;
          break;
        case "above":
          is_keep = _sum_value > _first_value ? true : false;
          break;
        case "below":
          is_keep = _sum_value < _first_value ? true : false;
          break;
        case "range":
          is_keep = _sum_value >= _first_value && _sum_value <= _second_value ? true : false;
          break;
        case "equal":
        default:
          if(Array.isArray(_first_value)){
            is_keep = _first_value.includes(+_sum_value) ? true : false;
          }
          else{
            is_keep = _sum_value == +_first_value ? true : false;
          }          
          break;
      }
      if(is_keep) {
        _operation_result.push({index:_index, values:_sum_value});
      }
      return _operation_result;
    },[]);    
  }
  /**
   * 
   * @param {String} _filter_type - which filtered array to get metrics on (Even, Odd, Equal, etc)
   * @param {Number|String} _target_value - Numeric, the comparison value for Equal, Above, Below
   * @param {String} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH target Dice or only the Pool Value OF target Dice.
   * @returns 
   */
  #getFilterMetrics(_filter_type, _first_target_value, _second_target_value, _result_target){
    let metrics={pool_metrics:[]};
    let filtered_array=undefined;
    switch(_filter_type){
      case "even":
        filtered_array=this.getEven();
        break;
      case "odd":
        filtered_array=this.getOdd();
        break;
      case "equal":
        filtered_array=this.getEqual(_first_target_value);
        break;
      case "above":
        filtered_array=this.getAbove(_first_target_value);
        break;
      case "below":
        filtered_array=this.getBelow(_first_target_value);
        break;
      case "range":
        filtered_array=this.getWithinRange(_first_target_value,_second_target_value);
        break;
    }
    let with_sums_array=filtered_array.reduce((_pool_array, _pool_object)=>{
      let new_pool_object={
        index:undefined, 
        values:undefined,
        sum:undefined
      };
      new_pool_object.index=_pool_object.index;
      if(_result_target!="dice"){
        new_pool_object.values=_pool_object.values;
        new_pool_object.sum=_pool_object.values.reduce((_sum, _value)=>{
          return _sum+_value;
        },0);
      } else {
        switch(_filter_type){
          case "even":
            new_pool_object.values=_pool_object.values.filter((_value)=>{return _value%2==0});
            break;
          case "odd":
            new_pool_object.values=_pool_object.values.filter((_value)=>{return _value%2==1});
            break;
          case "equal":
            new_pool_object.values=_pool_object.values.filter((_value)=>{return _value==_first_target_value});
            break;
          case "above":
            new_pool_object.values=_pool_object.values.filter((_value)=>{return _value>_first_target_value});
            break;
          case "below":
            new_pool_object.values=_pool_object.values.filter((_value)=>{return _value<_first_target_value});
            break;
          case "range":
            new_pool_object.values=_pool_object.values.filter((_value)=>{return _value>=_first_target_value && _value<=_second_target_value});
            break;
        }
        new_pool_object.sum=new_pool_object.values.reduce((_sum, _value)=>{
          return _sum+_value;
        },0);
      }
      _pool_array.push(new_pool_object);
      return _pool_array;
    },[]);
    let lowest_dice_minimum=this.#fullRollResults.reduce((_min_value, _dice)=>{
      if(_dice.getMinimum()<_min_value){return _dice.getMinimum()}
      return _min_value;
    },Infinity);
    for(let value=lowest_dice_minimum; value<=this.#secondaryResults.pool_max; value++) {
      let count=with_sums_array.filter((_pool_object)=>{
        return _pool_object.sum==value;
      }).length;
      let ratio=count/this.#iterations;
      metrics.pool_metrics.push({value:value, count:count, ratio:ratio});
    }
    metrics.pool_metrics=metrics.pool_metrics.filter((_metrics_object)=>{return _metrics_object.count>0});
    //maybe use the zero-count-cleared array for secondaries but still include full array?
    let metrics_secondaries=this.#calculateMetricSecondaries(metrics.pool_metrics);
    metrics.median=metrics_secondaries.median;
    metrics.mean=metrics_secondaries.mean;
    metrics.mode=metrics_secondaries.mode;
    return metrics;
  }
  /**
   * @returns {Dice[]} - Pools with Even results within Dice
   */
  getEven(){
    return this.#getOperation("even"); 
  };
  /**
   * Return metrics for the given filter
   * @param {String} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH Even Dice or only the Pool Value OF Even Dice.
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getEvenMetrics(_result_target){
    return this.#getFilterMetrics("even", undefined, undefined, _result_target);
   };
  /**
   * @returns {Dice[]} - odd results
   */
  getOdd(){
    return this.#getOperation("odd"); 
  };
  /**
   * Return metrics for the given filter
   * @param {String} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH Odd Dice or only the Pool Value OF Odd Dice.
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getOddMetrics(_result_target){
    return this.#getFilterMetrics("odd", undefined, undefined, _result_target);
  };
  /**
   * calculates mean, median, and mode of a provided {value, count} Array
   * @param {Object[]} _counts_values_object - array of objects of form {value, count}
   * @returns {Object} - of form {mean:Number, median:Number, mode:Number}
   */
  #calculateMetricSecondaries(_counts_values_object){
    let metrics_secondaries={};

    let intermediate_mean = _counts_values_object.reduce((_pool_total, _metric)=>{
      _pool_total.total_value+=_metric.value*_metric.count;
      _pool_total.total_count+=_metric.count;
      return _pool_total;
    },{total_value:0, total_count:0});
    metrics_secondaries.mean = intermediate_mean.total_value / intermediate_mean.total_count;
    let temp_median=_counts_values_object.reduce((_values_array, _metric)=>{
      _values_array.push(_metric.value);
      return _values_array;
    },[]);

    if(temp_median.length%2==0){
      metrics_secondaries.median = (temp_median[temp_median.length/2]+temp_median[(temp_median.length/2)-1])/2;
    } else {
      metrics_secondaries.median = temp_median[Math.floor(temp_median.length/2)];
    }

    metrics_secondaries.mode=_counts_values_object.reduce((_mode_object, _metric_object)=>{
      if(_metric_object.count >= _mode_object.count){
        return _metric_object;
      }
      return _mode_object;
    },{count:0}).value;
    return metrics_secondaries;
  }
  /**
  * returns numbers above the provided value
  * @param {string|number} _value - numeric for value to compare
  * @returns {Object[]} - [{index:number, values:number[]}]
  */
  getAbove (_value) {//return Rolls with values above _value
    if(!isNumeric(_value)){console.error("pool-class.js: getAbove requires a number for _value.");return undefined;}
    return this.#getOperation("above",+_value);
  };
  /**
   * Return metrics for the given filter
   * @param {string|number} _value - numeric for value to compare
   * @param {String} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH Above Dice or only the Pool Value OF Above Dice.
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getAboveMetrics(_value, _result_target){
    if(!isNumeric(_value)){console.error("pool-class.js: getAboveMetrics requires a number for _value.");return undefined;}
    return this.#getFilterMetrics("above", +_value, undefined, _result_target);
  };
  /**
  * returns numbers below the provided value
  * @param {string|number} _value - numeric for value to compare
  * @returns {Object[]} - [{index:number, values:number[]}]
  */
  getBelow (_value) {//return Rolls with values below _value
    if(!isNumeric(_value)){console.error("pool-class.js: getBelow requires a number for _value.");return undefined;}
    return this.#getOperation("below",+_value);
  };
  /**
   * Return metrics for the given filter
   * @param {string|number} _value - numeric for value to compare
   * @param {String} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH Below Dice or only the Pool Value OF Below Dice.
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getBelowMetrics(_value, _result_target){
    if(!isNumeric(_value)){console.error("pool-class.js: getBelowMetrics requires a number for _value.");return undefined;}
    return this.#getFilterMetrics("below", +_value, undefined, _result_target);
  };
  /**
  * returns numbers equal to the provided value
  * @param {string|number} _value - numeric for value to compare
  * @returns {Object[]} - [{index:number, values:number[]}]
  */
  getEqual (_value) {//return Rolls with values equal to _value
    let is_invalid_array = Array.isArray(_value) ? _value.some((_value)=>{return !isNumeric(_value)}) : false;
    let is_invalid_number = !Array.isArray(_value) && !isNumeric(_value) ? true : false;
    if(is_invalid_array || is_invalid_number){
      console.error("pool-class.js: getEqual requires a Number or an Array of Numbers for input");
      return undefined;
    } 
    return this.#getOperation("equal",_value);
  };
  /**
   * Return metrics for the given filter
   * @param {string|number} _value - numeric for value to compare
   * @param {String} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH Below Dice or only the Pool Value OF Below Dice.
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getEqualMetrics(_value, _result_target){
    if(!isNumeric(_value)){console.error("pool-class.js: getEqualMetrics requires a number for _value.");return undefined;}
    return this.#getFilterMetrics("equal", +_value, undefined, _result_target);
  };
  /**
   * returns numbers within the specified range, inclusive
   * @param {string|number} _min_value 
   * @param {string|number} _max_value 
   * @returns {Object[]} - [{index:number, values:number[]}]
   */
  getWithinRange (_min_value, _max_value) {//return Rolls with values within range of _min_value and _max_value, inclusive
    if(!isNumeric(_min_value) || !isNumeric(_max_value)){console.error("pool-class.js: getWithinRange requires a number for Minimum and Maximum values.");return undefined;}
    return this.#getOperation("range",+_min_value,+_max_value);
  };
  /**
   * Return metrics for the given filter
   * @param {string|number} _value - numeric for value to compare
   * @param {String} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH Below Dice or only the Pool Value OF Below Dice.
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getWithinRangeMetrics(_min_value, _max_value, _result_target){
    if(!isNumeric(_min_value) || !isNumeric(_max_value)){console.error("pool-class.js: getWithinRangeMetrics requires a number for Minimum and Maximum values.");return undefined;}
    return this.#getFilterMetrics("range", +_min_value, +_max_value, _result_target);
  };
  /**
   * @returns {Dice[]} - even results
   */
  getSumEven(){
    return this.#getSumOperation("even"); 
  };
  /**
   * @returns {Dice[]} - odd results
   */
  getSumOdd(){
    return this.#getSumOperation("odd"); 
  };
  /**
  * returns roll sums above the provided value
  * @param {string|number} _value - numeric for value to compare
  * @returns {Object[]} - [{index:number, values:number[]}]
  */
  getSumAbove (_value) {//return Sums with values above _value
    if(!isNumeric(_value)){console.error("pool-class.js: getAbove requires a number for _value.");return undefined;}
    return this.#getSumOperation("above",+_value);
  };
  /**
  * returns roll sums below the provided value
  * @param {string|number} _value - numeric for value to compare
  * @returns {Object[]} - [{index:number, values:number[]}]
  */
  getSumBelow (_value) {//return Sums with values below _value
    if(!isNumeric(_value)){console.error("pool-class.js: getBelow requires a number for _value.");return undefined;}
    return this.#getSumOperation("below",+_value);
  };
  /**
  * returns roll sums equal to the provided value
  * @param {string|number} _value - numeric for value to compare
  * @returns {Object[]} - [{index:number, values:number[]}]
  */
  getSumEqual (_value) {//return Sums with values equal to _value
    let is_invalid_array = Array.isArray(_value) ? _value.some((_value)=>{return !isNumeric(_value)}) : false;
    let is_invalid_number = !Array.isArray(_value) && !isNumeric(_value) ? true : false;
    if(is_invalid_array || is_invalid_number){
      console.error("pool-class.js: getEqual requires a Number or an Array of Numbers for input");
      return undefined;
    } 
    return this.#getSumOperation("equal",_value);
  };
  /**
   * returns roll sums within the specified range, inclusive
   * @param {string|number} _min_value 
   * @param {string|number} _max_value 
   * @returns {Object[]} - [{index:number, values:number[]}]
   */
  getSumWithinRange (_min_value, _max_value) {//return Sums with values within range of _min_value and _max_value, inclusive
    if(!isNumeric(_min_value) || !isNumeric(_max_value)){console.error("pool-class.js: getWithinRange requires a number for Minimum and Maximum values.");return undefined;}
    return this.#getSumOperation("range",+_min_value,+_max_value);
  };
  /**
   * returns all sequences, series of incrementing numbers of 2 or more length (1-2; 2-3-4)
   * @returns {Object[]} - [{index:number, sequences:Array[ number[] ]}]
   */
  getSequences(){
    //return all sequences (1-2, 2-3-4, etc)
    return this.#groupResults.sequences;
  };
  /**
   * returns all sets, series of same numbers of 2 or more length (2-2; 3-3-3)
   * @returns {Object[]} - [{index:number, sets:Array[ number[] ]}]
   */
  getSets(){
    //returns sets of matching numbers (3-3-3, etc)
    return this.#groupResults.sets;
  };
  /**
   * core group generating function
   * @param {string} _target_group - target group to calculate, Sets or Sequences
   * @returns {Object[]} - [{index:number, [sets|sequences]:Array[ number[] ]}]
   */
  #getGroups(_target_group){
    //returns group, either sets of matching numbers of sequences
    return this.#rollResults.reduce((_results, _roll)=>{
      let temp_groups=[];
      let final_groups=[];
      let current_group=0; 
      switch(_target_group) {
        case "sets":
          //loop thru rollResults, return matching Sets (2-2, 3-3-3, etc) 
          temp_groups[current_group]=[undefined];
          _roll.roll.forEach((_value)=>{
            if(_value == temp_groups[current_group][0]){
              temp_groups[current_group].push(_value);
            } else {
              current_group++;
              temp_groups[current_group]=[];
              temp_groups[current_group].push(_value);
            }
          });
          break;
        case "sequences":
          //reduce rollResults to only unique values
          let unique_values=_roll.roll.reduce((_uniques, _value)=>{
            if(!_uniques.includes(_value)) {_uniques.push(_value);}
            return _uniques;
          },[]).sort((_a, _b)=>{return +_a > +_b ? 1 : -1});
          //find Sequences within unique_values
          temp_groups[current_group]=[undefined];
          unique_values.forEach((_value, _index)=>{
            if((+_value - 1) == (unique_values[+_index - 1])){
              temp_groups[current_group].push(+_value);
            } else {
              current_group++;
              temp_groups[current_group]=[];
              temp_groups[current_group].push(+_value);
            }
          });
          break;
        default:
          console.error("pool-class.js: Invalid group type passed to getSequences()/getSets().")
          return;
        }
      //clear empty or 1-length elements and return results
      final_groups=temp_groups.reduce((_final_groups, _results)=>{
        if(_results.length>1){_final_groups.push(_results)}
        return _final_groups;
      },[]);
      if(final_groups.length>0){
        _results.push({index:_roll.index, [_target_group]:final_groups})
      }
      return _results;
    },[]);
  };
  /**
   * returns Sets that contain the provided value
   * @param {string|number} _value 
   * @returns {Object[]} - [{index:number, sets:Array[ number[] ]}]
   */
  getSetsOfValue (_value) {
    //return sets that have the given _value (2s, 3s, etc)
    return this.#getGroupByProperty("getSetsOfValue", "sets", _value);
  };
  /**
   * returns Sets that are of the provide length
   * @param {string|number} _length 
   * @returns {Object[]} - [{index:number, sets:Array[ number[] ]}]
   */
  getSetsOfLength (_length){
    //return sets of the given _length (3=>4,4,4; etc)
    return this.#getGroupByProperty("getSetsOfLength", "sets", _length);
  };
  /**
   * returns Sequences that contain the provided value
   * @param {string|number} _value 
   * @returns {Object[]} - [{index:number, sequences:Array[ number[] ]}]
   */
  getSequencesWithValue (_value){
    //return sequences that contain _value (3=>2,3,4; etc)
    return this.#getGroupByProperty("getSequencesWithValue", "sequences", _value);
  };
  /**
   * returns Sequences that are of the provide length
   * @param {string|number} _length 
   * @returns {Object[]} - [{index:number, sequences:Array[ number[] ]}] 
   */
  getSequencesOfLength (_length){
    //return sequences of the given _length (4=>4,5,6,7; etc)
    return this.#getGroupByProperty("getSequencesOfLength", "sequences", _length);
  };
  /**
   * 
   * @param {string} _property - operation to execute
   * @param {string} _target_group - which group to get, Sets or Sequences
   * @param {string|number} _value - value to match to
   * @returns {Object[]} - [{index:number, [set|sequences]:Array[ number[] ]}] 
   */
  #getGroupByProperty(_property, _target_group, _value){
    if(!isNumeric(_value)){console.error("pool-class.js: "+_property+" requires a number for input.");return undefined;}
    return this.#groupResults[_target_group].reduce((_results, _groups)=>{
      let found_groups=_groups[_target_group].reduce((_found_groups, _roll)=>{
        switch(_property){
          case "getSetsOfValue":
            if(_roll[0]===+_value) {_found_groups.push(_roll);}
            return _found_groups;
          case "getSetsOfLength":
            if(_roll.length==+_value) {_found_groups.push(_roll);}
            return _found_groups;
          case "getSequencesWithValue":
            if(_roll.includes(+_value)) {_found_groups.push(_roll);}
            return _found_groups;
          case "getSequencesOfLength":
            if(_roll.length==+_value) {_found_groups.push(_roll);}
            return _found_groups;
        }
      },[]);
      if(found_groups.length>0){
        _results.push({index:_groups.index, [_target_group]:found_groups});
      }
      return _results;
    },[]);
  };
  /**
   * generate all possible values, then generate counts and ratios for each
   * @returns {Object} - {dice_metrics:Object[], 
   *                      maximum_value:number, 
   *                      minimum_value:number,
   *                      pool_metrics:Object[]}
   *                    - dice_metrics: [{value:number, count:number, ratio:number}]
   *                    - pool_metrics: [{value:number, count:number, ratio:number}] 
   */
  getMetrics () {
    let metrics={};
    let min_value=0;
    let max_value=0;
    metrics.dice_metrics=this.#fullRollResults.reduce((_metrics, _dice)=>{
      let roll_metrics=_dice.getMetrics();
      min_value+=_dice.getAdditionalText()=="Exploding" ? min_value : roll_metrics[0].value;
      max_value+=roll_metrics[roll_metrics.length-1].value;
      _metrics.push(roll_metrics);
      return _metrics;
    },[]);
    metrics.minimum_value=min_value;
    metrics.maximum_value=max_value;
    metrics.pool_metrics=[];
    for(let value=min_value; value<=max_value; value++) {
      let count=this.getSumEqual(value).length;
      let ratio=count/this.#iterations;
      metrics.pool_metrics.push({value:value, count:count, ratio:ratio});
    }
    metrics.mean=this.#secondaryResults.pool_mean;
    metrics.median=this.#secondaryResults.pool_median;
    metrics.mode=metrics.pool_metrics.reduce((_mode_object, _metric_object)=>{
      if(_metric_object.count >= _mode_object.count){
        return _metric_object;
      }
      return _mode_object;
    },{count:0}).value;
    return metrics;
  };
  /**
   * generate arrays of all possible values as object/associative arrays
   * @returns {number[]}
   */
  #getAllPossibleValues () {
    return this.#fullRollResults.reduce((_all_values, _dice)=>{
      //generate arrays of all possible values as object/associative arrays
      //make NO assumptions about values within Dice arrays
      let dice_min_val=_dice.getMinimum();
      let dice_max_val=_dice.getMaximum();
      let object_of_all_values = {};
      Array((dice_max_val - dice_min_val)+1)
        .fill(undefined).map((_value, _index)=>{return _dice.modifySingleValue(+dice_min_val + _index)})
        .forEach((_value)=>{object_of_all_values[_value]=_value});    
      _all_values.push(object_of_all_values);  
      return _all_values;
    },[]);
  }
  /**
   * determines all possible Sets
   * determines metrics of actual rolled results
   * @returns {Object[]} - [{count:number, ratio:number, set:number[]}]
   */
  getSetMetrics () {
    //have to determine all potential sets. depends on smallest max_value
    if(this.#fullRollResults.length<2) {
      //return an empty array if only 1 Dice
      return [];
    }
    let all_possible_values = this.#getAllPossibleValues();
    let all_possible_sets_object= {};
    all_possible_values.forEach((_all_values_object_array, _index)=>{
      //count max set size for all possible values
      //key-value pair is "roll-value":max-set-size
      for(let _possible_value in _all_values_object_array) {
        if(all_possible_sets_object[_possible_value]===undefined) {all_possible_sets_object[_possible_value]=1;}
        else {all_possible_sets_object[_possible_value]+=1;}
      }
    });
    let all_sets_metrics=[];
    for(let _valueOfSet in all_possible_sets_object){
      //loop thru possible values, return sets of that value
      const setsOfValue = this.getSetsOfValue(_valueOfSet);
      for(let _set_length=2; _set_length<=this.#fullRollResults.length; _set_length++){
        //filter by set length, count, calculate metric
        let set_count=setsOfValue.filter((_element)=>{return _element.sets[0].length==_set_length}).length;
        let set_metrics={set:Array(_set_length).fill(+_valueOfSet),
          count: set_count, ratio: (set_count/this.#iterations)
          };
          all_sets_metrics.push(set_metrics);
      }
    }
    all_sets_metrics=all_sets_metrics.reduce((_non_empty_sets, _set)=>{
      if(_set.count>0){
        _non_empty_sets.push(_set);
      }
      return _non_empty_sets;
    },[]);
    return all_sets_metrics;
  };
  /**
   * determines all possible Sequences
   * determines metrics of actual rolled results
   * @returns {Object[]} - [{count:number, ratio:number, sequence:string}]
   */
  getSequenceMetrics () {
    //have to determine all potential sequences
    if(this.#fullRollResults.length<2) {
      return [];
    }
    let all_possible_values = this.#getAllPossibleValues().reduce((_arrayed_values, _object_of_values)=>{
      //return each object of key-values to as an array of just values
      _arrayed_values.push(Object.values(_object_of_values)
        .sort((_a, _b)=>{return +_a > +_b ? 1 : -1}));//super simple sort, all values are unqiue so no 0 returns
      return _arrayed_values;
    },[]);

    let allPossibleSequences=[];
    all_possible_values.forEach((_values_array, _index)=>{
      _values_array.forEach((_value)=>{
        let matched_sequence=[_value];
        allPossibleSequences.push([_value]);
        let next_value_in_sequence=+_value + 1;
        for(let _check_array=0; _check_array<all_possible_values.length;_check_array++){
          if(_check_array==_index){continue;}
          else if(all_possible_values[_check_array].includes(next_value_in_sequence)){
            allPossibleSequences[allPossibleSequences.length-1].push(next_value_in_sequence);
            matched_sequence.push(next_value_in_sequence);
            next_value_in_sequence++;
          }
        }
        let current_working_sequence=matched_sequence.slice();
        for(let subSequenceLength=(current_working_sequence.length-1); subSequenceLength>1; subSequenceLength--){
          //get subSequence length to find
          for(let start=0;(start+subSequenceLength)<=(current_working_sequence.length);start++){
            //get subSequence length starting point, and extract all subsequences into allPossibleSequences
            let subSequence=current_working_sequence.slice(start,start+subSequenceLength);
            allPossibleSequences.push(subSequence);
          }
        }
      });
    });
    allPossibleSequences=allPossibleSequences.sort((_a, _b)=>{
      //sort by array length, then by first element value
      if(_a.length > _b.length) {return 1}
      else if(_a.length < _b.length) {return -1}
      else if(_a[0] > _a[1]){return 1}
      else if(_a[0] < _a[1]){return -1}
      return 0;
    }).reduce((_valid_sequences, _sequence)=>{
      //reduce to unqiue sequences, toString() for easy comparison
      let sequenceString=_sequence.toString();
      if(_sequence.length>1 && !_valid_sequences.includes(sequenceString)){
        _valid_sequences.push(sequenceString);
      }
      return _valid_sequences;
    },[]);
    let all_rolled_sequences=this.getSequences().reduce((_all_sequences, _sequence_object)=>{
      for(let sequence of _sequence_object.sequences){
        if(_sequence_object.sequences.length>1){
        }
        _all_sequences.push(sequence.toString());
      }
      return _all_sequences;
    },[]);
    let sequenceMetrics=allPossibleSequences.map((_value)=>{
      let metricsObject={};
      metricsObject.sequence=_value;
      metricsObject.count=all_rolled_sequences.filter((_element)=>{
        return _element==_value;
      }).length;
      metricsObject.ratio=metricsObject.count/this.#iterations;
      return metricsObject;
    });
    return sequenceMetrics;
  };
  /**
   * Core method that iterations through roll results and sends dropValue(index) to Dice object
   * Setting the found index in Dice to undefined
   * 
   * @param {string} _target_drop - the operation to execute (lowest, highest, specific value)
   * @param {string|number} [_drop_count=1] - maximum number of Dice to drop, defaults to 1
   * @param {string|number} _drop_value - the specific value to drop
   * @returns {undefined} - on error
   * 
   * TODO: actually use _drop_count, currently only does the 1st 
   */
  #dropValue (_target_drop, _drop_count, _drop_value) {
    //drops value from all pools according to _target_drop argument (DropLowestValue, DropHighestValue, DropValue)
    //recalculates secondaries
    if(!["dropLowestValue","dropHighestValue","dropValue","dropValueAbove","dropValueBelow","dropEven","dropOdd"].includes(_target_drop)) {
      // already at 1 Dice in Pool, error
      console.error("pool-class.js: "+_target_drop+"() is not a valid method.");
      return undefined;
    } else if(this.#fullRollResults.length===1) {
      //not a valid action
      console.error("pool-class.js: "+_target_drop+"(), already at 1 Dice in Pool.");
      return undefined;
    }
    let drop_count = _drop_count===undefined || !isNumeric(_drop_count) ? 1 : +_drop_count ;
    for(let iteration=0;iteration<this.#iterations;iteration++) {
      let target_value=_drop_value;
      let found_dice=[];
      for(let dice=0; dice<=drop_count && dice<this.#fullRollResults.length;dice++){
        let results=this.#fullRollResults[dice].getResults();
        switch(true){
          //abuse JS switch fall-thru to capture target values
          case (target_value === undefined):
          case (_target_drop=="dropLowestValue" && results[iteration].value < target_value):
          case (_target_drop=="dropHighestValue" && results[iteration].value > target_value):
          case (_target_drop=="dropValueAbove" && results[iteration].value > target_value):
          case (_target_drop=="dropValueBelow" && results[iteration].value < target_value):
          case (_target_drop=="dropEven" && results[iteration].value%2 == 0):
          case (_target_drop=="dropOdd" && results[iteration].value%2 == 1):
            if(target_value !== undefined && ["dropLowestValue","dropHighestValue"].includes(_target_drop)){
              found_dice.pop();//remove previously pushed value from this iteration for dropHigh/Low
            }
            target_value=results[iteration].value;
            found_dice.push({iteration:iteration, dice:dice});
            break;
          case (_target_drop=="dropValue" && results[iteration].value == _drop_value):
            found_dice.push({iteration:iteration, dice:dice});
            break;
        }
      }
      found_dice.forEach((_found_dice)=>{
        this.#fullRollResults[_found_dice.dice].dropValueAtIndex(_found_dice.iteration);
      });
    }
    this.#calculatePoolOtherValues();
  };
  /**
   * calls dropValue for dropLowestValue with specified drop count
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropLowestValue (_drop_count) {
    this.#dropValue("dropLowestValue", _drop_count)
  };
  /**
   * calls dropValue for dropHighestValue with specified drop count
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropHighestValue (_drop_count) {
    this.#dropValue("dropHighestValue", _drop_count)
  };
  /**
   * calls dropValue for dropValue with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropValue (_drop_value, _drop_count) {
    //drops first occurance of _drop_value in roll
    if(_drop_value===undefined || !isNumeric(_drop_value)){
      console.warn("pool-class.js: Invalid value passed to dropValue() method.");
    }
    this.#dropValue("dropValue", _drop_count, _drop_value);
  };
  /**
   * calls dropValue for dropValueBelow with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropValueBelow(_drop_value, _drop_count){
    if(_drop_value===undefined || !isNumeric(_drop_value)){
      console.warn("pool-class.js: Invalid value passed to dropValueBelow() method.");
    }
    this.#dropValue("dropValueBelow", _drop_count, _drop_value);
  };
  /**
   * calls dropValue for dropValueAbove with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropValueAbove(_drop_value, _drop_count){
    if(_drop_value===undefined || !isNumeric(_drop_value)){
      console.warn("pool-class.js: Invalid value passed to dropValueAbove() method.");
    }
    this.#dropValue("dropValueAbove", _drop_count, _drop_value);
  };
  /**
   * calls dropValue for dropEven with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropEven(_drop_count){
    this.#dropValue("dropEven", _drop_count);
  };
  /**
   * calls dropValue for dropOdd with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropOdd(_drop_count){
    this.#dropValue("dropOdd", _drop_count);
  };
  /**
   * drops specific index Dice from Pool and re-rolls
   * @param {Number} _dice_index - index of the specified Dice
   * @param {Boolean} _no_pool_reroll - whether to NOT re-roll the pool, defaults to False (do re-roll)
   * @returns {undefined} - if error
   */
  dropDice(_dice_index, _no_pool_reroll) {
    if(!isNumeric(_dice_index) || _dice_index >= this.#fullRollResults.length) {
      console.warn("pool-class.js: Invalid value passed to dropDice() method.");
      return undefined;
    }
    this.#fullRollResults.splice(_dice_index,1);
    if(!_no_pool_reroll){
      this.rollPool();
    } else {
      this.#calculatePoolOtherValues();
    }
  };
  /**
   * calls updateDice and passes arguments to add a dice to pool
   * @param {string|number|Dice} _minimum_value_or_dice - minimum value or Dice object to generate and add, if Array of Dice objects loop and add all
   * @param {string|number} _maximum_value - maximum value of Dice, required if minimum value is non-Dice object
   * @param {undefined|number|function} [_modifier] - modifier to roll
   */
  addDice(_minimum_value_or_dice, _maximum_value, _modifier) {
    if(Array.isArray(_minimum_value_or_dice)){
      _minimum_value_or_dice.forEach((_dice)=>{
        if(_dice instanceof Dice){
          this.updateDice(undefined, _dice);
        }
      });
    } else {
      this.updateDice(undefined, _minimum_value_or_dice, _maximum_value, _modifier);
    }
  };
  /**
   * Updates Dice array with provide data, including adding dice if _target_dice is not valid
   * @param {*} _target_dice 
   * @param {string|number|Dice} _minimum_value_or_dice - minimum value or Dice object to generate and add
   * @param {string|number} _maximum_value - maximum value of Dice, required if minimum value is non-Dice object
   * @param {undefined|number|function} [_modifier] - modifier to roll
   * @returns {undefined} - on error
   */
  updateDice(_target_dice, _minimum_value_or_dice, _maximum_value, _modifier){
    if(!isNumeric(_minimum_value_or_dice) && !_minimum_value_or_dice instanceof Dice) {
      console.warn("pool-class.js: Invalid minimum value passed to updateDice() method.");
      return undefined;
    }
    if(!isNumeric(_minimum_value_or_dice) && !_minimum_value_or_dice instanceof Dice) {
      console.error("pool-class.js: Invalid maximum value passed to updateDice() method.");
      return undefined
    }
    if(_minimum_value_or_dice instanceof Dice){
      this.#fullRollResults.push(_minimum_value_or_dice);
      this.#calculateSecondaryValues();
      this.#calculateSequences();
      this.#calculateSets();
      return;
    }
    let target_dice;
    if(_target_dice!==undefined && isNumeric(_target_dice) && _target_dice<this.#fullRollResults.length){
      this.#fullRollResults[_target_dice]=new Dice(_minimum_value_or_dice, _maximum_value, _modifier);
      target_dice = +_target_dice;
    } else {
      this.#fullRollResults.push(new Dice(_minimum_value_or_dice, _maximum_value, _modifier));
      target_dice = this.#fullRollResults.length-1;
    }
    this.#fullRollResults[target_dice].roll(this.#iterations);
    this.#calculateSecondaryValues();
    this.#calculateSequences();
    this.#calculateSets();
  };
  /**
   * re-rolls the Dice object at the specified index
   * @param {Number} _dice_index - index of Dice object to re-roll
   * @returns {undefined} - if error
   */
  reRollDice(_dice_index){
    if(!isNumeric(_dice_index) || _dice_index>=this.#fullRollResults.length) {
      console.warn("pool-class.js: Invalid value passed to reRollDice() method.");
      return undefined;
    }
    this.#fullRollResults[_dice_index].roll(this.#iterations);
    this.#calculateSecondaryValues();
    this.#calculateSequences();
    this.#calculateSets();
  };
  /**
   * add additional Dice to the roll if a value occurs in the results
   * @param {string|number} [_value_to_explode_on="max"] - value that triggers adding dice, 'max', 'min', or specific value 
   * @param {string|number} _explode_limit - limit to how many additional Dice can be added
   * @param {Dice} _additional_dice - Dice object that will be cloned and added
   * @returns {undefined} - on error
   */
  explodeValue(_value_to_explode_on, _explode_limit, _additional_dice) {
    //loop over each Dice object, calling explodeValue on each.
    //append new Dice arrays to this.#fullRollResults
    //recalc secondaries, etc
    if(![undefined,"max","min"].includes(_value_to_explode_on) && !isNumeric(_value_to_explode_on)){
      console.error("pool-class.js: Invalid ExplodingValue passed to explodeValue() method.; must be blank; 'max', 'min' or a number.");
      return undefined;
    }
    if(_explode_limit!==undefined && !isNumeric(_explode_limit)) {
      console.error("pool-class.js: Invalid ExplodeLimit passed to explodeValue() method; must be a number.");
      return undefined;
    }
    if(_additional_dice!==undefined && !(_additional_dice instanceof Dice)) {
      console.error("pool-class.js: Invalid AdditionalDice passed to explodeValue() method; must be a Dice object.");
      return undefined;
    }
    let pool_explosion_results=[];
    this.#fullRollResults.forEach((_dice, _index)=>{
      let exploded_dice=_dice.explodeValue(_value_to_explode_on, _explode_limit, _additional_dice);
      exploded_dice.forEach((_exploded_dice)=>{
        _exploded_dice.setAdditionalText("#"+(_index+1)+" Explode");
      });
      pool_explosion_results=[...pool_explosion_results,...exploded_dice];
    });
    pool_explosion_results.forEach((_new_dice)=>{
      this.addDice(_new_dice);
    });
    this.#calculateSecondaryValues();
    this.#calculateSequences();
    this.#calculateSets();
  };

  filterOutLowestDice(){
    return this.#rollResults.reduce((_filtered_result, _roll_result)=>{
      let result={index:_roll_result.index};
      result.roll;
       //{index:0, roll:[]}
    },[]);
  };
  /**
   * filterOutLowestDice
   * filterToLowestDice
   * filterOutHighestDice
   * filterToHighestDice
   * filterOutValue
   * filterToValue
   * filterOutValueAbove
   * filterToValueAbove
   * filterOutValueBelow
   * filterToValueBelow
   * filterToEven
   * filterToOdd
   * 
   * 
   * getMin ... ?
   * getMax ... ?
   *  ... Above, Below, Equal, WithinRange
   * 
   *
   */
};