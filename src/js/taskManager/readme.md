## piManager

The piManager is responsible for managing several piTasks sequentially. It uses the same API used throught the project implicit tasks.

### Settings
Settings allow you to control the generic way that the player works. Change the settings using the `addSettings` function. The first argument to the function is always the name of the setting, the second argument is the setting values. In case the setting is an object, subsequent objects will extend each other so that settings may be progressively added.
All the functions within settings are invoked using angular. This means that you have access to any service you like, as well as some specific asssets. [In order to access the services](https://docs.angularjs.org/api/auto/service/$injector) simply use arguments with the appropriate name. For instance, this is how you would access `$rootScope`:

```js
function onEnd($rootScope){
    $rootScope.$emit('end!!');
}
```

#### canvas
`canvas` takes an object that describes the style of the task environment. Each property of the object changes a different style element.

Property            | Changes
-------             | -----------
background          | The overall background color.
canvasBackground    | Default canvas background color.
fontColor           | Default font color.
fontSize            | Default font size.

In case you need to fine tune the styles even further you can add css rules into the raw HTML. Support for dynamically adding CSS is planned but not yet supported.

#### onPreTask
`onPreTask` is a function to be called before each task is called.

```js
API.addSettings('onPreTask', function(currentTask){
    doSomethingWith(currentTask);
});
```

Asset       | Description
-------     | -----------
currentTask | The current task object
prevTask    | The previous task object (this may be used as a post task action as well...)

#### onEnd
`onEnd` is a function to be called as soon as the task sequence ends.

```js
API.addSettings('onEnd', function(){
    // Do something: for instance, redirect to 'my/url.js'
    location.href = 'my/url.js';
});
```

Asset       | Description
-------     | -----------
currentTask | The current (last) task object

#### title
`title` is a string to be used as the page title (the name displayed on the tag).

#### skip
Whether to activate the skip and refresh option. If activated, clicking `F5` reloads the current task, clicking `escape` and then the right or left arrows skips to the next or previous tasks.

### Tasks
The basic unit in piManager is the **task**. The manager currently suports two types of tasks `quest` and `message`. You should just cue them into the sequence (you can use mixers to your hearts content as well).

Property    | Description
----------- | -------------
name        | Task name.
type        | Type of task (quest/message).
pre         | A function to invoke before the task (may return a promise).
post        | A function to invoke after the task (may return a promise).
canvas      | A canvas object (as defined under [settings](#canvas)) to invoke at the begining of the task and remove 
title       | A string to be used as the page title (the name displayed on the tag). It is reset at the end of the task.

#### Quest

Property    | Description
----------- | -------------
script      | The actual script object for the quest task.
scriptUrl   | The url for the quest script.

#### Message
Property    | Description
----------- | -------------
template    | the actual html to display as a string.
templateUrl | The url for the message html file.
keys        | Controls the proceed key: either a key (i.e. `'a'`) a keyCode (i.e. `65`) or an array of such (i.e. `['a','b']`).


### Inheritance
piManager uses the same inheritance system used by piQuest. It has one type of set: the task set. In order to create task sets use `addTasksSet(set, list)`.