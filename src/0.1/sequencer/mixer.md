---
title: Mixers
description: Controlling the flow of the sequence
---

### Introduction

Mixers allow you to control the flow of your sequences within the PI players.
In particular it allows you to repeat, randomize and even branch sections of your sequence according to [environmental variables](./variables.html).

#### Structure
Each one of the PI tasks is composed of a sequence of elements that is sequentially evaluated and presented to the user.
For example, the sequence in piManager is composed of elements (objects usually) that represent a task each.
These sequences are created using the `API.addSequence` method in your script.
Mixers are inserted into the sequence the same way that regular elements are, each mixer represents a sub-sequence that is to be manipulated and the inserted in its place.

For example, in the following sequence the second element in the sequence is a mixer.
It takes a sub-sequence of tasks two and three and randomizes their order.
Note that the single mixer element is effectively replaced by the two elements of the sub-sequence, turning this sequence into a four task sequence.

```js
// The task sequence
API.addSequence([
    // First Element: task 1
    {type:'message', template: 'Task 2', keys: ' '},

    // Second Element: the mixer (task 2 and 3 randomized)
    {
        mixer: 'randomize',
        data: [
            {type:'message', template: 'Task 2', keys: ' '},
            {type:'message', template: 'Task 3', keys: ' '}
        ]
    },

    // Third Element: task 4
    {type:'message', template: 'Task 4', keys: ' '}
]);
```

All mixers have a type associated with them as well as at least one sub-sequence.
The `mixer` property always holds the mixer type (see below for the available types).
In most cases the `data` property holds the sub-sequence (the exception is with the branching mixers that may hold multiple sub-sequences).

This looks something like this: (from now on, instead of explicitly writing in the mixed elements we will use arbitrary variable names instead, such as `elem1` and `elem2`. We are doing this to keep the structures as simple and short as possible).

```js
{
    mixer: 'randomize',     // <== The mixer type (randomize in this case)
    data: [elem1, elem2]    // <== The sub-sequence (holding elem1 and elem2)
}
```
#### Sequence evaluation
Most of the time, mixers are lazily evaluated. This means that the sequencer waits until it reaches the sequencer before expanding it.
This behaviour allows us to use branching mixers - we don't decide which branch to take until we reach it.
The exception to this rule is randomizing mixers (such as `randomize` or `choose`), that in order to randomize *everything* inside them, must pre-mix all their content.

This behaviour may cause some unexpected results.
For instance, a branching mixer within a randomization mixer, will be calculated according to the state of the player when it first reaches the randomizer, and not according to the state when it reaches the branch itself.
If you have a randomizer > repeat > randomizer then the repeat will process an already randomized random mixer, and the repeated units will all be the same.
The solution in this case it to wrap the inner mixer within a [wrapper mixer](#wrapper) (or set the `wrapper` property to true).
This way the randomizer will treat anything within the wrapper as a single unit and will not pre-mix it.

#### Nesting
Mixers may be nested inside each other as much as you like. The following example illustrates a more complex example.
Here, we have an opening and ending element (`firstelem` and `lastelem`).
Between them them we repeat a set of four elements ten times.
The order within the four objects is randomized, so that `elem1` always comes first and the order of the following elements is randomized but `elem3` and `elem4` are wrapped together and therefore always stay consecutive.

```js
API.addSequence([
    // The first element
    firstelem,

    // Repeat the structure inside 10 time (so we get 40 objects overall)
    {
        mixer: 'repeat',
        wrapper:true, // Delay the mixing of these elements until after the `repeat`.
        times: 10,
        data: [
            elem1,

            // Randomize the order of the elements within.
            {
                mixer: 'random',
                data: [
                    elem2,
                    // Keep obj 3 and 4 together.
                    {
                        mixer: 'wrapper',
                        data: [
                            elem3,
                            elem4
                        ]
                    }
                ]
            } // end random
        ]
    }, // end repeat

    // the last element
    lastelem
]);
```

### Mixer types

#### repeat
Repeats the sub-sequence in `data` `times` times.
So that the following mixer:

```js
{mixer:'repeat', times:10, data: [elem1,elem2]}
```

Will be transformed into:

```js
[elem1,elem2,elem1,elem2,elem1,elem2]
```

#### random
Randomizes the order of elements in `data`. Random randomizes the order of all the elements under the random mixer's data array, even if they are inside a mixer. For example, consider the following code:
```js
{
    mixer:'random',
    data: [
        elem1,
        {
            mixer:'repeat',
            times:2,
            data:[
                elem2
            ]
        }
    ]
}
```

It will form one of the following sequences: 

* [elem1,elem2,elem2]
* [elem2,elem1,elem2]
* [elem2,elem2,elem1]

If you want to keep some of the elements in the data together (and not randomized), use the `wrapper` mixer. For instance:

```js
var mixer = {
    mixer:'random',
    data: [
        elem1
        {
            mixer:'wrapper',
            data:[
                elem2,
                elem3,
                elem4
            ]
        }
    ]
}
```
This code will keep elem2, elem3, and elem4 together, in that same order (elem2, elem3, elem4), and will randomly present elem1 before or after these three objects.

You can make any mixer into a wrapper by adding `wrapper:true`. For example: 

```js
var mixer = {
    mixer:'random',
    data: [
        elem1,
        {
            mixer:'repeat',
            times:2,
            wrapper:true,
            data:[
                elem2,
                elem3
            ]
        }
    ]
}
```

This code will results in one of the following sequences:

* [elem1,elem2,elem3,elem2,elem3]
* [elem2,elem3,elem2,elem3,elem1]

If you want to randomize the order of two lists, and randomize the objects within each list but without mixing the two lists together, the following code will do the trick: 
```js
var mixer = {
    mixer:'random',
    data: [
        {
            mixer:'random',
            wrapper:true,
            data:[elem1,elem2]
        },
        {
            mixer:'random',
            wrapper:true,
            data:[elem3,elem4]
        }
    ]
}
```

This code will create one of the following sequences: 

* [elem1,elem2,elem3,elem4]
* [elem1,elem2,elem4,elem3]
* [elem2,elem1,elem3,elem4]
* [elem2,elem1,elem4,elem3]
* [elem3,elem4,elem1,elem2]
* [elem4,elem3,elem1,elem2]
* [elem3,elem4,elem2,elem1]
* [elem4,elem3,elem2,elem1]

Please note that the `random` mixer pre-computes all the content in `data`, so that any branching mixers will be branched according to the state of the study at the time of the randomization. So, if you have a branch that depends on a previous object, make sure that the branch always comes after that object. Again, you can use wrapper:true in a branch (or multiBranch) mixer, if you need to keep the order of some objects fixed for the branching to make sense. 

#### choose
Selects `n` random elements from `data` (by default the chooser picks one element).
* `{mixer:'choose', data: [elem1,elem2]}` pick one of these two objs
* `{mixer:'choose', n:2, data: [elem1,elem2,elem3]}` pick two of these three objs

#### weightedChoose
Chooses `n` random elements from data using a weighted randomize algorithm. Each element in `data` is given the appropriate weight from `weights`. And may be picked once or more. In the following example elem2 has four times the probability of being selected as elem1.

```js
{
    mixer:'weightedChoose',
    n: 2,
    weights: [0.2,0.8],
    data: [elem1,elem2]}
}
```

This code will create one of the following sequences: 

* [elem1,elem1] - 4% of cases
* [elem1,elem2] - 16% of cases
* [elem2,elem1] - 16% of cases
* [elem2,elem2] - 64% of cases

#### weightedRandom
Alias for `weightedChoose`.

#### wrapper
The wrapper mixer serves a sort of parenthesis for the mixer. In case you want to keep a set of elements as a block (when randomizing) simply wrap them and they'll stay together.
* `{mixer:'wrapper', data: [elem1,elem2]}`

#### branch
* `{mixer:'branch', conditions:[cond], data:[elem1,elem2]}`
* `{mixer:'branch', conditions:[cond], data:[elem1,elem2], elseData: [elem3, elem4]}`
Select the elements in `data` if all the conditions in the `conditions` array are true, select the elements in `elseData` if at least one of the conditions in `conditions` are not true. If `elseData` is not defined, or is left empty, then nothing happen in case the conditions are not true (See [conditions](#conditions) to learn about how conditions work).

#### multiBranch
```js
{
    mixer: 'multiBranch',
    branches: [
        {conditions: [],data: []},
        {conditions: [],data: []}
    ],
    elseData: [] // optional
}
```
Find the first object within `branches` for which `conditions` is true, and select the elements in that objects `data`. If no object is selected then select `elseData` (optional). (See [conditions](#conditions) to learn about how conditions work).

### Conditions
The conditional mixers (`branch` & `multiBranch`) allow you to change the content of a list according to [environmental variables](#variables). Each list has specific variables available to it, you can find the relevant details in the documentation for each list, but all lists have access to the `global` and `current` objects, so we'll use them for all examples here.

A condition is a proposition, it is evaluated to either a `true` or `false` value. Conditions are used for decision making within the branching mixers. Conditions are represented by objects. The following condition object `compare`s **global.var** `to` **current.otherVar** and examines if they are equal (if you aren't sure what **global.var** means, see [here](#variables)):

```js
var cond = {
    compare: 'global.myVar',
    to: 'current.myOtherVar'
}
```

Conditions should be treated as a type of equation.

In the `compare` and `to` properties you can set either straight forward values or references to a variable:

```js
//Compares the variable time to the value 12
var cond1 = {
    compare: 'global.time',
    to: '12'
}
//Compare the variable gender to the value 'Female'
var cond2 = {
    compare: 'Female',
    to: 'local.gender'
}
```

When you want to refer to a variable, you use text with dots: `global.var`, `questions.q1.response`; these values will be treated as pointing to variables within the lists context. `questions.q1.response` will retrieve the value of the response for q1 from the questions object.

Here are the condition's possible properties:

Property        | Description
--------------- | -------------------
compare         | The left side of the equation.
to              | The right side of the equation.
operator        | The type of comparison to do (read more about operators [here](#operators)).

In piQuest and piManager, you may want to debug conditions by [activating the DEBUG `conditions` setting](#debugging). When activated, then any condition that is evaluated will be logged to the console.

Advanced users may want to replace the whole condition object with a custom function that returns true or false. The context for the function is an object holding the *global*, *current* and *questions* objects.

```js
function cond(){
    var global = this.global; // get the global from the context
    return global.skip;
}
```


#### Operators
The default comparison for a condition is to check equality (supports comparison of objects and arrays too). You can use the `operator` property to change the comparison method. The following checks if var is greater than otherVar:

```js
var cond = {
    compare: 'global.var',
    to: 'local.otherVar',
    operator: 'greaterThan'
}
```

Operator            | Description
------------------- | -----------------
equals              | This is the default operator. It checks if *compare* is equal to *to* (supports comparison of objects and arrays too)
exactly             | Checks if *compare* is exactly equal to *to* (uses ===)
greaterThan         | *compare* > *to*
greaterThanOrEquals | *compare* >= *to*
in                  | *compare* is in the Array *to*;
function(){}        | This operator allows you to use a custom function of the form: `function(compareValue, toValue, context){return {Boolean}}`. The context is an object holding the *global*, *current* and *questions* objects.

#### Aggregation
Sometimes you will want a branch to be activated only if more than one condition is true, or in some other complex specific condition. For cases like this, the mixer supports aggregation. The mixer supports applying logical operations on conditions in the following way:

An aggregator object has a single property, denoting the type of aggregation, holding an array of conditions to aggregate. The following condition will only be true if `cond1` and `cond2` are both true:

```js
var cond = {and:[cond1, cond2]};
```

The mixer supports several types of aggregators:

Aggregator  | Description
----------- | --------------
and         | If all conditions are true
or          | If at least one condition is true
nor         | If all conditions are false
nand        | If at least one condition is false

By default, if the mixer runs into an array instead of an object, it will treat it as an `and` aggregator and be true only if all conditions within the array are true.

Following are several examples for how to create different aggregations:

```js
// cond1 && cond2
var conds = [cond1, cond2];

// cond1 && (cond2 || cond3)
var conds = [cond1, {or:[cond2,cond3]}];

// (cond1 && cond2) || cond2
var conds = [{or:[{and:[cond1,cond2]},cond3]}]
```
