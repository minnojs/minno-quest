# Inheritance

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Syntax](#syntax)
- [Sets](#sets)
- [Merging](#merging)
- [Type](#type)
  - [random:](#random)
  - [exRandom:](#exrandom)
  - [sequential:](#sequential)
  - [byData:](#bydata)
- [Seed](#seed)
- [Repeat](#repeat)
- [Customize](#customize)
- [Do your own thing](#do-your-own-thing)
- [Real time (reinflate)](#real-time-reinflate)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


### Overview
The inheritance system allows you to compose task elements based on previously defined prototypes. 
It has many different uses.
It is often used for the abstraction of tasks; having the behavior of multiple elements defined at a single location.
Another typical use, is for advanced randomization that is not simple to achieve using the [mixer](mixer.html#radom).
And finally it is used as a way to keep your scripts more readable.

The process of inheritance involves picking an element from a set, resolving that element and finally extending the inheriting element with the properties of the inherited element.
For the purpose of clarity we will use the the word *parent* to describe the inherited element, and the word *child* to the describe the inheriting element.jk

The first stage in the process of inheritance is picking the parent element.
This is done by choosing an [element `set`](#sets),
the particular element to be inherited will then be chosen according to the [inheritance type](#types) which is [random](#random) by default.
Finaly, the parent element is [merged](#merging) into the the child element.

### Syntax

In order for an element to inherit another element you should use the `inherit` property.
Inherit` takes either an object or a string, with instructions for which element to inherit. 

The following element uses an object to inherit.

```javascript
{
    inherit: {set:'setName', type:'exRandom'}
}
```

Using a string instead, affords a usefull shortcut to the same end.
If a string is used, the sequencer treats it as if it was a set name, and picks a random element from within that set.
So `{inherit: 'setName'}` is eqivalent to `{inherit: {set: 'setName', type: 'random'}`.
This option is particularly useful when you use a set with only one element and want to pick it.

Note that you cannot use [templates](templates.html) for the `inherit` property.
The reason for this is that when processing elements the sequencer first resolves the inheritance, and only then runs the templates.

Following is a table describing the various properites of the inherit object.

property        | description
--------------- | ---------------------
set             | (String) The name of the [set](#sets) from which we want to inherit.
type            | (String) The inheritance [type](#types) - essentially how to pick from within the set (random by default).
merge           | (Array) An array of property names that we want to [merge](#merge) instead of overwrite.
seed            | (String) The randomization [seed](#seed).
repeat          | (true|false) [Repeat](#repeat) the result of the last randomization.
customize       | (Function) A function that can [customize](#customization) the element before it is used. 

### Sets
In order to inherit an element it must be part of a `set`.
Simply put, `sets` are lists (arrays) of elements, with a name.
They are used both as a name for an element to inherit, and as a way to group several elements together.

`sets` are defined using the `add<elementType>Sets` functions defined in the [API](../basic/API.html).
Each element type has its own function (for example, `addQuestionsSets` for miQuest).

```javascript
API.addQuestionsSet('likert', [
    {type: 'selectOne', numericValues: true}
]);

API.addQuestionsSet('sizeLikert', [
    {inherit: 'likert', answers: ['Big', 'Medium', 'Small']}
]);
```

Note that the name that you give the set (in the example: *likert* or *sizeLikert*) is the name that you will later use to refer to it.

### Merging
The process of inheritance involves copying all properities from the parent element to the child.
By default, any property that already exists in the child, doe not get copied over (this behaviour can be changed by using the `merge` property - see below).
The exception to this rule is the `data` objects which we merge (again, giving precedence to the child).

Follow this pseudo code:
```javascript
// The parent element
{
    data: {name: 'jhon', family:'doe'}
    questions: [
        quest1,
        quest2
    ]
}

// The child element which attempts to inherit the parent
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

By default, inheritance ignores the properties that the child already has.
Sometimes, you have proprties of the child that you'd like to extend instead of just keeping as is (for example: a list of stimuli in miTime).
In order to do this, you can set an array of property names to the `merge` property.
Any property that appears in this array will be extended instead of skipped.

This can look something like this:
```javascript
// The parent element
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

### Type
After picking a set to inherit, the inheritance type determines how to pick an element from within the set. 
By default a [random](#random) element is chosen.

#### random:
Randomly selects an element from the set (in case the set has only one element, the same element will always be selected, of course). 
* `'setName'`
* `{set: 'setName'}`
* `{set: 'setName', type:'random'}`

This is the default inheritance type, so it is not obligatory to use the `type` property. You can also use a short cut and set the `set` using only its name, like we did in the example above

#### exRandom:
Selects a random element without repeating the same element until we've gone through the whole set
* `{set: 'setName', type:'exRandom'}`

#### sequential:
Selects the elements by the order they were inserted into the set
* `{set: 'setName', type:'sequential'}`

#### byData:
Selects a specific element from the set.
We compare the `data` property to the `element.data` property and if `data` is a subset of `element.data` it selects the element (this means that if all properties of data property equal to the properties of the same name in element.data it is a fit).
This function will select only the first element to fit the data.
If the data property is set as a string, we assume it refers to the element handle.

* `{set: 'setName', type: 'byData', data: {block:1, row:2}}` picks the element with both block:1 and row:2
* `{set: 'setName', type: 'byData', data: "myStimHandle"}` picks the element that has the "myStimHandle" handle

### Seed
Some of the inheritance types keep track of consecutive calls.
For instance [`sequential`](#sequential) presents the elements in a set one after the other.
It needs to keep track of its place within the list.

The inheritance system uses seeds to keep track of consecutive calls to the different types of inheritance.
Each inheritance query automatically gets assigned to a "seed" that is used to track its progress.
For example, the seed is used to keep track of the current element in the `sequential` type inheritance.
Most of the time, the seed is transparent to the user, but sometimes it becomes useful to have manual control over the inheritance seed.
For instance, if you want to reset an `exRandom` inheritance - simply use `exRandom` with a new seed, the same goes if you want to keep two instances of a `sequential` inheritance.
If you want to have parallel groups of inheritance to the same set, you can use seeds.

In the following example, both elements inherit exRandomly from the "trials" set. But the second element restarts the randomization.
```javascript
[
    {
        inherit: {set:'trials', type:'exRandom',seed:'block1'}
    },
    {
        inherit: {set:'trials', type:'exRandom',seed:'block2'}
    }
]

```

Seeds are not confined to a specific set, and not even to a specific element type.
A more interesting use, is to use the same seed across two different sets (you can see a real world application for this under the [repeat](#repeat) option).
It is important to take note that if you create custom seeds, it is your responsibility that they query sets of the same length.
If you try to inherit two sets with different lengths the sequencer will throw an error.
In order to create a new seed all you have to do is set the `seed` property with the new seeds name (String).

### Repeat
Sometimes we have need to repeat a previous choice done by the inheritance picker (especially in cases of randomization).
In order to do this, all you have to do is set the `repeat` property to true.

For instance, the following sequence will display a random element from the trials set twice.

```javascript
[
    {
        inherit:{set:'trials',type:'random'}
    },
    {
        inherit:{set:'trials',type:'random', repeat:true}
    }
]
```

The `repeat` property can used within any type of randomization.
We've seen a simple use, but its true power comes when combined with [seeds](#seeds).

The following example uses an exRandom `seed` to pick both a trial and the two stimuli associated with it 
(the n<sup>th</sup> element in trials is always associated with the n<sup>th</sup> elements of stimuli-1 and stimuli-2).

```javascript
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

### Customize
This is an option only for advanced users, use this only if you really know what you are doing.

Each element can define a `customize` method, this method is called after the element is inherited but before it is activated.
It accepts two argument: the source element on which it is called, and the [global object](variables.html#global) (in which you can find the current object etc.).
The source element is also the context (this) for the function.
You should make any changes that you want on the source element itself.

```javascript
{    
    inherit: 'mySet',
    customize : function(element, global){
        element.questions.push(quest);
    }
}
```

### Do your own thing
This is an option only for advanced users, use this only if you really know what you are doing.

You may also use a custom function to select an element to inherit.
The function takes a single argument: an array that holds all elements in all sets.
Each element within the array has its set name set into it automatically.
The function should return an element that will be used as the parent for the inheritance.
If it has an `inherit` property then the inheritance cascade will continue.

The following function will randomly choose an element from one of two sets: 'setOne' or 'setTwo'
(for reasons of brefity this snippet users ES5, if you need to support legacy browsers, you can find other ways to achieve the same thing).

```javascript
// setup the inheriting function
function seek(collection){
    var elements = collection.filter(function(elm){
        return elm.set == 'setOne' || elm.set == 'setTwo'; 
    });

    var randomIndex = Math.floor(elements.length * Math.random());

    return elements[randomIndex];
}

// and then:
{inherit: seek}
```

You can use this option in order to create custom elements as well.
Instead of returning an element from within the element collection, you can return an element of your own.

The following function will show the string 'Question number 1', and increment it by 1 each time that it is called.

```javascript
var i = 1;

function count(){
    return {stem: 'Question number ' + i};
}

// and then:
{inherit: count}
```

### Real time (reinflate)
It is possible to run into elements multiple times,
this is possible either when you have a task that allows going back to previous elements,
or when you have a task that reloads the current elements for some reason.
By default each element is processed only once, when it is first encountered during the sequence. 
If you want to re-inherit an element when it is re-encountered, you should set `reinflate`.
