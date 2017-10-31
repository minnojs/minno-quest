## piTask
This module is responsible for activating a single task.

```
<div pi-task="taskObj"></div>
```

Property    | Description
----------- | ---------------------
script      | Script object
scriptUrl   | Url to a script object
type        | Type of task here (as defined by activation functions)
pre         | Run this funciton before task
post        | Run this function after the task

### Task activation

Types are defined by activation functions. Activation functions may by defined directly as scripts (instead of the script object), as the `play` function of a script. Or added to the activation object via model.config(taskActivateProvider.set(name, fn)).

An activation function takes the following form:

```
function(done, props){
    runTask().then(done);
}
```

`done`: A function that lets the manager know that the task has finished.

`props`: An object with all sorts of usefull tools.

* $scope: the task scope
* task: the object that defined this task
* script: the task script
* $element: the canvas element wrapped in jqLite or jQuery.
* global: the global object
* $injector: an angularjs injector (it can allow you to $compile or accese $rootScope)