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
    - [rtl](#rtl)
    - [logger](#logger)
    - [DEBUG](#debug)
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

### rtl
Setting rtl to `true` will change the layout of the player to right to left in order to ocomodate right to left languages such as arabic and hebrew.

```javascript
API.addSettings('rtl', true);
```

#### logger
The logger allows control of logging activities.

Folowing are the properties available for the logger:

property    | description 
----------- | -----------
url         | The url to send to. If it is not set, data will not be sent.
type        | The strategy to use for sending logs to the server. See options below.
pulse       | Allows you to post your data in pulses of "pulse" logs instead of all at the end of the task (Does not work for csv logger).

```javascript
API.addSettings('logger', {
    url: '/manager/data',
    type:'new',
    pulse: 20
});
```

By deafault the logger posts according to the Project Implicit server rules (old).
You can change the logging style by setting the logger `type` as follows:

type    | description
------- | -----------
old     | Uses the post strategy implemented by the old PI server
new     | Uses the post strategy implemented by the new server  
csv     | Posts all data as CSV at the end of the manager. If you are creating a manager that does not fully complete (for instance, when you have a message as your last page), use the postCSV task in addition to settings the log type to csv.
debug   | Logs all posts to the console. Do not do this in production! These logs aren't posted to the server at all!

You can change the logging strategy or even create new strategies.
Doing this is rather advanced and is documented [here](https://github.com/minnojs/minno-quest/blob/0.2/src/taskManager/logger/readme.md).

#### DEBUG
The `DEBUG` settings allows you to control the debug messages produced by the player.
In the development environment (when `window.DEBUG` is set to `true`) you have access to a development console.
The console will hold messages describing the process of your studies.

At the top of the console window you will see a dropdown that allows you to select the level of logging you would like to see.
For example, you may want to be alerted only of errors, or of every possible activity of the player.
In addition you have a button that allows you to close and open the console.

Property    | Description
----------- | -------------
hideConsole | (true or false) hide console activity

```javascript
API.addSettings('DEBUG', { hideConsole: true});
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
current     | An object that will be merged into the task `current` object.

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

#### Post
property        | description
--------------- | ------------
url             | The url we intend to post to.
path            | A path within the global to the object that you want to send. For example: `"iat.feedback"` will post the object `feedback` from `global.iat`.
data            | A raw object to be posted to the server. You may use templates in order to construct it.

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
