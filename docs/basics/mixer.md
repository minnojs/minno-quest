# Mixers

- [Introduction](#introduction)
  - [Syntax](#syntax)
  - [Nesting](#nesting)
  - [Real time (remix)](#real-time-remix)
  - [Sequence evaluation (wrapper)](#sequence-evaluation-wrapper)
- [Mixer types](#mixer-types)
  - [repeat](#repeat)
  - [random](#random)
  - [choose](#choose)
  - [weightedChoose](#weightedchoose)
  - [weightedRandom](#weightedrandom)
  - [wrapper](#wrapper)
  - [branch](#branch)
  - [multiBranch](#multibranch)
- [Conditions](#conditions)
  - [Operators](#operators)
  - [Negation](#negation)
  - [Aggregation](#aggregation)
  - [Debugging](#debugging)

### Introduction
Mixers allow you to control the flow of your sequences within the PI tasks.
In particular they allow you to repeat, randomize and even branch sections of your sequence according to [environmental variables](./variables.html).

#### Syntax
Each one of the PI tasks is composed of a sequence of elements that is presented sequentially.
For example, the sequence in miManager is composed of elements that each represent a task.
These sequences are created using the `API.addSequence` method in your script.
Mixers are inserted into the sequence the same way that regular elements are. 
Each mixer represents a sub-sequence that is to be manipulated and then inserted in its place.

For example, in the following sequence the second element is a mixer.
It takes a sub-sequence than includes tasks two and three and randomizes their order.
Note that the mixer element is effectively replaced by the two elements from the sub-sequence, turning this sequence into a four task sequence.

```javascript
// The task sequence
API.addSequence([
    // First Element: task 1
    {type:'message', template: 'Task 2', keys: ' '},

    // Second Element: the mixer (task 2 and 3 randomized)
    {
        mixer: 'random',
        data: [
            {type:'message', template: 'Task 2', keys: ' '},
            {type:'message', template: 'Task 3', keys: ' '}
        ]
    },

    // Third Element: task 4
    {type:'message', template: 'Task 4', keys: ' '}
]);
```

Each mixer has a type associated with it as well as at least one sub-sequence.
The `mixer` property always holds the mixer type (see below for the available types).
In most cases the `data` property holds the sub-sequence (the exception is with the branching mixers that may hold multiple sub-sequences).

A typical mixer looks something like this: 

```javascript
{
    mixer: 'random',     // <== The mixer type (randomize in this case)
    data: [elem1, elem2]    // <== The sub-sequence (holding elem1 and elem2)
}
```

From now on, instead of explicitly writing in the mixed elements we will use arbitrary variable names instead, such as `elem1` and `elem2`. 
We are doing this to keep the structures as simple and readable as possible.

#### Nesting
Mixers may be nested inside each other as much as you like. The following example illustrates a more complex example.
Here, we have an opening and ending element (`firstelem` and `lastelem`).
Between them we repeat a set of four elements ten times.
The order within the four objects is randomized, so that `elem1` always comes first and the order of the following elements is randomized but `elem3` and `elem4` are wrapped together and therefore always stay consecutive.

```javascript
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

#### Real time (remix)
[remix]: #real-time-remix

By default each mixer is processed only once, when it is first encountered during the sequence. 
There are only two conditions for when this is relevant.
The first is when your task allows moving back to previous elements; in that case the mixer will keep the mixer elements as they where previously evaluated.
The second condition is when you have a branch that you want to react to live changes (at this time this is relevant only for miQuest answers).

If you want a mixer to react to changes in the environment you need to set `remix=true`.

The following snippet uses `remix` to show a second question depending on the response of the first one (in miQuest).

```javascript
var page = {
    questions: [
        // First question
        {
            name: 'q1,
            stem: 'Please write "hello"'
        },

        // The mixer
        {
            mixer: 'branch',
            remix: true,
            conditions: [ {compare: 'current.questions.q1', to: 'hello'} ],
            data: [
                // Dependent question
                {
                    stem: 'You said "hello"!'
                } 
            ]
        }
    ]
}
```

#### Sequence evaluation (wrapper)
[evaluation]: #sequence-evaluation-wrapper

Most of the time, mixers are lazily processed. 
This means that the sequencer waits until it reaches the mixer before expanding it.
This behaviour allows us to use branching mixers - we don't decide which branch to take until we reach it.
The exception to this rule is randomizing mixers (such as `randomize` or `choose`), that in order to randomize *everything* inside them, must pre-mix all their content.

This behaviour may cause some problematic results.
For instance, a branching mixer within a randomization mixer, will be calculated according to the state of the task when it first reaches the randomizer, and not according to the state when it reaches the branch itself.
If you have a randomizer > repeat > randomizer then the repeat will process an already randomized random mixer, and the repeated units will all be the same.
The solution in this case is to wrap the inner mixer within a [wrapper mixer](#wrapper) (or set the `wrapper` property to true).
This way the randomizer will treat anything within the wrapper as a single unit and will not pre-mix it.

Random randomizes the order of all the elements under the random mixer's data array, even if they are inside a mixer. 
For example, consider the following code:

```javascript
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

```javascript
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

Sometimes you may want to make a mixer be a `wrapper` enen though it is already another kind of mixer.
You can do that by adding `wrapper:true`. For example: 

```javascript
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
```javascript
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

The following snippet uses the wrapper property to keep the content of the repeat mixer together.
@TODO: find a good example for the use of wrappers.
```javascript
{
    mixer: 'random',
    data: [
        elem1,
        {
            mixer: 'repeat',
            times: 2,
            wrapper: true,
            data: [elem2]
        }
    ]
}
```

### Mixer types

#### repeat
Repeats the sub-sequence in `data` `times` times.
So that the following mixer:

```javascript
{
    mixer:'repeat', 
    times:3, 
    data: [elem1,elem2]
}
```

Will be transformed into:

* [elem1,elem2,elem1,elem2,elem1,elem2]

#### random
Randomizes the order of elements in `data`. 
So that the following mixer:

```javascript
{
    mixer:'random',
    data:[elem1,elem2]
}
```

Will be transformed into one of the following:

* [elem1, elem2]
* [elem2, elem1]

Please note that the `random` mixer pre-mixes all the content in `data`, please see [sequence evaluation](#evaluation) and the [wrapper mixer](#wrapper) for more details and related problems.

#### choose
Choose one or more (`n`) elements out of `data`.
By default, `choose` picks a single element form the `data` subsequence:

```javascript
{
    mixer:'choose',
    data: [elem1, elem2, elem3]
}
```

Will be transformed into one of the following:

* [elem1]
* [elem2]
* [elem3]

You can choose more than one element by setting `n`:

```javascript
{
    mixer:'choose',
    n: 2,
    data: [elem1, elem2, elem3]
}
```

That will return one of the following:
* [elem1, elem2]
* [elem1, elem3]
* [elem2, elem3]

#### weightedChoose
Choose one or more (`n`) elements out of `data`. Using a weighted random algorithm.
Each element in `data` is given the appropriate weight from `weights`.
`weightedChoose` does inclusive randomization. This means that elements may be picked more than once.

In the following example elem2 has four times the probability of being selected as elem1;

```javascript
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
Alias (synonym) that can be used interchangeably with [`weightedChoose`](#weightedChoose).

#### wrapper
The wrapper mixer serves a sort of parenthesis for the mixer.
It is used to keep a sub-sequence of elements to be randomized within one of the randomizing mixers (such as [random](#random) or [choose](#choose)).
In case you want to keep a sub-sequence as a block (when randomizing) simply wrap them and they'll stay together.
You can find more use cases in the [sequence evaluation](#evaluation) section.

The following snippet uses a wrapper to keep two elements together despite a being in a randomizer;

```javascript
{
    mixer: 'random',
    data: [
        elem1,
        {
            mixer: 'wrapper',
            data: [elem2, elem3]
        }
    ]
}
```

It will return one of the following (elem2 and elem3 are always kept together):

* [elem1, elem2, elem3]
* [elem2, elem3, elem1]

The wrapper mixer is special in that it has an alternative syntax.
You can add a `wrapper` property to any existing mixer, and it contents will be treated as if they were wrapped in a wrapper.
This will look like this:

```javascript
{
    mixer:'repeat',
    time:10,
    wrapper:true,
    data: [elem1]
}
```

#### branch
The branch mixer allows you to choose the flow of your sequence according to environmental conditions.
You can learn about environmental conditions [here](./variables.html) and about how to create conditions [here](#conditions).
This section will deal only with the stucture and use of the `branch` mixer itself.

The branch mixer evaluates the `conditions` if they are true it returns the sequence in `data`, if they are false it returns the sequence in `elseData`.
If `elseData` is not defined, or is left empty, then nothing happen in case the conditions are not true (see [conditions](#conditions) to learn more about how conditions work).

The following mixer:

```javascript
{
    mixer:'branch',
    conditions:[cond],
    data:[elem1,elem2],
    elseData:[elem3,elem4] // optional
}
```

Will return

* [elem1,elem2] - if the condition is true
* [elem3,elem4] - if the condition is false

#### multiBranch
`multiBranch` is similar to the [`branch`](#branch) mixer, only it allows you to switch between a list of conditions instead of only one.
The mixer will attempt to find the first object within the `branches` array for which `conditions` is true, and select the sub-sequence in that objects `data`.
If no object is selected then select the sub-sequence in `elseData`.

```javascript
{
    mixer: 'multiBranch',
    branches: [
        {conditions: [cond1],data: [elem1]},
        {conditions: [cond2],data: [elem2]}
    ],
    elseData: [elem3] // optional
}
```

Will return

* [elem1] - if cond1 is true
* [elem2] - if cond2 is true (but not cond1)
* [elem3] - if both cond1 and cond2 are false

#### custom
`custom` allows you to create arbitrary sub-sequences.
It uses the sub-sequence that is returned from the `fn` function.
`fn` must return an array of elements.

`fn` has two arguments available: the mixer object itself, and the mixer context (as defined [here](./variables.html)).
You can either use them to create your elments or create elements arbitrarily.

```javascript
{
    mixer: 'custom',
    prop: 'Custom property'
    fn: function(obj, context){
        return [elem1, elem2]
    }
}
```

### Conditions
The conditional mixers ([`branch`](#branch) & [`multiBranch`](#multibranch)) allow you to change the content of your sequence depending on [environmental variables](./variables.html). 
This is done by settings `conditions`.
A condition is a statement that is evaluated either as `true` or `false`.
We choose the branch we advance to according to the result.
You can think of each condition as an equation that compares two values.
Conditions are each represented by an object as follows:

Property        | Description
--------------- | -------------------
compare         | The left side of the equation.
to              | The right side of the equation.
operator        | The type of comparison to do (defaults to 'equals'. Read more about operators [here](#operators)).

The values set into `compare` and `to` can be set either as plain values or as references to environmental variables:
When you want to reference an environmental variable, you use text with dots: `global.var`, `questions.q1.response`
(questions.q1.response` will retrieve the value of the response for q1 from the questions object).

The following condition object compare's **global.var** `to` **current.otherVar** and checks if they are equal.
It is equivalent to the following equation: `global.myVar === current.myOtherVar`.

```javascript
var cond = {
    compare: 'global.myVar',
    to: 'current.myOtherVar'
}
```

Here are some examples of comparing variables with plain values:

```javascript
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

Sometimes the standard conditions are not enough.
More advanced users may want to replace the whole condition object with a custom function that returns true or false. 
The context (`this`) for the function is an object holding the *global* and *current* objects 
(there are some cases where additional properties are available, they are documented in their own docs).

```javascript
function cond(){
    var global = this.global; // get the global from the context
    return global.skip;
}
```


#### Operators
The default comparison for a condition is to check equality (supports comparison of objects and arrays too). You can use the `operator` property to change the comparison method. The following checks if var is greater than otherVar:

```javascript
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
lesserThan          | *compare* < *to*
lesserThanOrEquals  | *compare* <= *to*
in                  | *compare* is in the Array *to*;
isTruthy            | *compare* == true
function(){}        | This operator allows you to use a custom function of the form: `function(compareValue, toValue, context){return {Boolean}}`. The context is an object holding the *global*, *current* and *questions* objects.

#### Negation
If you want to check for inequality (or make sure that a value is *not* in an array and so on, you can use the `negate` property.
`negate` makes the mixer use the oposite value for that condition - true values become false and vice versa.

```javascript
var cond = {
    compare:'global.flag',
    to:'current.flag',
    negate:true
};
```

#### Aggregation
Sometimes you will want a branch to be activated only if more than one condition is true, or in some other complex specific condition.
For cases like this, the mixer supports aggregation.
The mixer supports applying logical operations on conditions in the following way:

An aggregator object has a single property, denoting the type of aggregation, holding an array of conditions to aggregate.
The following condition will only be true if `cond1` and `cond2` are both true:

```javascript
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

```javascript
// cond1 && cond2
var conds = [cond1, cond2];

// cond1 && (cond2 || cond3)
var conds = [cond1, {or:[cond2,cond3]}];

// (cond1 && cond2) || cond2
var conds = [{or:[{and:[cond1,cond2]},cond3]}]
```
#### Debugging
Conditions are notoriously difficult to get just right.
If they aren't working as you expected, you might want to see exactly which values you are getting for each of your conditions.
The mixer provides you with an easy way to do this. Just set `DEBUG=true` on your condition, and you will see all the said values being printed into your [console](../basics/javascript.html#errors-and-debugging).

```javascript
API.addGlobal({
    value: 123,
    otherVar: 345
});

var cond = {
    compare: 'global.var',
    to: 'global.otherVar',
    DEBUG: true
}
```

The debugger will log something like `Conditions: 123 equals 345` as well as the full condition object as it appears in your code.
