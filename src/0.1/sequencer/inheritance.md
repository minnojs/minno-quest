---
title: Inheritance
description: Setting and controling environmental variables
---

The inheritance system allows you to compose task elements based on previously defined prototypes.

This behavior is often used for the abstraction of tasks; having the behavior of multiple elements defined at a single location. The other typical use, is for different types of randomizations.

We will first cover the creation of prototype sets from which we can inherit. Then we will go over the actual inheritance behavior.

#### Sets
Each element in the PI tasks can inherit its attributes from an element set.

The element sets are defined using the `addSet` functions defined in the [API](API.html). Each element type has its own function (for example, `addQuestionsSets` for piQuest).

Each set holds an array of elements that can later be referred to as prototypes for new elements.

```js
API.addQuestionsSet('likert', [
    {type: 'selectOne', numericValues: true}
]);

API.addQuestionsSet('sizeLikert', [
    {inherit: 'likert', answers: ['Big', 'Medium', 'Small']}
]);
```

Note that the name that you give the set (in the example: *likert* or *sizeLikert*) is the handle that you will later use to refer to it.

#### Inheriting

Inheritance means that we use one element as the prototype, or parent, for another element.

When inheriting an element, the child element starts out with all of the parent's attributes and extends them with its own. This means that we use the parent element as a base and then copy in any properties that the child has, overwriting any existing properties.
One exception to this rule is the `data` objects which we attempt to merge (giving precedence to the child).

Follow this pseudo code:
```js
// The parent page
{
    data: {name: 'jhon', family:'doe'}
    questions: [
        quest1,
        quest2
    ]
}

// The child page which attempts to inherit the parent
{
    inherit: 'parent',
    data: {name: 'jack'}
    questions: [
        quest3
    ]
}

// The result would be:
{
    // the child kept its own name but inherited the family name
    data: {name: 'jack', family:'doe'}
    // the questions array was completely overwritten
    questions: [                          
        quest3
    ]
}
```

In order for an element to inherit another element it must use the `inherit` property. `inherit` takes an object or a string, with instructions for which element to inherit. If a string is used, the sequencer treats it as if it was a set name, and picks a random element from within that set.

```js
{
    inherit: {set:'mySetName', type:'random'}
}
```

property        | description
--------------- | ---------------------
set             | The name of the set from which we want to inherit.
type            | The inheritance type - essentially how to pick from within the set (random by default, see [docs](#type)).
merge           | An array of property names that we want to merge instead of overwrite (see [docs](#merge)).
seed            | The randomization seed (see [docs](#seed)).
repeat          | Repeat the result of the last randomization (see [docs](#repeat)).
customize       | A function that can customize the element before it is used. This is an option only for advanced users, use this only if you really know what you are doing (seed [docs](#customization))

#### Merge
By default, inheritance overwrites each property of the parent that the child already has. In order to change this behavior, you can add property names to the `merge` array, and the sequencer will attempt to merge the data from the parent into the child.
This can look something like this:
```js
// The parent page
{    
    set: 'parent'
    stimuli: [
        stim1        
    ]
}

// The child page which attempts to inherit the parent
{
    inherit: {set:'parent', merge:['stimuli']},    
    stimuli: [
        stim2
    ]
}

// The result would be:
{
    // the stimuli array was merged instead of overwritten
    stimuli: [                          
        stim1,
        stim2
    ]
}
```

#### Type
We have implemented several types of inheritance:

##### random:
Randomly selects an element from the set (in case the set has only one element, the same element will always be selected, of course). 
* `'setName'`
* `{set: 'setName'}`
* `{set: 'setName', type:'random'}`

This is the default inheritance type, so it is not obligatory to use the `type` property. You can also use a short cut and set the `set` using only its name, like we did in the example above

##### exRandom:
Selects a random element without repeating the same element until we've gone through the whole set
* `{set: 'setName', type:'exRandom'}`

##### sequential:
Selects the elements by the order they were inserted into the set
* `{set: 'setName', type:'sequential'}`

##### byData:
Selects a specific element from the set.
We compare the `data` property to the `element.data` property and if `data` is a subset of `element.data` it selects the element (this means that if all properties of data property equal to the properties of the same name in element.data it is a fit).
This function will select only the first element to fit the data.
If the data property is set as a string, we assume it refers to the element handle.

* `{set: 'setName', type: 'byData', data: {block:1, row:2}}` picks the element with both block:1 and row:2
* `{set: 'setName', type: 'byData', data: "myStimHandle"}` picks the element that has the "myStimHandle" handle

##### function:
You may also use a custom function to select your element (the function here, fully replaces the inherit object).
```js
function(collection){
    // The collection holds all the elements within the namespace you are querying.
    // Simply return the element you want to inherit.
}
```

#### Seed

The inheritance systems uses seeds to keep track of consecutive calls to the different types of inheritance. If you want to have parallel groups of inheritance to the same set, you can use seeds.
Each inheritance query automatically gets assigned to a "seed" that is used to track its progress. For example, the seed is used to keep track of the current element in the `sequential` type inheritance.
Most of the time, the seed is transparent to the user, but sometimes it becomes useful to have manual control over the inheritance seed. For instance, if you want to reset an `exRandom` inheritance - simply use `exRandom` with a new seed. Same goes if you want to keep two instances of a `sequential` inheritance.

In the following example, both elements inherit exRandomly from the trials set. But the second element restarts the randomization.
```js
[
    {
        inherit: {set:'trials', type:'exRandom',seed:'block1'}
    },
    {
        inherit: {set:'trials', type:'exRandom',seed:'block2'}
    }
]

```

Seeds are not confined to a specific set, and not even to a specific element type. Maybe a more interesting use, is to use the same seed across two different sets (you can see a real world application for this under the [repeat](#repeat) option).
It is important to take note that if you create custom seeds, it is your responsibility that they query sets of the same length. If you try to inherit two sets with different lengths the sequencer will throw an error.
In order to create a new seed all you have to do is set the `seed` property with the new seeds name (String).

#### Repeat
Sometimes we have need to repeat a previous choice done by the inheritance picker (especially in cases of randomization). In order to do this, all you have to do is set the `repeat` property to true.

For instance, the following sequence will display a random element from the trials set twice.
```js
[
    {
        inherit:{set:'trials',type:'random'}
    },
    {
        inherit:{set:'trials',type:'random', repeat:true}
    }
]
```

The `repeat` property can used within any type of randomization. We've seen a simple use, but its true power comes when combined with [seeds](#seeds).

The following example uses the same exRandom seed to pick a both a trial and the two stimuli associated with it (the n<sup>th</sup> element in trials is always associated with the n<sup>th</sup> elements of stimuli-1 and stimuli-2).

```js
[
    {
        inherit: {set:'trials', type:'exRandom', seed:'mySeed'}
        stimuli:[
            {inherit: {set:'stimuli-1', type:'exRandom', seed:'mySeed', repeat:true}
            {inherit: {set:'stimuli-2', type:'exRandom', seed:'mySeed', repeat:true}
        ]
    }
]
```

#### Customization

Each element can also define a `customize` method, this method is called once the element is inherited but before it is activated.
It accepts two argument: the source element on which it is called, and the global object (in which you can find the current object etc.). The source element is also the context for the function.
You should make any changes that you want on the source element itself.

```js
{    
    inherit: 'mySet',
    customize : function(element, global){
        element.questions.push(quest);
    }
}
```
