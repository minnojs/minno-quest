---
title: Overview
description: Getting to know the sequencer
---

The sequencer is an overarching term for all of the features that allow you to dynamically change the flow of your tasks.
It has three critical components: The mixer, templating and inheritance.

### Mixers

Each PI task is composed of a series of elements sequentially activated and presented to the users (these are trials for piPlayer, pages for piQuest and tasks for piManager). 
The sequence [**mixer**](./mixer.html) is responsible for the order  that these elements are presented to the users, 
it allows you to randomize the order of you elements as well as repeating them and branching the flow according to different conditions.

For example, the following mixer randomizes the order of two tasks in *piManager*:

```js
API.addSequence([
    {
        mixer: 'randomize',
        data: [
            {type:'message', template: 'Task 1', keys: ' '},
            {type:'message', template: 'Task 2', keys: ' '}
        ]
    }
]);
```

### Inheritance
The basic unit that is used across all players is the element. 
You can use the [inheritance](#inheritance) system in order to compose elements and base them one upon another, as well as grouping them into distinct sets.
This is useful both as a tool to improve the readability of you scripts (for instance keep code away from stucture), and to allow another level of randomiziation and control.

Following is an example of inheritance that improves the readability of a task sequence (real world examples are of course more complex...).

```js
API.addTasksSet('simpleMessage', [
    {type:'message', template: 'Task 1', keys: ' '}
]);

API.addSequence([
    {inherit: 'message'}
]);
```

### Templates
Finally you may have fine control down to the level of an element property using [templates](#templates). 
Templates allow you to use [Environmental Variables](./variables.html) as values within your elements.

```js
API.addCurrent({userName: 'Randall Munroe'});

API.addSequence([
    {type:'message', template: 'Hello <%= current.userName %>', keys: ' '}
]);
```
