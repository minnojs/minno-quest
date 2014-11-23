## piManager

The piManager is responsible for managing several piTasks sequentially. It uses the same API used throught the project implicit tasks.

### Tasks
The basic unit in piManager is the **task**. The manager currently suports two types of tasks `quest` and `message`. You should just cue them into the sequence (you can use mixers to your hearts content as well).

Property    | Description
----------- | -------------
name        | Task name.
type        | Type of task (quest/message).
pre         | A function to invoke before the task (may return a promise).
post        | A function to invoke after the task (may return a promise).

##### Quest

Property    | Description
----------- | -------------
script      | The actual script object for the quest task.
scriptUrl   | The url for the quest script.

##### Message
Property    | Description
----------- | -------------
template    | the actual html to display as a string.
templateUrl | The url for the message html file.
keys        | Controls the proceed key: either a key (i.e. `'a'`) a keyCode (i.e. `65`) or an array of such (i.e. `['a','b']`).

### Settings
Settings allow you to control the generic way that the player works. Change the settings using the `addSettings` function. The first argument to the function is always the name of the setting, the second argument is the setting values. In case the setting is an object, subsequent objects will extend each other so that settings may be progressively added.
All the functions within settings are invoked using angular. This means that you have access to any service you like, as well as some specific asssets. [In order to access the services](https://docs.angularjs.org/api/auto/service/$injector) simply use arguments with the appropriate name. For instance, this is how you would access `$rootScope`:

```js
function onEnd($rootScope){
    $rootScope.$emit('end!!');
}
```

##### onPreTask
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

##### onEnd
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

### Inheritance
piManager uses the same inheritance system used by piQuest. It has one type of set: the task set. In order to create task sets use `addTasksSet(set, list)`.