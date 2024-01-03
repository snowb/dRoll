## Functions

<dl>
<dt><a href="#getRandomInt">getRandomInt(_min, _max)</a> ⇒ <code>Number</code></dt>
<dd><p>Generates a random integer between the provided minimum and maximum values</p>
</dd>
<dt><a href="#isNumeric">isNumeric(_input)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Returns whether the passed value is numeric</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Dice">Dice</a> : <code>Object</code></dt>
<dd><p>Dice object takes in a minimum and maximum number, and optional modifier. 
Generates results between minimum and maximum values (inclusive), modifies values and stores results in results private property.</p>
</dd>
<dt><a href="#Pool">Pool</a> : <code>Object</code></dt>
<dd><p>Pool object an Array of Dice objects and an optional iterations counts 
Generates calls .roll() on the provided Dice objects and stores the results
Generate secondary and abbreviated results as well</p>
</dd>
</dl>

<a name="getRandomInt"></a>

## getRandomInt(_min, _max) ⇒ <code>Number</code>
Generates a random integer between the provided minimum and maximum values

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| _min | <code>Number</code> \| <code>String</code> | minium value |
| _max | <code>Number</code> \| <code>String</code> | maximum value |

<a name="isNumeric"></a>

## isNumeric(_input) ⇒ <code>Boolean</code>
Returns whether the passed value is numeric

**Kind**: global function  
**Returns**: <code>Boolean</code> - - true if numeric, otherwise false  

| Param | Type | Description |
| --- | --- | --- |
| _input | <code>String</code> \| <code>Number</code> | expects a numeric value (String or Number) |

<a name="Dice"></a>

## Dice : <code>Object</code>
Dice object takes in a minimum and maximum number, and optional modifier. Generates results between minimum and maximum values (inclusive), modifies values and stores results in results private property.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| iterations | <code>number</code> | number of iterations |
| results | <code>Array.&lt;Object&gt;</code> | Array of objects containing {index, value} |
| average | <code>number</code> | Average of all numbers generated |
| minimum_value | <code>number</code> | Minimum value passed to Dice constructor |
| maximum_value | <code>number</code> | Maximum value passed to Dice constructor |
| modifer | <code>undefined</code> \| <code>function</code> | modifier function for modifying results |


* [Dice](#Dice) : <code>Object</code>
    * [.Dice](#Dice+Dice)
        * [new exports.Dice([_minimum_value], _maximum_value, _modifier)](#new_Dice+Dice_new)
    * [.getAverage()](#Dice+getAverage) ⇒ <code>number</code>
    * [.roll(_iterations)](#Dice+roll)
    * [.getAbove(_value)](#Dice+getAbove) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getBelow(_value)](#Dice+getBelow) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getEqual(_value)](#Dice+getEqual) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getResults()](#Dice+getResults) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getWithinRange(_min_value, _max_value)](#Dice+getWithinRange) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getAllForValue(_value)](#Dice+getAllForValue) ⇒ <code>Object</code>
    * [.modifyValues(_function)](#Dice+modifyValues)
    * [.modifySingleValue(_value)](#Dice+modifySingleValue) ⇒ <code>number</code>
    * [.getMetrics()](#Dice+getMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.dropValueAtIndex(_index)](#Dice+dropValueAtIndex)
    * [.explodeValue([_value_to_explode_on], [_explode_limit], [_additional_dice])](#Dice+explodeValue) ⇒ [<code>Array.&lt;Dice&gt;</code>](#Dice)

<a name="Dice+Dice"></a>

### dice.Dice
**Kind**: instance class of [<code>Dice</code>](#Dice)  
<a name="new_Dice+Dice_new"></a>

#### new exports.Dice([_minimum_value], _maximum_value, _modifier)
Checks inputs and sets private properties. Does not auto-run roll().


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [_minimum_value] | <code>string</code> \| <code>number</code> | <code>1</code> | minimum number for generating, default 1 |
| _maximum_value | <code>string</code> \| <code>number</code> |  | maximum number for generating, required |
| _modifier | <code>undefined</code> \| <code>number</code> \| <code>function</code> |  | function to modify generating numbers |

<a name="Dice+getAverage"></a>

### dice.getAverage() ⇒ <code>number</code>
Returns the #average private property

**Kind**: instance method of [<code>Dice</code>](#Dice)  
<a name="Dice+roll"></a>

### dice.roll(_iterations)
calculates values between minimum and maximum values, applies modifier for number of provided iterationsstores values in #results

**Kind**: instance method of [<code>Dice</code>](#Dice)  

| Param | Type | Description |
| --- | --- | --- |
| _iterations | <code>string</code> \| <code>number</code> | number of iterations to run |

<a name="Dice+getAbove"></a>

### dice.getAbove(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns all values above the input value

**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - {count: number, values: Object[{index:index, value:value}]}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | value to match |

<a name="Dice+getBelow"></a>

### dice.getBelow(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns all values below the input value

**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - {count: number, values: Object[{index:index, value:value}]}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | value to match |

<a name="Dice+getEqual"></a>

### dice.getEqual(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns all values equal to the input value

**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - {count: number, values: Object[{index:index, value:value}]}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | value to match |

<a name="Dice+getResults"></a>

### dice.getResults() ⇒ <code>Array.&lt;Object&gt;</code>
returns the results Array

**Kind**: instance method of [<code>Dice</code>](#Dice)  
<a name="Dice+getWithinRange"></a>

### dice.getWithinRange(_min_value, _max_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns all values within the to the input range, inclusive

**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - {count: number, values: Object[{index:index, value:value}]}  

| Param | Type | Description |
| --- | --- | --- |
| _min_value | <code>string</code> \| <code>number</code> | starting value to compare |
| _max_value | <code>string</code> \| <code>number</code> | ending value to compare |

<a name="Dice+getAllForValue"></a>

### dice.getAllForValue(_value) ⇒ <code>Object</code>
runs all getAbove/Below/Equal/etc functionsreturns all generated resultsalso returns the private properties of average and results

**Kind**: instance method of [<code>Dice</code>](#Dice)  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | value to match |

<a name="Dice+modifyValues"></a>

### dice.modifyValues(_function)
modifies all values within #results private property, updates #averge private property

**Kind**: instance method of [<code>Dice</code>](#Dice)  

| Param | Type | Description |
| --- | --- | --- |
| _function | <code>function</code> | function to modify generated values |

<a name="Dice+modifySingleValue"></a>

### dice.modifySingleValue(_value) ⇒ <code>number</code>
modifies a single value using the #modifier private property

**Kind**: instance method of [<code>Dice</code>](#Dice)  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | value to modified |

<a name="Dice+getMetrics"></a>

### dice.getMetrics() ⇒ <code>Array.&lt;Object&gt;</code>
generates output of all possible modified values,then counts how many actual occurances of that value,and provides ratio

**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{value:{number}, count:{number}, ratio:{number}}]  
<a name="Dice+dropValueAtIndex"></a>

### dice.dropValueAtIndex(_index)
sets the value at the specified index to undefined

**Kind**: instance method of [<code>Dice</code>](#Dice)  

| Param | Type | Description |
| --- | --- | --- |
| _index | <code>string</code> \| <code>number</code> | index of value to undefine |

<a name="Dice+explodeValue"></a>

### dice.explodeValue([_value_to_explode_on], [_explode_limit], [_additional_dice]) ⇒ [<code>Array.&lt;Dice&gt;</code>](#Dice)
**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: [<code>Array.&lt;Dice&gt;</code>](#Dice) - - returns an array of Dice objects  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [_value_to_explode_on] | <code>undefined</code> \| <code>string</code> \| <code>number</code> | <code>&quot;max&quot;</code> | the value trigger additional Dice, defaults to "max" which is the maximum value a Dice object can generate |
| [_explode_limit] | <code>undefined</code> \| <code>string</code> \| <code>number</code> | <code>1</code> | the maximum number of additional Dice |
| [_additional_dice] | [<code>Dice</code>](#Dice) | <code>this</code> | the specific Dice to use, defaults to this/self |

<a name="Pool"></a>

## Pool : <code>Object</code>
Pool object an Array of Dice objects and an optional iterations counts Generates calls .roll() on the provided Dice objects and stores the resultsGenerate secondary and abbreviated results as well

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| iterations | <code>number</code> | number of iterations |
| fullRollResults | <code>Array.&lt;Object&gt;</code> | Array of objects containing Dice objects |
| rollResults | <code>Array.&lt;Object&gt;</code> | Array of objects containing abbreviated data [{index:number, roll:number[]}] |
| secondaryResults | <code>Object</code> | Contains sum, average, min, and max values for all roll |
| groupResults | <code>Object</code> | contains sets, sequences, and metrics for both |


* [Pool](#Pool) : <code>Object</code>
    * [.Pool](#Pool+Pool)
        * [new exports.Pool(_dice_objects_array, [_iterations])](#new_Pool+Pool_new)
    * [.getIterations()](#Pool+getIterations) ⇒ <code>number</code>
    * [.setIterations(_iterations)](#Pool+setIterations)
    * [.getFullRollResults()](#Pool+getFullRollResults) ⇒ [<code>Array.&lt;Dice&gt;</code>](#Dice)
    * [.getRollResults()](#Pool+getRollResults) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumRolled()](#Pool+getSumRolled) ⇒ <code>Array.&lt;number&gt;</code>
    * [.getAverageRolled()](#Pool+getAverageRolled) ⇒ <code>Array.&lt;number&gt;</code>
    * [.getMinRolled()](#Pool+getMinRolled) ⇒ <code>Array.&lt;number&gt;</code>
    * [.getMaxRolled()](#Pool+getMaxRolled) ⇒ <code>Array.&lt;number&gt;</code>
    * [.getTotalSequencesCount()](#Pool+getTotalSequencesCount) ⇒ <code>number</code>
    * [.getTotalRollsWithSequences()](#Pool+getTotalRollsWithSequences) ⇒ <code>number</code>
    * [.getTotalSetsCount()](#Pool+getTotalSetsCount) ⇒ <code>number</code>
    * [.getTotalRollsWithSets()](#Pool+getTotalRollsWithSets) ⇒ <code>number</code>
    * [.rollPool()](#Pool+rollPool)
    * [.getAbove(_value)](#Pool+getAbove) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getBelow(_value)](#Pool+getBelow) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getEqual(_value)](#Pool+getEqual) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getWithinRange(_min_value, _max_value)](#Pool+getWithinRange) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumAbove(_value)](#Pool+getSumAbove) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumBelow(_value)](#Pool+getSumBelow) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumEqual(_value)](#Pool+getSumEqual) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumWithinRange(_min_value, _max_value)](#Pool+getSumWithinRange) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSequences()](#Pool+getSequences) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSets()](#Pool+getSets) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSetsOfValue(_value)](#Pool+getSetsOfValue) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSetsOfLength(_length)](#Pool+getSetsOfLength) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSequencesWithValue(_value)](#Pool+getSequencesWithValue) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSequencesOfLength(_length)](#Pool+getSequencesOfLength) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getMetrics()](#Pool+getMetrics) ⇒ <code>Object</code>
    * [.getSetMetrics()](#Pool+getSetMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSequenceMetrics()](#Pool+getSequenceMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.dropLowestValue(_drop_count)](#Pool+dropLowestValue)
    * [.dropHighestValue(_drop_count)](#Pool+dropHighestValue)
    * [.dropValue(_drop_value, _drop_count)](#Pool+dropValue)
    * [.dropDice(_dice_index)](#Pool+dropDice) ⇒ <code>undefined</code>
    * [.addDice(_minimum_value_or_dice, _maximum_value, [_modifier])](#Pool+addDice)
    * [.updateDice(_target_dice, _minimum_value_or_dice, _maximum_value, [_modifier])](#Pool+updateDice) ⇒ <code>undefined</code>
    * [.reRollDice(_dice_index)](#Pool+reRollDice) ⇒ <code>undefined</code>
    * [.explodeValue([_value_to_explode_on], _explode_limit, _additional_dice)](#Pool+explodeValue) ⇒ <code>undefined</code>

<a name="Pool+Pool"></a>

### pool.Pool
**Kind**: instance class of [<code>Pool</code>](#Pool)  
<a name="new_Pool+Pool_new"></a>

#### new exports.Pool(_dice_objects_array, [_iterations])
Populates private properties and rolls the Dice object provided


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| _dice_objects_array | [<code>Array.&lt;Dice&gt;</code>](#Dice) |  | array of Dice objects to roll and generate data |
| [_iterations] | <code>string</code> \| <code>number</code> | <code>&quot;10_000&quot;</code> | number of iterations to roll |

<a name="Pool+getIterations"></a>

### pool.getIterations() ⇒ <code>number</code>
returns iterations value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>number</code> - - pool's iterations  
<a name="Pool+setIterations"></a>

### pool.setIterations(_iterations)
update iterations and re-roll;

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type |
| --- | --- |
| _iterations | <code>number</code> | 

<a name="Pool+getFullRollResults"></a>

### pool.getFullRollResults() ⇒ [<code>Array.&lt;Dice&gt;</code>](#Dice)
return #fullRollResults private property

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getRollResults"></a>

### pool.getRollResults() ⇒ <code>Array.&lt;Object&gt;</code>
return #rollResults private property

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, roll:number[]}]  
<a name="Pool+getSumRolled"></a>

### pool.getSumRolled() ⇒ <code>Array.&lt;number&gt;</code>
return sum from #secondaryResults

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getAverageRolled"></a>

### pool.getAverageRolled() ⇒ <code>Array.&lt;number&gt;</code>
return average from #secondaryResults

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getMinRolled"></a>

### pool.getMinRolled() ⇒ <code>Array.&lt;number&gt;</code>
return min from #secondaryResults

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getMaxRolled"></a>

### pool.getMaxRolled() ⇒ <code>Array.&lt;number&gt;</code>
return max from #secondaryResults

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getTotalSequencesCount"></a>

### pool.getTotalSequencesCount() ⇒ <code>number</code>
return total number of sequences

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getTotalRollsWithSequences"></a>

### pool.getTotalRollsWithSequences() ⇒ <code>number</code>
return total number of rolls with sequences

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getTotalSetsCount"></a>

### pool.getTotalSetsCount() ⇒ <code>number</code>
return total number of sets

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getTotalRollsWithSets"></a>

### pool.getTotalRollsWithSets() ⇒ <code>number</code>
return total number of rolls with sets

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+rollPool"></a>

### pool.rollPool()
rolls all Dice in the Pool, calculates secondary values

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getAbove"></a>

### pool.getAbove(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns numbers above the provided value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Pool+getBelow"></a>

### pool.getBelow(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns numbers below the provided value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Pool+getEqual"></a>

### pool.getEqual(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns numbers equal to the provided value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Pool+getWithinRange"></a>

### pool.getWithinRange(_min_value, _max_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns numbers within the specified range, inclusive

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type |
| --- | --- |
| _min_value | <code>string</code> \| <code>number</code> | 
| _max_value | <code>string</code> \| <code>number</code> | 

<a name="Pool+getSumAbove"></a>

### pool.getSumAbove(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns roll sums above the provided value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Pool+getSumBelow"></a>

### pool.getSumBelow(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns roll sums below the provided value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Pool+getSumEqual"></a>

### pool.getSumEqual(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns roll sums equal to the provided value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Pool+getSumWithinRange"></a>

### pool.getSumWithinRange(_min_value, _max_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns roll sums within the specified range, inclusive

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type |
| --- | --- |
| _min_value | <code>string</code> \| <code>number</code> | 
| _max_value | <code>string</code> \| <code>number</code> | 

<a name="Pool+getSequences"></a>

### pool.getSequences() ⇒ <code>Array.&lt;Object&gt;</code>
returns all sequences, series of incrementing numbers of 2 or more length (1-2; 2-3-4)

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sequences:Array[ number[] ]}]  
<a name="Pool+getSets"></a>

### pool.getSets() ⇒ <code>Array.&lt;Object&gt;</code>
returns all sets, series of same numbers of 2 or more length (2-2; 3-3-3)

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sets:Array[ number[] ]}]  
<a name="Pool+getSetsOfValue"></a>

### pool.getSetsOfValue(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns Sets that contain the provided value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sets:Array[ number[] ]}]  

| Param | Type |
| --- | --- |
| _value | <code>string</code> \| <code>number</code> | 

<a name="Pool+getSetsOfLength"></a>

### pool.getSetsOfLength(_length) ⇒ <code>Array.&lt;Object&gt;</code>
returns Sets that are of the provide length

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sets:Array[ number[] ]}]  

| Param | Type |
| --- | --- |
| _length | <code>string</code> \| <code>number</code> | 

<a name="Pool+getSequencesWithValue"></a>

### pool.getSequencesWithValue(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns Sequences that contain the provided value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sequences:Array[ number[] ]}]  

| Param | Type |
| --- | --- |
| _value | <code>string</code> \| <code>number</code> | 

<a name="Pool+getSequencesOfLength"></a>

### pool.getSequencesOfLength(_length) ⇒ <code>Array.&lt;Object&gt;</code>
returns Sequences that are of the provide length

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sequences:Array[ number[] ]}]  

| Param | Type |
| --- | --- |
| _length | <code>string</code> \| <code>number</code> | 

<a name="Pool+getMetrics"></a>

### pool.getMetrics() ⇒ <code>Object</code>
generate all possible values, then generate counts and ratios for each

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Object</code> - - {dice_metrics:Object[],                      maximum_value:number,                      minimum_value:number,                     pool_metrics:Object[]}                   - dice_metrics: [{value:number, count:number, ratio:number}]                   - pool_metrics: [{value:number, count:number, ratio:number}]  
<a name="Pool+getSetMetrics"></a>

### pool.getSetMetrics() ⇒ <code>Array.&lt;Object&gt;</code>
determines all possible Setsdetermines metrics of actual rolled results

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{count:number, ratio:number, set:number[]}]  
<a name="Pool+getSequenceMetrics"></a>

### pool.getSequenceMetrics() ⇒ <code>Array.&lt;Object&gt;</code>
determines all possible Sequencesdetermines metrics of actual rolled results

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{count:number, ratio:number, sequence:string}]  
<a name="Pool+dropLowestValue"></a>

### pool.dropLowestValue(_drop_count)
calls dropValue for dropLowestValue with specified drop count

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Pool+dropHighestValue"></a>

### pool.dropHighestValue(_drop_count)
calls dropValue for dropHighestValue with specified drop count

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Pool+dropValue"></a>

### pool.dropValue(_drop_value, _drop_count)
calls dropValue for dropValue with specified drop value and count

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_value | <code>string</code> \| <code>number</code> | specific value to drop |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Pool+dropDice"></a>

### pool.dropDice(_dice_index) ⇒ <code>undefined</code>
drops specific index Dice from Pool and re-rolls

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>undefined</code> - - if error  

| Param | Type | Description |
| --- | --- | --- |
| _dice_index | <code>Number</code> | index of the specified Dice |

<a name="Pool+addDice"></a>

### pool.addDice(_minimum_value_or_dice, _maximum_value, [_modifier])
calls updateDice and passes arguments to add a dice to pool

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _minimum_value_or_dice | <code>string</code> \| <code>number</code> \| [<code>Dice</code>](#Dice) | minimum value or Dice object to generate and add |
| _maximum_value | <code>string</code> \| <code>number</code> | maximum value of Dice, required if minimum value is non-Dice object |
| [_modifier] | <code>undefined</code> \| <code>number</code> \| <code>function</code> | modifier to roll |

<a name="Pool+updateDice"></a>

### pool.updateDice(_target_dice, _minimum_value_or_dice, _maximum_value, [_modifier]) ⇒ <code>undefined</code>
Updates Dice array with provide data, including adding dice if _target_dice is not valid

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>undefined</code> - - on error  

| Param | Type | Description |
| --- | --- | --- |
| _target_dice | <code>\*</code> |  |
| _minimum_value_or_dice | <code>string</code> \| <code>number</code> \| [<code>Dice</code>](#Dice) | minimum value or Dice object to generate and add |
| _maximum_value | <code>string</code> \| <code>number</code> | maximum value of Dice, required if minimum value is non-Dice object |
| [_modifier] | <code>undefined</code> \| <code>number</code> \| <code>function</code> | modifier to roll |

<a name="Pool+reRollDice"></a>

### pool.reRollDice(_dice_index) ⇒ <code>undefined</code>
re-rolls the Dice object at the specified index

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>undefined</code> - - if error  

| Param | Type | Description |
| --- | --- | --- |
| _dice_index | <code>Number</code> | index of Dice object to re-roll |

<a name="Pool+explodeValue"></a>

### pool.explodeValue([_value_to_explode_on], _explode_limit, _additional_dice) ⇒ <code>undefined</code>
add additional Dice to the roll if a value occurs in the results

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>undefined</code> - - on error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [_value_to_explode_on] | <code>string</code> \| <code>number</code> | <code>&quot;\&quot;max\&quot;&quot;</code> | value that triggers adding dice, 'max', 'min', or specific value |
| _explode_limit | <code>string</code> \| <code>number</code> |  | limit to how many additional Dice can be added |
| _additional_dice | [<code>Dice</code>](#Dice) |  | Dice object that will be cloned and added |

