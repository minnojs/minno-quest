# Introduction

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Mixers](#mixers)
- [Inheritance](#inheritance)
- [Templates](#templates)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

The sequencer is an overarching term for all of the features that allow you to dynamically change the flow of your tasks.
It has three critical components: The mixer, templating and inheritance.

Throughout the sequencer documentation we will use [messages](../manager/messages.html) as examples because they are the simplest element type.

### Mixers

Each PI task is composed of a series of elements which are presented to the users sequentially 
(i.e. trials for miTime, pages for miQuest and tasks for miManager). 
The sequence [**mixer**](./mixer.html) is responsible for the order  that these elements are presented to the users. 
It allows you to randomize the order of your elements.
It also allows you to repeat a task multiple times and randomly assign participants to experimental conditions.

For example, the following mixer randomizes the order of two tasks in *miManager*:

```javascript
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
The element is the basic unit that is used across all tasks.
You can use the [inheritance](./inheritance.html) system in order to compose elements and base themselves one upon another, as well as grouping them into distinct sets.
This is useful both as a tool to improve the readability of you scripts (for instance keep code away from structure), and to allow another level of randomization and control.

The following is an example of inheritance that improves the readability of a task sequence.
It uses a message defined within the "simpleMessage" `set` as the base for the element within the sequence.
This allows the sequence to be less cluttered, and thus more readable.

```javascript
API.addTasksSet('simpleMessage', [
    {type:'message', template: 'Task 1', keys: ' '}
]);

API.addSequence([
    {inherit: 'simpleMessage'}
]);
```

### Templates
Finally you have fine control down to the level of individual element properties using [templates](./templates.html). 
Templates allow you to use [Environmental Variables](./variables.html) in order to customize you elements.

The following code will display a message that says "Hello Randall Munroe".

```javascript
API.addCurrent({userName: 'Randall Munroe'});

API.addSequence([
    {type:'message', template: 'Hello <%= current.userName %>', keys: ' '}
]);
```
