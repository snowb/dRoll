import { isNumeric } from "./isNumeric.js";
import { Pool } from "./pool-class.js";
import { Metrics_Dice } from "./metrics-dice-class.js";
import { Dice } from "./dice-class.js";
/**
 * Pool object an Array of Metrics_Dice objects and an optional iterations counts 
 * Generates and calls .roll() on the provided Metrics_Dice objects and stores the results
 * Generate secondary and metrics results from parent Pool class
 * @typedef {Object} Metrics_Pool - The Metrics_Pool object
 * @property {Metrics_Dice[]} dice_metrics - Contains metrics from each Metrics_Dice object
 * @property {Number} max_dice - The highest Dice value
 * @property {Number} min_dice - The lowest Dice value
 * @property {Object} secondaryResults - Contains secondary metrics calculations
 * @property {Object} groupResults - contains sets, sequences, and metrics for both
 * @property {Object[]} workingResults - Contains working results from any runn operations
 */
export class Metrics_Pool extends Pool {
  #dice_metrics=[];
  #dice_count=0;
  #max_dice=null;
  #min_dice=null;
  #secondaryMetrics={
    dice_mean:[],
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

  #workingResults = [];

  constructor(_dice_objects_array, _iterations){
    if(Array.isArray(_dice_objects_array)){
      let reduced_metrics_dice_array = _dice_objects_array.reduce((_reduced_array, _element)=>{
        if(_element instanceof Dice){
          _reduced_array.push(new Metrics_Dice(_element.getMinimum(), _element.getMaximum(), _element.getModifierFunction()));
        } else if(_element instanceof Metrics_Dice) {
          _reduced_array.push(_element);
        }
        return _reduced_array;
      },[]);
      if(reduced_metrics_dice_array.length < _dice_objects_array.length){
        console.warn("metrics-pool-class.js: Not all objects passed were Dice/Metrics_Dice objects, reducing to valid Metrics_Dice objects.");
      }
      super(reduced_metrics_dice_array, _iterations);
      this.#dice_count=reduced_metrics_dice_array.length;
      //this.rollPool();
    }
    else {
      super(_dice_objects_array, _iterations)
    }
  };
  /**
   * return the highest or lowest value from all of the provided Dice/Metrics_Dice
   * @param {string} _target - "max" (default) or "min" to calculate
   * @returns {number} - min or max value
   */
  #calculateMinMaxDice(_target){
    let initial_value = _target=="min" ? Infinity : -Infinity
    return this.getFullRollResults().reduce((_target_dice, _metrics_dice)=>{
      let dice_metric_minmax;
      if(_target=="min"){
        dice_metric_minmax = _metrics_dice.getMinimum();
        if(dice_metric_minmax < _target_dice){
          return dice_metric_minmax;
        }
      } else {
        dice_metric_minmax = _metrics_dice.getMaximum();
        if(dice_metric_minmax > _target_dice){
          return dice_metric_minmax;
        }
      }
      return _target_dice;
    },initial_value);
  };
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
  };
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
   * 
   * @param {number} _index - 
   * @returns {Object} - Metrics_Dice.getMetrics() object
   */
  getDiceMetrics(_index){
    if(this.#dice_metrics.length==0){return undefined;}
    if(_index===undefined || !isNumeric(_index)){
      return this.#dice_metrics;
    }
    return this.#dice_metrics[_index];
  }
  /**
   * @returns {number} - length/size of pool
   */
  getPoolSize(){
    return this.#dice_count;
  };
  /**
   * rolls all Dice in the Pool, calculates secondary values
   */
  rollPool () {
    super.rollPool();
    this.#max_dice=this.#calculateMinMaxDice("max");
    this.#min_dice=this.#calculateMinMaxDice("min");
    this.#updateDiceMetrics();
    let metrics=this.getMetrics();
    let metrics_secondaries = this.#calculateMetricSecondaries(metrics.pool_metrics, this.getIterations());
    this.#secondaryMetrics.pool_median = metrics_secondaries.median;
    this.#secondaryMetrics.pool_mean = metrics_secondaries.mean;
    this.#secondaryMetrics.pool_mode = metrics_secondaries.mode;
    this.#calculateSequences();
    this.#calculateSets();
  };
  /**
   * @returns {Number} - number of dice in pool
   */
  getDiceCount(){
    return this.#dice_count;
  };
  /**
   * @returns {Number} - Highest dice value in pool
   */
  getMaxDiceValue(){
    return this.#max_dice;
  };
  /**
   * @returns {Number} - Lowest dice value in pool
   */
  getMinDiceValue(){
    return this.#min_dice;
  };
  /**
   * 
   * @param {'even'|'modified_even'|'odd'|'modified_odd'|'equal'|'modified_equal'|'above'|'modified_above'|'below'|'modified_below'|'range'|'modified_range'|'highest'|'lowest'} _filter_type - which filtered array to get metrics on (Even, Odd, Equal, etc)
   * @param {Number|String} _target_value - Numeric, the comparison value for Equal, Above, Below
   * @param {'pool'|'dice'} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH target Dice or only the Pool Value OF target Dice.
   * @returns {object} - Metrics object {pool_metrics: Array, median: Number, mode: Number, mean: Number}
   */
  #getFilterMetrics(_filter_type, _first_target_value, _second_target_value, _result_target){
    let metrics={pool_metrics:[]};
    let filtered_array=undefined;
    switch(_filter_type){
      case "even":
        filtered_array=this.getEven();
        break;
      case "modified_even":            //modified_results would have to "pool" type, only has 1 value, unneeded reducer
        filtered_array=this.getModifiedEven();
        break;
      case "odd":
        filtered_array=this.getOdd();
        break;
      case "modified_odd":            
        filtered_array=this.getModifiedOdd();
        break;
      case "equal":
        filtered_array=this.getEqual(_first_target_value);
        break;
      case "modified_equal":
        filtered_array=this.getModifiedEqual(_first_target_value);
        break;
      case "above":
        filtered_array=this.getAbove(_first_target_value);
        break;
      case "modified_above":
        filtered_array=this.getModifiedAbove(_first_target_value);
        break;
      case "below":
        filtered_array=this.getBelow(_first_target_value);
        break;
      case "modified_below":
        filtered_array=this.getModifiedBelow(_first_target_value);
        break;
      case "range":
        filtered_array=this.getWithinRange(_first_target_value,_second_target_value);
        break;
      case "modified_range":
        filtered_array=this.getModifiedWithinRange(_first_target_value,_second_target_value);
        break;
      case "highest":
      case "lowest":
        filtered_array=this.getRollResults();
        break;
    }
    this.#workingResults=filtered_array.reduce((_pool_array, _pool_object)=>{
      let new_pool_object={
        index:undefined, 
        values:undefined,
        result:undefined
      };
      new_pool_object.index=_pool_object.index;
      if(_result_target!="dice"){
        new_pool_object.values=_pool_object.values;
        if(_pool_object.values.length == 1){
          new_pool_object.result = _pool_object.values[0];
        } else {
          new_pool_object.result=_pool_object.values.reduce((_result, _value)=>{
            return _result + _value;
          },0);
        }
      } else {
        switch(_filter_type){
          case "even":
            new_pool_object.values=_pool_object.values.filter((_value)=>{return _value%2==0});
            break;
          case "odd":
            new_pool_object.values=_pool_object.values.filter((_value)=>{return _value%2==1});
            break;
          case "equal":
            if(Array.isArray(_first_target_value)){
              new_pool_object.values=_pool_object.values.filter((_value)=>{return _first_target_value.includes(_value)});
            } else {
              new_pool_object.values=_pool_object.values.filter((_value)=>{return _value==_first_target_value});
            }
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
          case "highest":
            let start_index=_pool_object.roll.length - _first_target_value - 1;
            new_pool_object.values=_pool_object.roll.filter((_roll, _index)=>{return _index > start_index});
            break;
          case "lowest":
            new_pool_object.values=_pool_object.roll.filter((_roll, _index)=>{return _index < _first_target_value});
            break;
        }
        new_pool_object.result=new_pool_object.values.reduce((_result, _value)=>{
          return _result+_value;
        },0);
      }
      _pool_array.push(new_pool_object);
      return _pool_array;
    },[]);

    let associative_array = {};
    metrics.mean=this.#workingResults.reduce((_sum, _object)=>{
      if(associative_array[_object.result]===undefined){
        associative_array[_object.result] = 1;
      } else {
        associative_array[_object.result] += 1;
      }
      return (_sum+_object.result);
    },0) / this.getIterations();

    for(let _value in associative_array){
      let count = associative_array[_value];
      metrics.pool_metrics.push({
        value:+_value, 
        count:count, 
        ratio:count/this.getIterations()
      });
    }
    metrics.pool_metrics.sort((_a, _b)=>{return _a.value < _b.value ? -1 : 1;});
  
    metrics.pool_metrics=metrics.pool_metrics.filter((_metrics_object)=>{return _metrics_object.count>0});
    //maybe use the zero-count-cleared array for secondaries but still include full array?
    let metrics_secondaries=this.#calculateMetricSecondaries(metrics.pool_metrics, filtered_array.length);
    metrics.median=metrics_secondaries.median;
    metrics.mean=metrics_secondaries.mean;
    metrics.mode=metrics_secondaries.mode;
    return metrics;
  }
  
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
   * Return metrics for the given filter from the modifiedResults.results data
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getModifiedEvenMetrics(){
    return this.#getFilterMetrics("modified_even", undefined, undefined, undefined); 
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
   * Return metrics for the given filter from the modifiedResults.results data
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getModifiedOddMetrics(){
    return this.#getFilterMetrics("modified_odd", undefined, undefined, undefined); 
  };
  /**
   * Updates the dice_metrics private property based on current Pool
   */
  #updateDiceMetrics(){
    this.#dice_metrics=this.getFullRollResults().reduce((_dice_metrics, _dice)=>{
      _dice_metrics.push(_dice.getMetrics());
      return _dice_metrics;
    },[]);
  };
  /**
   * calculates mean, median, and mode of a provided {value, count} Array
   * @param {Object[]} _counts_values_object - array of objects of form {value, count}
   * @returns {Object} - of form {mean:Number, median:Number, mode:Number}
   */
  #calculateMetricSecondaries(_counts_values_object, _filter_array_length){
    let metrics_secondaries={};
    this.#updateDiceMetrics();
    let intermediate_mean = _counts_values_object.reduce((_pool_total, _metric)=>{
      _pool_total.total_value+=_metric.value*_metric.count;
      _pool_total.total_count+=_metric.count;
      return _pool_total;
    },{total_value:0, total_count:0});
    metrics_secondaries.mean = intermediate_mean.total_value / intermediate_mean.total_count;

    metrics_secondaries.median=undefined;
    let target_median_location=Math.floor(_filter_array_length/2) - 1;
    let median_cheat = _counts_values_object.reduce((_current_location, _object)=>{
      if(_current_location>=target_median_location && metrics_secondaries.median===undefined){
        metrics_secondaries.median=_object.value;
      }
      return _current_location+_object.count;
    },0);

    metrics_secondaries.mode=_counts_values_object.reduce((_mode_object, _metric_object)=>{
      if(_metric_object.count >= _mode_object.count){
        return _metric_object;
      }
      return _mode_object;
    },{count:0}).value;
    return metrics_secondaries;
  }
  
  /**
   * Return metrics for the given filter
   * @param {string|number} _value - numeric for value to compare
   * @param {String} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH Above Dice or only the Pool Value OF Above Dice.
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getAboveMetrics(_value, _result_target){
    if(!isNumeric(_value)){console.error("metrics-pool-class.js: getAboveMetrics requires a number for _value.");return undefined;}
    return this.#getFilterMetrics("above", +_value, undefined, _result_target);
  };
  /**
   * Return metrics for the given filter from the modified_results.result data
   * @param {string|number} _value - numeric for value to compare
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getModifiedAboveMetrics(_value){
    if(!isNumeric(_value)){console.error("metrics-pool-class.js: getModifiedAboveMetrics requires a number for _value.");return undefined;}
    return this.#getFilterMetrics("modified_above", +_value, undefined, undefined);
  };
  /**
   * Return metrics for the given filter
   * @param {string|number} _value - numeric for value to compare
   * @param {String} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH Below Dice or only the Pool Value OF Below Dice.
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getBelowMetrics(_value, _result_target){
    if(!isNumeric(_value)){console.error("metrics-pool-class.js: getBelowMetrics requires a number for _value.");return undefined;}
    return this.#getFilterMetrics("below", +_value, undefined, _result_target);
  };
  /**
   * Return metrics for the given filter from the modified_results.result data
   * @param {string|number} _value - numeric for value to compare
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getModifiedBelowMetrics(_value){
    if(!isNumeric(_value)){console.error("metrics-pool-class.js: getModifiedBelowMetrics requires a number for _value.");return undefined;}
    return this.#getFilterMetrics("modified_below", +_value, undefined, undefined);
  };
  #cleanNumericInput(_value){
    switch(true){
      case isNumeric(_value):
        return +_value;
      case Array.isArray(_value):
        return _value.filter((_val)=>{return isNumeric(_val)}).map((_val)=>{return +_val});
    }
    return undefined;
  };
  /**
   * Return metrics for the given filter
   * @param {string|number} _value - numeric for value to compare
   * @param {String} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH Below Dice or only the Pool Value OF Below Dice.
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getEqualMetrics(_value, _result_target){
    let cleaned_value = this.#cleanNumericInput(_value);
    if(cleaned_value===undefined){
      console.error("metrics-pool-class.js: getEqualMetrics requires a number or array of numbers for _value.");
      return undefined;
    }
    return this.#getFilterMetrics("equal", cleaned_value, undefined, _result_target);
  };
  /**
   * Return metrics for the given filter from the modified_results.result data
   * @param {string|number} _value - numeric for value to compare
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getModifiedEqualMetrics(_value){
    let cleaned_value = this.#cleanNumericInput(_value);
    if(cleaned_value===undefined){
      console.error("metrics-pool-class.js: getModifiedEqualMetrics requires a number or array of numbers for _value.");
      return undefined;
    }
    return this.#getFilterMetrics("modified_equal", cleaned_value, undefined, undefined);
  };
  /**
   * Return metrics for the given filter
   * @param {string|number} _value - numeric for value to compare
   * @param {String} _result_target - "pool" (default) or "dice", 
   *                                   whether to return the Pool Value WITH Below Dice or only the Pool Value OF Below Dice.
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getWithinRangeMetrics(_min_value, _max_value, _result_target){
    if(!isNumeric(_min_value) || !isNumeric(_max_value)){console.error("metrics-pool-class.js: getWithinRangeMetrics requires a number for Minimum and Maximum values.");return undefined;}
    return this.#getFilterMetrics("range", +_min_value, +_max_value, _result_target);
  };
  /**
   * Return metrics for the given filter from the modified_results.result data
   * @param {string|number} _value - numeric for value to compare
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getModifiedWithinRangeMetrics(_min_value, _max_value){
    if(!isNumeric(_min_value) || !isNumeric(_max_value)){console.error("metrics-pool-class.js: getModifiedWithinRangeMetrics requires a number for Minimum and Maximum values.");return undefined;}
    return this.#getFilterMetrics("modified_range", +_min_value, +_max_value, undefined);
  };
  /**
   * Returns _dice_count number of lowest results in the pool
   * @param {Number|String} _dice_count - how many of the 'lowest' dice to return
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getLowestMetrics(_dice_count){
    if(_dice_count!==undefined && (!isNumeric(_dice_count) || _dice_count >= this.#dice_count)){
      console.error("metrics-pool-class.js: getLowestMetric argument must be Numeric and less than the number of Dice.");
      return undefined;
    }
    let dice_count = _dice_count===undefined ? 1 : +_dice_count
    return this.#getFilterMetrics("lowest", dice_count, undefined, "dice");
  };
  /**
   * Returns _dice_count number of highest results in the pool
   * @param {Number|String} _dice_count - how many of the 'highest' dice to return
   * @returns {Object[]} - array of objects of form {value:Number, count:Number, ratio:Number}
   */
  getHighestMetrics(_dice_count){
    if(_dice_count!==undefined && (!isNumeric(_dice_count) || _dice_count >= this.#dice_count)){
      console.error("metrics-pool-class.js: getHighestMetrics argument must be Numeric and less than the number of Dice.");
      return undefined;
    }
    let dice_count = _dice_count===undefined ? 1 : +_dice_count
    return this.#getFilterMetrics("highest", dice_count, undefined, "dice");
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
   * @param {'sets'|'sequences'} _target_group - target group to calculate, Sets or Sequences
   * @returns {Object[]} - [{index:number, [sets|sequences]:Array[ number[] ]}]
   */
  #getGroups(_target_group){
    //returns group, either sets of matching numbers of sequences
    return this.getRollResults().reduce((_results, _roll)=>{
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
          console.error("metrics-pool-class.js: Invalid group type passed to getSequences()/getSets().")
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
   * @param {'getSetsOfValue'|'getSetsOfLength'|'getSequencesWithValue'|'getSequencesOfLength'} _property - operation to execute
   * @param {string} _target_group - which group to get, Sets or Sequences
   * @param {string|number} _value - value to match to
   * @returns {Object[]} - [{index:number, [set|sequences]:Array[ number[] ]}] 
   */
  #getGroupByProperty(_property, _target_group, _value){
    if(!isNumeric(_value)){console.error("metrics-pool-class.js: "+_property+" requires a number for input.");return undefined;}
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
    return this.getModifiedMetrics();
  };
  getModifiedMetrics(){
    let metrics={};
    metrics.minimum_value=this.getModifiedMinimum();
    metrics.maximum_value=this.getModifiedMaximum();
    metrics.pool_metrics=[];

    let associative_array = {};
    metrics.mean=this.getModifiedResults().reduce((_sum, _value)=>{
      if(associative_array[_value]===undefined){
        associative_array[_value] = 1;
      } else {
        associative_array[_value] += 1;
      }
      return (_sum+_value);
    },0) / this.getIterations();

    for(let _value in associative_array){
      let count = associative_array[_value];
      metrics.pool_metrics.push({
        value:+_value, 
        count:count, 
        ratio:count/this.getIterations()
      });
    }
    metrics.pool_metrics.sort((_a, _b)=>{return _a.value < _b.value ? -1 : 1;});
      
    metrics.median=undefined;
    let target_median_location=Math.floor(this.getIterations()/2) - 1;
    let median_cheat = metrics.pool_metrics.reduce((_current_location, _object)=>{
      if(_current_location>=target_median_location && metrics.median===undefined){
        metrics.median=_object.value;
      }
      return _current_location+_object.count;
    },0);

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
    return this.getFullRollResults().reduce((_all_values, _dice)=>{
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
    if(this.#dice_count<2) {
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
      for(let _set_length=2; _set_length<=this.#dice_count; _set_length++){
        //filter by set length, count, calculate metric
        let set_count=setsOfValue.filter((_element)=>{return _element.sets[0].length==_set_length}).length;
        let set_metrics={set:Array(_set_length).fill(+_valueOfSet),
          count: set_count, ratio: (set_count/this.getIterations())
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
    if(this.#dice_count<2) {
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
      metricsObject.ratio=metricsObject.count/this.getIterations();
      return metricsObject;
    });
    return sequenceMetrics;
  };
  /**
   * calls dropValue for dropLowestValue with specified drop count
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropLowestValue (_drop_count) {
    if(_drop_count!==undefined && !isNumeric(_drop_count) || _drop_count > this.#dice_count){
      console.error("metrics-pool-class.js: dropLowestValue requires a Drop Count that is less than the number of Dice.");
      return undefined;
    }
    super.dropLowestValue(_drop_count);
    this.#dice_count-=_drop_count;
  };
  /**
   * calls dropValue for dropHighestValue with specified drop count
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropHighestValue (_drop_count) {
    if(!isNumeric(_drop_count) || _drop_count > this.#dice_count){
      console.error("metrics-pool-class.js: dropHighestValue requires a Drop Count that is less than the number of Dice.");
      return undefined;
    }
    super.dropHighestValue(_drop_count);
    this.#dice_count-=_drop_count;
  };
  /**
   * calls dropValue for dropValue with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropValue (_drop_value, _drop_count) {
    //drops first occurance of _drop_value in roll
    if(!isNumeric(_dropValue)){
      console.error("metrics-pool-class.js: dropValue requires a number as a value to drop.");
      return undefined;
    }
    if(!isNumeric(_drop_count) || _drop_count > this.#dice_count){
      console.error("metrics-pool-class.js: dropValue requires a Drop Count that is less than the number of Dice.");
      return undefined;
    }
    super.dropValue(_drop_count);
    this.#dice_count-=_drop_count;
  };
  /**
   * calls dropValue for dropValueBelow with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropValueBelow(_drop_value, _drop_count){
    if(!isNumeric(_dropValue)){
      console.error("metrics-pool-class.js: dropValueBelow requires a number as a value to drop.");
      return undefined;
    }
    if(!isNumeric(_drop_count) || _drop_count > this.#dice_count){
      console.error("metrics-pool-class.js: dropValueBelow requires a Drop Count that is less than the number of Dice.");
      return undefined;
    }
    super.dropValueBelow(_drop_count);
    this.#dice_count-=_drop_count;
  };
  /**
   * calls dropValue for dropValueAbove with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropValueAbove(_drop_value, _drop_count){
    if(!isNumeric(_dropValue)){
      console.error("metrics-pool-class.js: dropValueAbove requires a number as a value to drop.");
      return undefined;
    }
    if(!isNumeric(_drop_count) || _drop_count > this.#dice_count){
      console.error("metrics-pool-class.js: dropValueAbove requires a Drop Count that is less than the number of Dice.");
      return undefined;
    }
    super.dropValueAbove(_drop_count);
    this.#dice_count-=_drop_count;
  };
  /**
   * calls dropValue for dropEven with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropEven(_drop_count){
    if(!isNumeric(_drop_count) || _drop_count > this.#dice_count){
      console.error("metrics-pool-class.js: dropEven requires a Drop Count that is less than the number of Dice.");
      return undefined;
    }
    super.dropEven(_drop_count);
    this.#dice_count-=_drop_count;
  };
  /**
   * calls dropValue for dropOdd with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropOdd(_drop_count){
    if(!isNumeric(_drop_count) || _drop_count > this.#dice_count){
      console.error("metrics-pool-class.js: dropOdd requires a Drop Count that is less than the number of Dice.");
      return undefined;
    }
    super.dropOdd(_drop_count);
    this.#dice_count-=_drop_count;
  };
  /**
   * drops specific index Dice from Pool and re-rolls
   * @param {Number} _dice_index - index of the specified Dice
   * @param {Boolean} _no_pool_reroll - whether to NOT re-roll the pool, defaults to False (do re-roll)
   * @returns {undefined} - if error
   */
  dropDice(_dice_index, _no_pool_reroll) {
    if(!isNumeric(_dice_index) || _dice_index >= this.#dice_count) {
      console.warn("metics-pool-class.js: Invalid value passed to dropDice() method.");
      return undefined;
    }
    super.dropDice(_dice_index, _no_pool_reroll);
    this.#dice_count-=1;
    if(_no_pool_reroll){
      let metrics_secondaries=this.#calculateMetricSecondaries(this.getMetrics().pool_metrics, this.getIterations());
      this.#secondaryMetrics.pool_mean = metrics_secondaries.mean;
      this.#secondaryMetrics.pool_median = metrics_secondaries.median;
      this.#secondaryMetrics.pool_mode = metrics_secondaries.mode;
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
        _dice.setIterations(this.getIterations());
        if(_dice instanceof Metrics_Dice) {
          this.updateDice(undefined, _dice);
        } else if(_dice instanceof Dice){
          let to_metrics_dice = new Metrics_Dice(_dice.getMinimum(), _dice.getMaximum(), _dice.getModifierFunction());
          to_metrics_dice.setIterations(this.getIterations());
          to_metrics_dice.updateValues(_dice.getResults());
          to_metrics_dice.setAdditionalText(_dice.getAdditionalText());
          this.updateDice(undefined, to_metrics_dice);
        }
        this.#dice_count++;
      });
    } else if(_minimum_value_or_dice instanceof Metrics_Dice){
      _minimum_value_or_dice.setIterations(this.getIterations());
      this.updateDice(undefined, _minimum_value_or_dice);
    } else {
      this.updateDice(undefined, _minimum_value_or_dice, _maximum_value, _modifier);
      this.#dice_count++;
    }
  };
  /**
   * Updates Dice array with provide data, including adding dice if _target_dice is not valid
   * @param {number} _target_dice - index of Dice to update
   * @param {string|number|Dice} _minimum_value_or_dice - minimum value or Dice object to generate and add
   * @param {string|number} _maximum_value - maximum value of Dice, required if minimum value is non-Dice object
   * @param {undefined|number|function} [_modifier] - modifier to roll
   * @returns {undefined} - on error
   */
  updateDice(_target_dice, _minimum_value_or_dice, _maximum_value, _modifier){
    let new_dice;
    if(_minimum_value_or_dice instanceof Dice && !(_minimum_value_or_dice instanceof Metrics_Dice)){
      new_dice = new Metrics_Dice(_minimum_value_or_dice.getMinimum(), _minimum_value_or_dice.getMaximum(), _minimum_value_or_dice.getModifierFunction());
      new_dice.setIterations(this.getIterations());
      new_dice.setAdditionalText(_minimum_value_or_dice.getAdditionalText());
      super.updateDice(_target_dice, new_dice);
    } else if(_minimum_value_or_dice instanceof Metrics_Dice){
      new_dice=_minimum_value_or_dice;
      new_dice.setIterations(this.getIterations());
      super.updateDice(_target_dice, new_dice);
    } else {
      if(!isNumeric(_minimum_value_or_dice)) {
      console.error("metrics-pool-class.js: Invalid minimum value passed to updateDice() method.");
      return undefined;
      } 
      if(!isNumeric(_maximum_value)) {
        console.error("metrics-pool-class.js: Invalid maximum value passed to updateDice() method.");
        return undefined
      }
      new_dice = new Metrics_Dice(_minimum_value_or_dice, _maximum_value, _modifier);
      new_dice.setIterations(this.getIterations());
      new_dice.roll();
      super.updateDice(_target_dice, new_dice);
    }
    //super.updateDice(_target_dice, _minimum_value_or_dice, _maximum_value, _modifier);
    //super.updateDice(undefined, new_dice);
    
    let metrics_secondaries = this.#calculateMetricSecondaries(this.getMetrics().pool_metrics, this.getIterations());
    this.#secondaryMetrics.pool_mean = metrics_secondaries.mean;
    this.#secondaryMetrics.pool_median = metrics_secondaries.median;
    this.#secondaryMetrics.pool_mode = metrics_secondaries.mode;
    this.#calculateSequences();
    this.#calculateSets();
  };
  /**
   * re-rolls the Dice object at the specified index
   * @param {Number} _dice_index - index of Dice object to re-roll
   * @returns {undefined} - if error
   */
  reRollDice(_dice_index){
    if(!isNumeric(_dice_index) || _dice_index>=this.#dice_count) {
      console.warn("metrics-pool-class.js: Invalid value passed to reRollDice() method.");
      return undefined;
    }
    super.reRollDice(_dice_index);
    let metrics_secondaries = this.#calculateMetricSecondaries(this.getMetrics().pool_metrics, this.getIterations());
    this.#secondaryMetrics.pool_mean = metrics_secondaries.mean;
    this.#secondaryMetrics.pool_median = metrics_secondaries.median;
    this.#secondaryMetrics.pool_mode = metrics_secondaries.mode;
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
      console.error("metrics-pool-class.js: Invalid ExplodingValue passed to explodeValue() method.; must be blank; 'max', 'min' or a number.");
      return undefined;
    }
    if(_explode_limit!==undefined && !isNumeric(_explode_limit)) {
      console.error("metrics-pool-class.js: Invalid ExplodeLimit passed to explodeValue() method; must be a number.");
      return undefined;
    }
    if(_additional_dice!==undefined && !(_additional_dice instanceof Dice || _additional_dice instanceof Metric_Dice)) {
      console.error("metrics-pool-class.js: Invalid AdditionalDice passed to explodeValue() method; must be a Dice object.");
      return undefined;
    }
    let pool_explosion_results=[];
    this.getFullRollResults().forEach((_dice, _index)=>{
      _dice.setIterations(this.getIterations());
      let exploded_dice=_dice.explodeValue(_value_to_explode_on, _explode_limit, _additional_dice);     
      pool_explosion_results=[...pool_explosion_results,...exploded_dice];
    });
    pool_explosion_results=pool_explosion_results.map((_dice, _index)=>{
      let new_dice = new Metrics_Dice(_dice.getMinimum(), _dice.getMaximum(), _dice.getModifierFunction());
      //new_dice.updateValues(_dice.getResults());
      new_dice.setIterations(this.getIterations());
      new_dice.updateValues(_dice.getResults());
      new_dice.setAdditionalText("#"+(_index+1)+" Explode");
      return new_dice;
    });
    this.addDice(pool_explosion_results);
  };
  importPool(_pool){
    if(!(_pool instanceof Pool)){
      console.error("metrics-pool-class.js: importPool requires a Pool object for input.");
      return undefined;
    }
    let new_metrics_dice_array = _pool.getFullRollResults().map((_dice)=>{
      if(_dice instanceof Metrics_Dice){
        return _dice;
      }
      return new Metrics_Dice(_dice.getMinimum(), _dice.getMaximum(), _dice.getModifier());
    });
    let new_metrics_pool = new Metrics_Pool(new_metrics_dice_array);
    new_metrics_pool.setIterations(_pool.getIterations());
    super.importPool(new_metrics_pool);
    this.rollPool();
  };
  /**
   * convert a Pool object into a Metrics_Pool object
   * @param {Pool} _pool 
   */
  convertPool(_pool, _transcribe){
    if(!(_pool instanceof Pool)){
      console.error("metrics-pool-class.js: convertPool requires a Pool object for input.");
      return undefined;
    }
    this.importPool(_pool);
    this.#dice_count=this.getFullRollResults().length;
    if(_transcribe=="transcribe"){
      this.getFullRollResults().forEach((_dice)=>{
        _dice.convertDice(_dice, "transcribe");
      });
      this.#max_dice=this.#calculateMinMaxDice("max");
      this.#min_dice=this.#calculateMinMaxDice("min");
      this.#updateDiceMetrics();
      let metrics=this.getMetrics();
      let metrics_secondaries=this.#calculateMetricSecondaries(metrics.pool_metrics, this.getIterations());
      this.#secondaryMetrics.pool_median=metrics_secondaries.median;
      this.#secondaryMetrics.pool_mean=metrics_secondaries.mean;
      this.#secondaryMetrics.pool_mode=metrics_secondaries.mode;
      this.#calculateSequences();
      this.#calculateSets();
      this.calculateSecondaryValues();
    } else {
      this.rollPool();
    }
  };
};