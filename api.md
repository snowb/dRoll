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
<dt><a href="#Metrics_Dice">Metrics_Dice</a> : <code>Object</code></dt>
<dd><p>The Metrics_Dice object to compute metrics from a Dice object</p>
</dd>
<dt><a href="#Metrics_Pool">Metrics_Pool</a> : <code>Object</code></dt>
<dd><p>Pool object an Array of Metrics_Dice objects and an optional iterations counts 
Generates and calls .roll() on the provided Metrics_Dice objects and stores the results
Generate secondary and metrics results from parent Pool class</p>
</dd>
<dt><a href="#Pool">Pool</a> : <code>Object</code></dt>
<dd><p>Pool object an Array of Dice objects and an optional iterations counts 
Generates calls .roll() on the provided Dice objects and stores the results
Generate minimal secondary, and abbreviated results as well</p>
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
| minimum_value | <code>number</code> | Minimum value passed to Dice constructor |
| maximum_value | <code>number</code> | Maximum value passed to Dice constructor |
| modifier | <code>undefined</code> \| <code>function</code> | modifier function for modifying results |
| additional_text | <code>string</code> | additional text to be available to outside libs/apps |


* [Dice](#Dice) : <code>Object</code>
    * [.Dice](#Dice+Dice)
        * [new exports.Dice([_minimum_value], _maximum_value, _modifier)](#new_Dice+Dice_new)
    * [.setIterations(_value)](#Dice+setIterations)
    * [.getIterations()](#Dice+getIterations) ⇒ <code>number</code>
    * [.getMinimum()](#Dice+getMinimum) ⇒ <code>number</code>
    * [.getMaximum()](#Dice+getMaximum) ⇒ <code>number</code>
    * [.getModifier()](#Dice+getModifier) ⇒ <code>undefined</code> \| <code>number</code> \| <code>function</code>
    * [.getModifierFunction()](#Dice+getModifierFunction) ⇒ <code>function</code>
    * [.getClone()](#Dice+getClone) ⇒ [<code>Dice</code>](#Dice)
    * [.setAdditionalText(_text)](#Dice+setAdditionalText)
    * [.getAdditionalText()](#Dice+getAdditionalText) ⇒ <code>text</code> \| <code>number</code>
    * [.roll(_iterations)](#Dice+roll)
    * [.reRoll(_index)](#Dice+reRoll) ⇒ <code>undefined</code>
    * [.getResults()](#Dice+getResults) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.modifySingleValue(_value)](#Dice+modifySingleValue) ⇒ <code>number</code>
    * [.dropValueAtIndex(_index)](#Dice+dropValueAtIndex)
    * [.explodeValue([_value_to_explode_on], [_explode_limit], [_additional_dice])](#Dice+explodeValue) ⇒ [<code>Array.&lt;Dice&gt;</code>](#Dice)
    * [.updateValues(_values_array)](#Dice+updateValues) ⇒ <code>undefined</code>
    * [.getAbove(_value)](#Dice+getAbove) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getBelow(_value)](#Dice+getBelow) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getEqual(_value)](#Dice+getEqual) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getWithinRange(_min_value, _max_value)](#Dice+getWithinRange) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getEven()](#Dice+getEven) ⇒ <code>Object</code>
    * [.getOdd()](#Dice+getOdd) ⇒ <code>Object</code>
    * [.getAllForValue(_value)](#Dice+getAllForValue) ⇒ <code>Object</code>

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

<a name="Dice+setIterations"></a>

### dice.setIterations(_value)
**Kind**: instance method of [<code>Dice</code>](#Dice)  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>number</code> | value to set iterations too |

<a name="Dice+getIterations"></a>

### dice.getIterations() ⇒ <code>number</code>
**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>number</code> - - returns number of iterations  
<a name="Dice+getMinimum"></a>

### dice.getMinimum() ⇒ <code>number</code>
**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>number</code> - - returns unmodified minimum value  
<a name="Dice+getMaximum"></a>

### dice.getMaximum() ⇒ <code>number</code>
**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>number</code> - - returns unmodified maximum value  
<a name="Dice+getModifier"></a>

### dice.getModifier() ⇒ <code>undefined</code> \| <code>number</code> \| <code>function</code>
**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>undefined</code> \| <code>number</code> \| <code>function</code> - - returns modifier value  
<a name="Dice+getModifierFunction"></a>

### dice.getModifierFunction() ⇒ <code>function</code>
**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>function</code> - - returns modifier function  
<a name="Dice+getClone"></a>

### dice.getClone() ⇒ [<code>Dice</code>](#Dice)
**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: [<code>Dice</code>](#Dice) - - returns a new Dice object with the same min, max, and modifiers  
<a name="Dice+setAdditionalText"></a>

### dice.setAdditionalText(_text)
**Kind**: instance method of [<code>Dice</code>](#Dice)  

| Param | Type | Description |
| --- | --- | --- |
| _text | <code>string</code> | input of number or text to be stored for outside lib/app use |

<a name="Dice+getAdditionalText"></a>

### dice.getAdditionalText() ⇒ <code>text</code> \| <code>number</code>
**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>text</code> \| <code>number</code> - - returns additional_text property  
<a name="Dice+roll"></a>

### dice.roll(_iterations)
calculates values between minimum and maximum values, applies modifier for number of provided iterationsstores values in #results

**Kind**: instance method of [<code>Dice</code>](#Dice)  

| Param | Type | Description |
| --- | --- | --- |
| _iterations | <code>string</code> \| <code>number</code> | number of iterations to run |

<a name="Dice+reRoll"></a>

### dice.reRoll(_index) ⇒ <code>undefined</code>
Re-roll a value at a specific index

**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>undefined</code> - - on error  

| Param | Type | Description |
| --- | --- | --- |
| _index | <code>string</code> \| <code>number</code> | re-rolls the value at the specific index |

<a name="Dice+getResults"></a>

### dice.getResults() ⇒ <code>Array.&lt;Object&gt;</code>
returns the results Array

**Kind**: instance method of [<code>Dice</code>](#Dice)  
<a name="Dice+modifySingleValue"></a>

### dice.modifySingleValue(_value) ⇒ <code>number</code>
modifies a single value using the #modifier private property

**Kind**: instance method of [<code>Dice</code>](#Dice)  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | value to modified |

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

<a name="Dice+updateValues"></a>

### dice.updateValues(_values_array) ⇒ <code>undefined</code>
Update values in #results with new values

**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>undefined</code> - - on error  

| Param | Type | Description |
| --- | --- | --- |
| _values_array | <code>Array.&lt;Number&gt;</code> | array of numbers to replace/update in #results |

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

<a name="Dice+getWithinRange"></a>

### dice.getWithinRange(_min_value, _max_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns all values within the to the input range, inclusive

**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - {count: number, values: Object[{index:index, value:value}]}  

| Param | Type | Description |
| --- | --- | --- |
| _min_value | <code>string</code> \| <code>number</code> | starting value to compare |
| _max_value | <code>string</code> \| <code>number</code> | ending value to compare |

<a name="Dice+getEven"></a>

### dice.getEven() ⇒ <code>Object</code>
Returns Even values from Dice object

**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>Object</code> - - object with count and Array of values  
<a name="Dice+getOdd"></a>

### dice.getOdd() ⇒ <code>Object</code>
Returns Odd values from Dice object

**Kind**: instance method of [<code>Dice</code>](#Dice)  
**Returns**: <code>Object</code> - - object with count and Array of values  
<a name="Dice+getAllForValue"></a>

### dice.getAllForValue(_value) ⇒ <code>Object</code>
runs all getAbove/Below/Equal/etc functionsreturns all generated resultsalso returns the private properties of average and results

**Kind**: instance method of [<code>Dice</code>](#Dice)  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | value to match |

<a name="Metrics_Dice"></a>

## Metrics\_Dice : <code>Object</code>
The Metrics_Dice object to compute metrics from a Dice object

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| minimum_modified_value | <code>number</code> | Minimum modified value from Dice object |
| maximum_modified_value | <code>number</code> | Maximum modified value from Dice object |
| modifier_function | <code>function</code> | function of modifier provided to constructor |


* [Metrics_Dice](#Metrics_Dice) : <code>Object</code>
    * [.getMinimumModified()](#Metrics_Dice+getMinimumModified) ⇒ <code>Number</code>
    * [.getMaximumModified()](#Metrics_Dice+getMaximumModified) ⇒ <code>Number</code>
    * [.getAverage()](#Metrics_Dice+getAverage) ⇒ <code>number</code>
    * [.getMetrics()](#Metrics_Dice+getMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.convertDice(_dice, _method)](#Metrics_Dice+convertDice) ⇒ <code>undefined</code>

<a name="Metrics_Dice+getMinimumModified"></a>

### metrics_Dice.getMinimumModified() ⇒ <code>Number</code>
Returns the modified minimum value

**Kind**: instance method of [<code>Metrics\_Dice</code>](#Metrics_Dice)  
**Returns**: <code>Number</code> - - minimum_value  
<a name="Metrics_Dice+getMaximumModified"></a>

### metrics_Dice.getMaximumModified() ⇒ <code>Number</code>
Returns the modified maximum value

**Kind**: instance method of [<code>Metrics\_Dice</code>](#Metrics_Dice)  
**Returns**: <code>Number</code> - - maximum_value  
<a name="Metrics_Dice+getAverage"></a>

### metrics_Dice.getAverage() ⇒ <code>number</code>
**Kind**: instance method of [<code>Metrics\_Dice</code>](#Metrics_Dice)  
**Returns**: <code>number</code> - -  returns the average of all rolls  
<a name="Metrics_Dice+getMetrics"></a>

### metrics_Dice.getMetrics() ⇒ <code>Array.&lt;Object&gt;</code>
generates output of all possible modified values,then counts how many actual occurances of that value,and provides ratio

**Kind**: instance method of [<code>Metrics\_Dice</code>](#Metrics_Dice)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{value:{number}, count:{number}, ratio:{number}}]  
<a name="Metrics_Dice+convertDice"></a>

### metrics_Dice.convertDice(_dice, _method) ⇒ <code>undefined</code>
**Kind**: instance method of [<code>Metrics\_Dice</code>](#Metrics_Dice)  
**Returns**: <code>undefined</code> - - undefined on error  

| Param | Type | Description |
| --- | --- | --- |
| _dice | [<code>Dice</code>](#Dice) | convert from Dice object to Metrics_Dice object |
| _method | <code>string</code> \| <code>undefined</code> | "transcribe" or anything, whether to transcribe the values after setting up Metrics_Dice |

<a name="Metrics_Pool"></a>

## Metrics\_Pool : <code>Object</code>
Pool object an Array of Metrics_Dice objects and an optional iterations counts Generates and calls .roll() on the provided Metrics_Dice objects and stores the resultsGenerate secondary and metrics results from parent Pool class

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dice_metrics | [<code>Array.&lt;Metrics\_Dice&gt;</code>](#Metrics_Dice) | Contains metrics from each Metrics_Dice object |
| max_dice | <code>Number</code> | The highest Dice value |
| min_dice | <code>Number</code> | The lowest Dice value |
| secondaryResults | <code>Object</code> | Contains secondary metrics calculations |
| groupResults | <code>Object</code> | contains sets, sequences, and metrics for both |


* [Metrics_Pool](#Metrics_Pool) : <code>Object</code>
    * [.getDiceMetrics(_index)](#Metrics_Pool+getDiceMetrics) ⇒ <code>Object</code>
    * [.getPoolSize()](#Metrics_Pool+getPoolSize) ⇒ <code>number</code>
    * [.rollPool()](#Metrics_Pool+rollPool)
    * [.getDiceCount()](#Metrics_Pool+getDiceCount) ⇒ <code>Number</code>
    * [.getMaxDiceValue()](#Metrics_Pool+getMaxDiceValue) ⇒ <code>Number</code>
    * [.getMinDiceValue()](#Metrics_Pool+getMinDiceValue) ⇒ <code>Number</code>
    * [.getEvenMetrics(_result_target)](#Metrics_Pool+getEvenMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumEvenMetrics(_result_target)](#Metrics_Pool+getSumEvenMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getModifiedEvenMetrics()](#Metrics_Pool+getModifiedEvenMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getOddMetrics(_result_target)](#Metrics_Pool+getOddMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumOddMetrics(_result_target)](#Metrics_Pool+getSumOddMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getModifiedOddMetrics()](#Metrics_Pool+getModifiedOddMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getAboveMetrics(_value, _result_target)](#Metrics_Pool+getAboveMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumAboveMetrics(_value)](#Metrics_Pool+getSumAboveMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getModifiedAboveMetrics(_value)](#Metrics_Pool+getModifiedAboveMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getBelowMetrics(_value, _result_target)](#Metrics_Pool+getBelowMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumBelowMetrics(_value)](#Metrics_Pool+getSumBelowMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getModifiedBelowMetrics(_value)](#Metrics_Pool+getModifiedBelowMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getEqualMetrics(_value, _result_target)](#Metrics_Pool+getEqualMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumEqualMetrics(_value, _result_target)](#Metrics_Pool+getSumEqualMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getModifiedEqualMetrics(_value, _result_target)](#Metrics_Pool+getModifiedEqualMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getWithinRangeMetrics(_value, _result_target)](#Metrics_Pool+getWithinRangeMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumWithinRangeMetrics(_value)](#Metrics_Pool+getSumWithinRangeMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getModifiedWithinRangeMetrics(_value)](#Metrics_Pool+getModifiedWithinRangeMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getLowestMetrics(_dice_count)](#Metrics_Pool+getLowestMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getHighestMetrics(_dice_count)](#Metrics_Pool+getHighestMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSequences()](#Metrics_Pool+getSequences) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSets()](#Metrics_Pool+getSets) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSetsOfValue(_value)](#Metrics_Pool+getSetsOfValue) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSetsOfLength(_length)](#Metrics_Pool+getSetsOfLength) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSequencesWithValue(_value)](#Metrics_Pool+getSequencesWithValue) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSequencesOfLength(_length)](#Metrics_Pool+getSequencesOfLength) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getMetrics()](#Metrics_Pool+getMetrics) ⇒ <code>Object</code>
    * [.getSetMetrics()](#Metrics_Pool+getSetMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSequenceMetrics()](#Metrics_Pool+getSequenceMetrics) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.dropLowestValue(_drop_count)](#Metrics_Pool+dropLowestValue)
    * [.dropHighestValue(_drop_count)](#Metrics_Pool+dropHighestValue)
    * [.dropValue(_drop_value, _drop_count)](#Metrics_Pool+dropValue)
    * [.dropValueBelow(_drop_value, _drop_count)](#Metrics_Pool+dropValueBelow)
    * [.dropValueAbove(_drop_value, _drop_count)](#Metrics_Pool+dropValueAbove)
    * [.dropEven(_drop_value, _drop_count)](#Metrics_Pool+dropEven)
    * [.dropOdd(_drop_value, _drop_count)](#Metrics_Pool+dropOdd)
    * [.dropDice(_dice_index, _no_pool_reroll)](#Metrics_Pool+dropDice) ⇒ <code>undefined</code>
    * [.addDice(_minimum_value_or_dice, _maximum_value, [_modifier])](#Metrics_Pool+addDice)
    * [.updateDice(_target_dice, _minimum_value_or_dice, _maximum_value, [_modifier])](#Metrics_Pool+updateDice) ⇒ <code>undefined</code>
    * [.reRollDice(_dice_index)](#Metrics_Pool+reRollDice) ⇒ <code>undefined</code>
    * [.explodeValue([_value_to_explode_on], _explode_limit, _additional_dice)](#Metrics_Pool+explodeValue) ⇒ <code>undefined</code>

<a name="Metrics_Pool+getDiceMetrics"></a>

### metrics_Pool.getDiceMetrics(_index) ⇒ <code>Object</code>
**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Object</code> - - Metrics_Dice.getMetrics() object  

| Param | Type | Description |
| --- | --- | --- |
| _index | <code>number</code> | - |

<a name="Metrics_Pool+getPoolSize"></a>

### metrics_Pool.getPoolSize() ⇒ <code>number</code>
**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>number</code> - - length/size of pool  
<a name="Metrics_Pool+rollPool"></a>

### metrics_Pool.rollPool()
rolls all Dice in the Pool, calculates secondary values

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
<a name="Metrics_Pool+getDiceCount"></a>

### metrics_Pool.getDiceCount() ⇒ <code>Number</code>
**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Number</code> - - number of dice in pool  
<a name="Metrics_Pool+getMaxDiceValue"></a>

### metrics_Pool.getMaxDiceValue() ⇒ <code>Number</code>
**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Number</code> - - Highest dice value in pool  
<a name="Metrics_Pool+getMinDiceValue"></a>

### metrics_Pool.getMinDiceValue() ⇒ <code>Number</code>
**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Number</code> - - Lowest dice value in pool  
<a name="Metrics_Pool+getEvenMetrics"></a>

### metrics_Pool.getEvenMetrics(_result_target) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _result_target | <code>String</code> | "pool" (default) or "dice",                                    whether to return the Pool Value WITH Even Dice or only the Pool Value OF Even Dice. |

<a name="Metrics_Pool+getSumEvenMetrics"></a>

### metrics_Pool.getSumEvenMetrics(_result_target) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _result_target | <code>String</code> | "pool" (default) or "dice",                                    whether to return the Pool Value WITH Even Dice or only the Pool Value OF Even Dice. |

<a name="Metrics_Pool+getModifiedEvenMetrics"></a>

### metrics_Pool.getModifiedEvenMetrics() ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter from the modifiedResults.results data

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  
<a name="Metrics_Pool+getOddMetrics"></a>

### metrics_Pool.getOddMetrics(_result_target) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _result_target | <code>String</code> | "pool" (default) or "dice",                                    whether to return the Pool Value WITH Odd Dice or only the Pool Value OF Odd Dice. |

<a name="Metrics_Pool+getSumOddMetrics"></a>

### metrics_Pool.getSumOddMetrics(_result_target) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _result_target | <code>String</code> | "pool" (default) or "dice",                                    whether to return the Pool Value WITH Odd Dice or only the Pool Value OF Odd Dice. |

<a name="Metrics_Pool+getModifiedOddMetrics"></a>

### metrics_Pool.getModifiedOddMetrics() ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter from the modifiedResults.results data

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  
<a name="Metrics_Pool+getAboveMetrics"></a>

### metrics_Pool.getAboveMetrics(_value, _result_target) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |
| _result_target | <code>String</code> | "pool" (default) or "dice",                                    whether to return the Pool Value WITH Above Dice or only the Pool Value OF Above Dice. |

<a name="Metrics_Pool+getSumAboveMetrics"></a>

### metrics_Pool.getSumAboveMetrics(_value) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Metrics_Pool+getModifiedAboveMetrics"></a>

### metrics_Pool.getModifiedAboveMetrics(_value) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter from the modified_results.result data

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Metrics_Pool+getBelowMetrics"></a>

### metrics_Pool.getBelowMetrics(_value, _result_target) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |
| _result_target | <code>String</code> | "pool" (default) or "dice",                                    whether to return the Pool Value WITH Below Dice or only the Pool Value OF Below Dice. |

<a name="Metrics_Pool+getSumBelowMetrics"></a>

### metrics_Pool.getSumBelowMetrics(_value) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Metrics_Pool+getModifiedBelowMetrics"></a>

### metrics_Pool.getModifiedBelowMetrics(_value) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter from the modified_results.result data

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Metrics_Pool+getEqualMetrics"></a>

### metrics_Pool.getEqualMetrics(_value, _result_target) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |
| _result_target | <code>String</code> | "pool" (default) or "dice",                                    whether to return the Pool Value WITH Below Dice or only the Pool Value OF Below Dice. |

<a name="Metrics_Pool+getSumEqualMetrics"></a>

### metrics_Pool.getSumEqualMetrics(_value, _result_target) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |
| _result_target | <code>String</code> | "pool" (default) or "dice",                                    whether to return the Pool Value WITH Below Dice or only the Pool Value OF Below Dice. |

<a name="Metrics_Pool+getModifiedEqualMetrics"></a>

### metrics_Pool.getModifiedEqualMetrics(_value, _result_target) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter from the modified_results.result data

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |
| _result_target | <code>String</code> | "pool" (default) or "dice",                                    whether to return the Pool Value WITH Below Dice or only the Pool Value OF Below Dice. |

<a name="Metrics_Pool+getWithinRangeMetrics"></a>

### metrics_Pool.getWithinRangeMetrics(_value, _result_target) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |
| _result_target | <code>String</code> | "pool" (default) or "dice",                                    whether to return the Pool Value WITH Below Dice or only the Pool Value OF Below Dice. |

<a name="Metrics_Pool+getSumWithinRangeMetrics"></a>

### metrics_Pool.getSumWithinRangeMetrics(_value) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Metrics_Pool+getModifiedWithinRangeMetrics"></a>

### metrics_Pool.getModifiedWithinRangeMetrics(_value) ⇒ <code>Array.&lt;Object&gt;</code>
Return metrics for the given filter from the modified_results.result data

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Metrics_Pool+getLowestMetrics"></a>

### metrics_Pool.getLowestMetrics(_dice_count) ⇒ <code>Array.&lt;Object&gt;</code>
Returns _dice_count number of lowest results in the pool

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _dice_count | <code>Number</code> \| <code>String</code> | how many of the 'lowest' dice to return |

<a name="Metrics_Pool+getHighestMetrics"></a>

### metrics_Pool.getHighestMetrics(_dice_count) ⇒ <code>Array.&lt;Object&gt;</code>
Returns _dice_count number of highest results in the pool

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - array of objects of form {value:Number, count:Number, ratio:Number}  

| Param | Type | Description |
| --- | --- | --- |
| _dice_count | <code>Number</code> \| <code>String</code> | how many of the 'highest' dice to return |

<a name="Metrics_Pool+getSequences"></a>

### metrics_Pool.getSequences() ⇒ <code>Array.&lt;Object&gt;</code>
returns all sequences, series of incrementing numbers of 2 or more length (1-2; 2-3-4)

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sequences:Array[ number[] ]}]  
<a name="Metrics_Pool+getSets"></a>

### metrics_Pool.getSets() ⇒ <code>Array.&lt;Object&gt;</code>
returns all sets, series of same numbers of 2 or more length (2-2; 3-3-3)

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sets:Array[ number[] ]}]  
<a name="Metrics_Pool+getSetsOfValue"></a>

### metrics_Pool.getSetsOfValue(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns Sets that contain the provided value

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sets:Array[ number[] ]}]  

| Param | Type |
| --- | --- |
| _value | <code>string</code> \| <code>number</code> | 

<a name="Metrics_Pool+getSetsOfLength"></a>

### metrics_Pool.getSetsOfLength(_length) ⇒ <code>Array.&lt;Object&gt;</code>
returns Sets that are of the provide length

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sets:Array[ number[] ]}]  

| Param | Type |
| --- | --- |
| _length | <code>string</code> \| <code>number</code> | 

<a name="Metrics_Pool+getSequencesWithValue"></a>

### metrics_Pool.getSequencesWithValue(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns Sequences that contain the provided value

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sequences:Array[ number[] ]}]  

| Param | Type |
| --- | --- |
| _value | <code>string</code> \| <code>number</code> | 

<a name="Metrics_Pool+getSequencesOfLength"></a>

### metrics_Pool.getSequencesOfLength(_length) ⇒ <code>Array.&lt;Object&gt;</code>
returns Sequences that are of the provide length

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, sequences:Array[ number[] ]}]  

| Param | Type |
| --- | --- |
| _length | <code>string</code> \| <code>number</code> | 

<a name="Metrics_Pool+getMetrics"></a>

### metrics_Pool.getMetrics() ⇒ <code>Object</code>
generate all possible values, then generate counts and ratios for each

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Object</code> - - {dice_metrics:Object[],                      maximum_value:number,                      minimum_value:number,                     pool_metrics:Object[]}                   - dice_metrics: [{value:number, count:number, ratio:number}]                   - pool_metrics: [{value:number, count:number, ratio:number}]  
<a name="Metrics_Pool+getSetMetrics"></a>

### metrics_Pool.getSetMetrics() ⇒ <code>Array.&lt;Object&gt;</code>
determines all possible Setsdetermines metrics of actual rolled results

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{count:number, ratio:number, set:number[]}]  
<a name="Metrics_Pool+getSequenceMetrics"></a>

### metrics_Pool.getSequenceMetrics() ⇒ <code>Array.&lt;Object&gt;</code>
determines all possible Sequencesdetermines metrics of actual rolled results

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{count:number, ratio:number, sequence:string}]  
<a name="Metrics_Pool+dropLowestValue"></a>

### metrics_Pool.dropLowestValue(_drop_count)
calls dropValue for dropLowestValue with specified drop count

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Metrics_Pool+dropHighestValue"></a>

### metrics_Pool.dropHighestValue(_drop_count)
calls dropValue for dropHighestValue with specified drop count

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Metrics_Pool+dropValue"></a>

### metrics_Pool.dropValue(_drop_value, _drop_count)
calls dropValue for dropValue with specified drop value and count

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_value | <code>string</code> \| <code>number</code> | specific value to drop |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Metrics_Pool+dropValueBelow"></a>

### metrics_Pool.dropValueBelow(_drop_value, _drop_count)
calls dropValue for dropValueBelow with specified drop value and count

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_value | <code>string</code> \| <code>number</code> | specific value to drop |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Metrics_Pool+dropValueAbove"></a>

### metrics_Pool.dropValueAbove(_drop_value, _drop_count)
calls dropValue for dropValueAbove with specified drop value and count

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_value | <code>string</code> \| <code>number</code> | specific value to drop |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Metrics_Pool+dropEven"></a>

### metrics_Pool.dropEven(_drop_value, _drop_count)
calls dropValue for dropEven with specified drop value and count

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_value | <code>string</code> \| <code>number</code> | specific value to drop |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Metrics_Pool+dropOdd"></a>

### metrics_Pool.dropOdd(_drop_value, _drop_count)
calls dropValue for dropOdd with specified drop value and count

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_value | <code>string</code> \| <code>number</code> | specific value to drop |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Metrics_Pool+dropDice"></a>

### metrics_Pool.dropDice(_dice_index, _no_pool_reroll) ⇒ <code>undefined</code>
drops specific index Dice from Pool and re-rolls

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>undefined</code> - - if error  

| Param | Type | Description |
| --- | --- | --- |
| _dice_index | <code>Number</code> | index of the specified Dice |
| _no_pool_reroll | <code>Boolean</code> | whether to NOT re-roll the pool, defaults to False (do re-roll) |

<a name="Metrics_Pool+addDice"></a>

### metrics_Pool.addDice(_minimum_value_or_dice, _maximum_value, [_modifier])
calls updateDice and passes arguments to add a dice to pool

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _minimum_value_or_dice | <code>string</code> \| <code>number</code> \| [<code>Dice</code>](#Dice) | minimum value or Dice object to generate and add, if Array of Dice objects loop and add all |
| _maximum_value | <code>string</code> \| <code>number</code> | maximum value of Dice, required if minimum value is non-Dice object |
| [_modifier] | <code>undefined</code> \| <code>number</code> \| <code>function</code> | modifier to roll |

<a name="Metrics_Pool+updateDice"></a>

### metrics_Pool.updateDice(_target_dice, _minimum_value_or_dice, _maximum_value, [_modifier]) ⇒ <code>undefined</code>
Updates Dice array with provide data, including adding dice if _target_dice is not valid

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>undefined</code> - - on error  

| Param | Type | Description |
| --- | --- | --- |
| _target_dice | <code>number</code> | index of Dice to update |
| _minimum_value_or_dice | <code>string</code> \| <code>number</code> \| [<code>Dice</code>](#Dice) | minimum value or Dice object to generate and add |
| _maximum_value | <code>string</code> \| <code>number</code> | maximum value of Dice, required if minimum value is non-Dice object |
| [_modifier] | <code>undefined</code> \| <code>number</code> \| <code>function</code> | modifier to roll |

<a name="Metrics_Pool+reRollDice"></a>

### metrics_Pool.reRollDice(_dice_index) ⇒ <code>undefined</code>
re-rolls the Dice object at the specified index

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>undefined</code> - - if error  

| Param | Type | Description |
| --- | --- | --- |
| _dice_index | <code>Number</code> | index of Dice object to re-roll |

<a name="Metrics_Pool+explodeValue"></a>

### metrics_Pool.explodeValue([_value_to_explode_on], _explode_limit, _additional_dice) ⇒ <code>undefined</code>
add additional Dice to the roll if a value occurs in the results

**Kind**: instance method of [<code>Metrics\_Pool</code>](#Metrics_Pool)  
**Returns**: <code>undefined</code> - - on error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [_value_to_explode_on] | <code>string</code> \| <code>number</code> | <code>&quot;\&quot;max\&quot;&quot;</code> | value that triggers adding dice, 'max', 'min', or specific value |
| _explode_limit | <code>string</code> \| <code>number</code> |  | limit to how many additional Dice can be added |
| _additional_dice | [<code>Dice</code>](#Dice) |  | Dice object that will be cloned and added |

<a name="Pool"></a>

## Pool : <code>Object</code>
Pool object an Array of Dice objects and an optional iterations counts Generates calls .roll() on the provided Dice objects and stores the resultsGenerate minimal secondary, and abbreviated results as well

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| iterations | <code>number</code> | number of iterations |
| fullRollResults | <code>Array.&lt;Object&gt;</code> | Array of objects containing Dice objects |
| rollResults | <code>Array.&lt;Object&gt;</code> | Array of objects containing abbreviated data [{index:number, roll:number[]}] |
| secondaryResults | <code>Object</code> | Contains sum, mean, min, and max values for all roll |


* [Pool](#Pool) : <code>Object</code>
    * [.Pool](#Pool+Pool)
        * [new exports.Pool(_dice_objects_array, [_iterations])](#new_Pool+Pool_new)
    * [.getIterations()](#Pool+getIterations) ⇒ <code>number</code>
    * [.setIterations(_iterations)](#Pool+setIterations)
    * [.getFullRollResults()](#Pool+getFullRollResults) ⇒ [<code>Array.&lt;Dice&gt;</code>](#Dice)
    * [.getRollResults()](#Pool+getRollResults) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumRolled()](#Pool+getSumRolled) ⇒ <code>Array.&lt;number&gt;</code>
    * [.getMinRolled()](#Pool+getMinRolled) ⇒ <code>Array.&lt;number&gt;</code>
    * [.getMaxRolled()](#Pool+getMaxRolled) ⇒ <code>Array.&lt;number&gt;</code>
    * [.getPoolMin()](#Pool+getPoolMin) ⇒ <code>Number</code>
    * [.getPoolMax()](#Pool+getPoolMax) ⇒ <code>Number</code>
    * [.getModifiedResults()](#Pool+getModifiedResults) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.getModifiedMinimum()](#Pool+getModifiedMinimum) ⇒ <code>Number</code>
    * [.getModifiedMaximum()](#Pool+getModifiedMaximum) ⇒ <code>Number</code>
    * [.resetModifiedResults()](#Pool+resetModifiedResults)
    * [.getPoolSize()](#Pool+getPoolSize) ⇒ <code>number</code>
    * [.rollPool()](#Pool+rollPool)
    * [.dropLowestValue(_drop_count)](#Pool+dropLowestValue)
    * [.dropHighestValue(_drop_count)](#Pool+dropHighestValue)
    * [.dropValue(_drop_value, _drop_count)](#Pool+dropValue)
    * [.dropValueBelow(_drop_value, _drop_count)](#Pool+dropValueBelow)
    * [.dropValueAbove(_drop_value, _drop_count)](#Pool+dropValueAbove)
    * [.dropEven(_drop_value, _drop_count)](#Pool+dropEven)
    * [.dropOdd(_drop_value, _drop_count)](#Pool+dropOdd)
    * [.dropDice(_dice_index, _no_pool_reroll)](#Pool+dropDice) ⇒ <code>undefined</code>
    * [.addDice(_minimum_value_or_dice, _maximum_value, [_modifier])](#Pool+addDice)
    * [.updateDice(_target_dice, _minimum_value_or_dice, _maximum_value, [_modifier])](#Pool+updateDice) ⇒ <code>undefined</code>
    * [.reRollDice(_dice_index)](#Pool+reRollDice) ⇒ <code>undefined</code>
    * [.explodeValue([_value_to_explode_on], _explode_limit, _additional_dice)](#Pool+explodeValue) ⇒ <code>undefined</code>
    * [.getModifiedEven()](#Pool+getModifiedEven) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getModifiedOdd()](#Pool+getModifiedOdd) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getModifiedAbove(_value)](#Pool+getModifiedAbove) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getModifiedBelow(_value)](#Pool+getModifiedBelow) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getModifiedEqual(_value)](#Pool+getModifiedEqual) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getModifiedWithinRange(_min_value, _max_value)](#Pool+getModifiedWithinRange) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumEven()](#Pool+getSumEven) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumOdd()](#Pool+getSumOdd) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumAbove(_value)](#Pool+getSumAbove) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumBelow(_value)](#Pool+getSumBelow) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumEqual(_value)](#Pool+getSumEqual) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getSumWithinRange(_min_value, _max_value)](#Pool+getSumWithinRange) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getAbove(_value)](#Pool+getAbove) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getBelow(_value)](#Pool+getBelow) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getEqual(_value)](#Pool+getEqual) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getWithinRange(_min_value, _max_value)](#Pool+getWithinRange) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getEven()](#Pool+getEven) ⇒ [<code>Array.&lt;Dice&gt;</code>](#Dice)
    * [.getOdd()](#Pool+getOdd) ⇒ [<code>Array.&lt;Dice&gt;</code>](#Dice)
    * [.poolOperation(_operation, _op_order_array)](#Pool+poolOperation)
    * [.modifyPoolOperation(_operation)](#Pool+modifyPoolOperation) ⇒ <code>Array.&lt;Number&gt;</code>

<a name="Pool+Pool"></a>

### pool.Pool
**Kind**: instance class of [<code>Pool</code>](#Pool)  
<a name="new_Pool+Pool_new"></a>

#### new exports.Pool(_dice_objects_array, [_iterations])
Populates private properties and rolls the Dice object provided


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| _dice_objects_array | [<code>Array.&lt;Dice&gt;</code>](#Dice) \| [<code>Array.&lt;Metrics\_Dice&gt;</code>](#Metrics_Dice) |  | array of Dice objects to roll and generate data |
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
<a name="Pool+getMinRolled"></a>

### pool.getMinRolled() ⇒ <code>Array.&lt;number&gt;</code>
return minimum dice rolled from #secondaryResults

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getMaxRolled"></a>

### pool.getMaxRolled() ⇒ <code>Array.&lt;number&gt;</code>
return maximum dice rolled from #secondaryResults

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getPoolMin"></a>

### pool.getPoolMin() ⇒ <code>Number</code>
return lowest pool value from #secondaryResults

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getPoolMax"></a>

### pool.getPoolMax() ⇒ <code>Number</code>
return highest pool value from #secondaryResults

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getModifiedResults"></a>

### pool.getModifiedResults() ⇒ <code>Array.&lt;Number&gt;</code>
return array of numbers of current #modifiedResults.results

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getModifiedMinimum"></a>

### pool.getModifiedMinimum() ⇒ <code>Number</code>
**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Number</code> - - minimum pool value of all iterations  
<a name="Pool+getModifiedMaximum"></a>

### pool.getModifiedMaximum() ⇒ <code>Number</code>
**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Number</code> - - maximum pool value of all iterations  
<a name="Pool+resetModifiedResults"></a>

### pool.resetModifiedResults()
Resets the modifiedResults object to empty

**Kind**: instance method of [<code>Pool</code>](#Pool)  
<a name="Pool+getPoolSize"></a>

### pool.getPoolSize() ⇒ <code>number</code>
**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>number</code> - - length/size of pool  
<a name="Pool+rollPool"></a>

### pool.rollPool()
rolls all Dice in the Pool, calculates secondary values

**Kind**: instance method of [<code>Pool</code>](#Pool)  
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

<a name="Pool+dropValueBelow"></a>

### pool.dropValueBelow(_drop_value, _drop_count)
calls dropValue for dropValueBelow with specified drop value and count

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_value | <code>string</code> \| <code>number</code> | specific value to drop |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Pool+dropValueAbove"></a>

### pool.dropValueAbove(_drop_value, _drop_count)
calls dropValue for dropValueAbove with specified drop value and count

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_value | <code>string</code> \| <code>number</code> | specific value to drop |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Pool+dropEven"></a>

### pool.dropEven(_drop_value, _drop_count)
calls dropValue for dropEven with specified drop value and count

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_value | <code>string</code> \| <code>number</code> | specific value to drop |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Pool+dropOdd"></a>

### pool.dropOdd(_drop_value, _drop_count)
calls dropValue for dropOdd with specified drop value and count

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _drop_value | <code>string</code> \| <code>number</code> | specific value to drop |
| _drop_count | <code>string</code> \| <code>number</code> | number of dice to drop, default of 1 |

<a name="Pool+dropDice"></a>

### pool.dropDice(_dice_index, _no_pool_reroll) ⇒ <code>undefined</code>
drops specific index Dice from Pool and re-rolls

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>undefined</code> - - if error  

| Param | Type | Description |
| --- | --- | --- |
| _dice_index | <code>Number</code> | index of the specified Dice |
| _no_pool_reroll | <code>Boolean</code> | whether to NOT re-roll the pool, defaults to False (do re-roll) |

<a name="Pool+addDice"></a>

### pool.addDice(_minimum_value_or_dice, _maximum_value, [_modifier])
calls updateDice and passes arguments to add a dice to pool

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _minimum_value_or_dice | <code>string</code> \| <code>number</code> \| [<code>Dice</code>](#Dice) | minimum value or Dice object to generate and add, if Array of Dice objects loop and add all |
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

<a name="Pool+getModifiedEven"></a>

### pool.getModifiedEven() ⇒ <code>Array.&lt;Object&gt;</code>
**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - even results from Modified data  
<a name="Pool+getModifiedOdd"></a>

### pool.getModifiedOdd() ⇒ <code>Array.&lt;Object&gt;</code>
**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - odd results from Modified data  
<a name="Pool+getModifiedAbove"></a>

### pool.getModifiedAbove(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns roll Modified above the provided value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Pool+getModifiedBelow"></a>

### pool.getModifiedBelow(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns roll Modified below the provided value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Pool+getModifiedEqual"></a>

### pool.getModifiedEqual(_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns roll Modified equal to the provided value

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type | Description |
| --- | --- | --- |
| _value | <code>string</code> \| <code>number</code> | numeric for value to compare |

<a name="Pool+getModifiedWithinRange"></a>

### pool.getModifiedWithinRange(_min_value, _max_value) ⇒ <code>Array.&lt;Object&gt;</code>
returns roll Modified within the specified range, inclusive

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - [{index:number, values:number[]}]  

| Param | Type |
| --- | --- |
| _min_value | <code>string</code> \| <code>number</code> | 
| _max_value | <code>string</code> \| <code>number</code> | 

<a name="Pool+getSumEven"></a>

### pool.getSumEven() ⇒ <code>Array.&lt;Object&gt;</code>
**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - even results from Sum data  
<a name="Pool+getSumOdd"></a>

### pool.getSumOdd() ⇒ <code>Array.&lt;Object&gt;</code>
**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - odd results from Summed data  
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

<a name="Pool+getEven"></a>

### pool.getEven() ⇒ [<code>Array.&lt;Dice&gt;</code>](#Dice)
**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: [<code>Array.&lt;Dice&gt;</code>](#Dice) - - Pools with Even results within Dice  
<a name="Pool+getOdd"></a>

### pool.getOdd() ⇒ [<code>Array.&lt;Dice&gt;</code>](#Dice)
**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: [<code>Array.&lt;Dice&gt;</code>](#Dice) - - odd results  
<a name="Pool+poolOperation"></a>

### pool.poolOperation(_operation, _op_order_array)
Perform operation with Pool and store in modifiedResults.results

**Kind**: instance method of [<code>Pool</code>](#Pool)  

| Param | Type | Description |
| --- | --- | --- |
| _operation | <code>String</code> \| <code>function</code> | String for name of builtin operation or Function, Function will be passed 1 argument; an Array of Arrays of Numbers [[1,2],[3,4]] and return an Array of Numbers |
| _op_order_array | <code>Array.&lt;Number&gt;</code> | array of indices in order to perform operation on |

<a name="Pool+modifyPoolOperation"></a>

### pool.modifyPoolOperation(_operation) ⇒ <code>Array.&lt;Number&gt;</code>
Modify whatever results are in modifiedResults.results

**Kind**: instance method of [<code>Pool</code>](#Pool)  
**Returns**: <code>Array.&lt;Number&gt;</code> - - mutates #modifiedResults.results and returns array of values  

| Param | Type | Description |
| --- | --- | --- |
| _operation | <code>String</code> \| <code>function</code> | Valid String of operation or Function that will be calld within an Array.Map() over #modifiedResults.results generated by poolOperation  #modifiedResults.results = Number[] |

