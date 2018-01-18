# API

- [Settings](#settings)
    - [canvas](#canvas)
    - [injectStyle](#injectstyle)
    - [onPreTask](#onpretask)
    - [onEnd](#onend)
    - [title](#title)
    - [preloadImages](#preloadimages)
    - [skip](#skip)
    - [skin](#skin)
    - [logger](#logger)
- [Tasks](#tasks)
    - [Quest](#quest)
    - [Message](#message)
    - [Post](#post)
- [Inheritance](#inheritance)
- [Custom tasks](#custom-tasks)
    - [Plugging in](#plugging-in)
    - [Activator function](#activator-function)
    - [Custom Task Example](#custom-task-example)
- [Project Implicit Build](#project-implicit-build)
    - [logger.url](#loggerurl)
    - [mTurk](#mturk)

The miManager is responsible for managing several piTasks sequentially. It uses the same API used throughout Minno tasks.

### Settings
Settings allow you to control the generic way that the player works. Change the settings using the `addSettings` function. The first argument to the function is always the name of the setting, the second argument is the setting values. In case the setting is an object, subsequent objects will extend each other so that settings may be progressively added.
All the functions within settings are invoked using angular. This means that you have access to any service you like, as well as some specific assets. [In order to access the services](https://docs.angularjs.org/api/auto/service/$injector) simply use arguments with the appropriate name. For instance, this is how you would access `$rootScope`:

```javascript
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

```javascript
API.addSettings('canvas', {
    fontSize: '2em'
});
```

In case you need to fine tune the styles even further you can add css rules into the raw HTML. Support for dynamically adding CSS is planned but not yet supported.

#### injectStyle
Injects a string of css into the page.

```javascript
API.addSettings('injectStyle', '[pi-quest] label {font-size:1.2em; font-weight:normal;}');
```

#### onPreTask
`onPreTask` is a function to be called before each task is called.

```javascript
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

```javascript
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

```javascript
API.addSettings('title', 'My Manager Title');
```

#### preloadImages
Accepts an array of image urls to preload. The manager will **not** wait until all images are loaded, but it will make images displayed later in the manager sequence be displayed significantly faster.

```javascript
API.addSettings('preloadImages', ['my/image/url/imageName.png', 'my/other/url/otherImage.jpg']);
```

#### skip
Whether to activate the skip and refresh option. If activated, clicking `ctrl r` reloads the current task (this feature may not be supported on older browsers), clicking `escape` and then the right or left arrows skips to the next or previous tasks.

```javascript
API.addSettings('skip', true);
```

#### skin
Add a skin to your project. Skins change the way that your tasks look. Currently the only skins that we support are `simple` and `demo`.

```javascript
API.addSettings('skin', 'demo');
```

### Tasks
The basic unit in miManager is the **task**. The manager currently supports several types of tasks; `quest`, `message` and `post`. You should just cue them into the sequence (you can use mixers to your hearts content as well).

Property    | Description
----------- | -------------
name        | Task name.
type        | Type of task (quest/message).
pre         | A function to invoke before the task (may return a promise).
load        | A function to invoke as soon as the task is loaded (may return a promise).
post        | A function to invoke after the task (may return a promise).
canvas      | A canvas object (as defined under [settings](#canvas)) to invoke at the beginning of the task and remove 
title       | A string to be used as the page title (the name displayed on the tag). It is reset at the end of the task.
preText	    | A template to be expanded before the task
postText    | A template to be expanded after the task

#### quest

Property    | Description
----------- | -------------
script      | The actual script object for the quest task.
scriptUrl   | The url for the quest script.

#### message
Property    | Description
----------- | -------------
template    | the actual html to display as a string.
templateUrl | The url for the message html file.
keys        | Controls the proceed key: either a key (i.e. `'a'`) a keyCode (i.e. `65`) or an array of such (i.e. `['a','b']`).

#### Post
property        | description
--------------- | ------------
url             | The url we intend to post to.
path            | A path within the global to the object that you want to send. For example: `"iat.feedback"` will post the object `feedback` from `global.iat`.
data            | A raw object to be posted to the server. You may use templates in order to construct it.

#### postCsv
This task posts all data gathered by your study as a csv to a given url.

Each log will be logged to a separate row.
Each property will have a separate column.
Each row has a unique column called taskName that holds the appropriate task name.

property        | description
--------------- | ------------
url             | The url we intend to post to.

```javascript
{type:'postCsv', url:'csv.php'}
```

When using this setting, make sure set `logger.url` to `null` in your individual tasks, or else they will attempt to post individually in addition to your csv post.

You may want to use this task in conjection with the csv [simple server](https://github.com/minnojs/simple-minno-server).

### Inheritance
miManager uses the same inheritance system used by miQuest. It has one type of set: the task set. In order to create task sets use `addTasksSet(set, list)`.

### Custom tasks
The miManager allows the creation of custom tasks. The format is fairly simple though you probably need at least some experience with programing for it. 

#### Plugging in
miManager manages the task sequence for you as well as loading the task script (if needed). There are several ways to plug a new task into miManager, the all involve passing the activator function to the manager in various ways.

1. You can pass the activator function as a script.
2. You can pass it as the play property of the script object ().
3. You can set it into the `taskActivateProvider` using `taskActivateProvider.set(taskName, activatorFunction)` during the configuration stage of the angular flow (This is worth the trouble mainly if you intend to use this task many times).

#### Activator function
The activator function is the function that is responsible for the activation of your task as well as for the communication with miManager.

It should:
* Run your task (just do whatever you like).
* Return a function that may be used to force the end of the task.
* Call the `done` function whenever it is done.

The activator function is invoked using [angular dependency injection](https://docs.angularjs.org/guide/di), so you can use any of the angular [annotation](https://docs.angularjs.org/guide/di#dependency-annotation) methods to get dependencies.

The following dependencies are supported (as well as all standard angular services):

Service         | Description
--------------- | -----------
done            | A function that lets the manager know that the task has finished.
props           | An object with all sorts of useful tools.
$scope          | The task scope.
task            | The miManager element that defined this task.
script          | The task script (as defined in task.script or loaded from task.scriptUrl).
$element        | The tasks DOM Node wrapped in jqLite or jQuery.
global          | The global object
$injector       | an angularjs injector (it can allow you to $compile or accesses $rootScope)

#### Custom Task Example
The following script will display a messages to the user and proceed to the next task after 5 seconds:

```javascript
// the define wrapper
define(function(){
    // the script object being returned
    return {
        // custom script content
        content: 'Hi there, I\'m your custom message',

        // the activator function uses three dependencie
        play: function activator(done, script, $element){
            var timeoutId = setTimeout(done, 5000);
            $element.html(script.content);

            // will be called at the end of the task to clean things up
            // (whether the end is forced or triggered by 'done')
            return function clear(){
                clearTimeout(timeoutId);
                $element.empty();           
            };
        }
    };
});
```

In order to use it all you have to do is point the task to the correct url:

```javascript
var taskElement = {scriptUrl:'path/to/script'};
```

### Project Implicit Build

#### logger.url
The project implicit build logs the movement from each task to the next.
By default advancement is logged to `/implicit/PiManager`, if you want to change the default behaviour you should change settings.logger.url.

```javascript
API.addSettings('logger', {
    url: '/my/url'
});
```

#### mTurk
The project implicit build has a feature for integration with mTurk.
All you have to do is add The following code to your project, replacing the `<id#>` tags with the appropriate data of course.
The player will redirect the users back to mTurk immediately after the final task in the manager (as defined by the `last` property).
Setting the `isProduction` property allows you to switch between the development and production urls for mTurk.

```javascript
API.addGlobal({
    $mTurk: {
        assignmentId:'<id#>',
        hitId:'<id#>',
        workerId:'<id#>',
        isProduction: true
    }
});
```
