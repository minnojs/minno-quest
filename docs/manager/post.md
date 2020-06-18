# Post

- [Save from the Global object](#save-from-the-global-object)
- [Send data directly](#send-data-directly)
- [API](#api)

The post task posts plain data to the server. 
You can use it to either send data that has been saved in the Global object or directly set the data that you want to send.
This is a good way to keep track of conditions within your tasks.

### Save from the Global object
In your code, you can save data to the [Global object](../basics/variables.md#global). For instance, you might randomly select a condition and save the condition to the Global object.

For example, the following code randomly assigns participants to the experimental or the control group:
```javascript
API.addGlobal({ condition: API.shuffle(['experimental','control'])[0] });
```

In your code, you can then use that condition to provide your participants different tasks or show them different stimuli. However, adding a variable to global does not mean that it would be logged to the server. In order to log that variable to the server, you need to add a 'post' task to the sequence of tasks that you define in the manager file. For example:
```javascript
{
    type:'post',
    name:'cond'
    variableName: 'condition'
}
```
This code saves the variable 'condition' and its content to the server, under the task name 'cond'.

In each task, you can use the [`current` object](../basics/variables.md#the-task-object-current) to save variables. 
You can access the current variable from the global, using the task's name. For instance, if your study has a task named `iat`, and in that task you saved a variable called `randomization` you will have a variable that can be accessed with `global.iat.randomization`. You will use that to send the `randomization` variable to the server:

```javascript
{
    type:'post',
    name:'primaryRandomization'
    variableName: 'iat.randomization'
}
```

You can also send several variables together. 
The following task sends `global.iat.randomization` and `global.iat.feedback` to the server:

```javascript
{
    type:'post',
    name:'primaryRandomization'
    variableName: [
        'iat.randomization',
        'iat.feedback'
    ]
}
```

### Send data directly

You can also define an object to be sent:
```javascript
{
    type:'post',
    name:'condition'
    data: {
        condition: 'experimental'
    }
}
```
One example for the usefulness of this feature is when the randomization in your task is done using a mixer (e.g., a [choose mixer](../basics/mixer.md#choose)). Consider this code:

```javascript
{
    mixer:'choose',
    data:[
        {
            mixer:'wrapper',
            data: 
            [
                {inherit:'manipulation'},
                {
                    type:'post',
                    name:'condition'
                    data: {
                        condition: 'experimental'
                    }
                }
            ]
        },
        {
            mixer:'wrapper',
            data: 
            [
                {inherit:'control'},
                {
                    type:'post',
                    name:'condition'
                    data: {
                        condition: 'control'
                    }
                }
            ]
        }
    ]
}
```

Note that you can use [templates](../basics/templates.md) as strings within the data object.
This way you can pull information from different parts of `global` to the same place.


`data` can also be a function. In that case, it will recieve the arguments `global` and`task`:

```
{
    type:'post',
    name:'secondaryRandomization'
    stage: 2,
    data: function(global, task){
        return {
            score: global.currentScore,
            stage: task.stage
        }
    }
}
```

### API

The API is as follows:

property        | description
--------------- | ---------------------
settings        | Optional settings that overide the logger settings [as defined](./API.md#logger) in the manager.
variableName    | A path within the global to the object that you want to send. For example: `"iat.feedback"` will post the object `feedback` from `global.iat`. You can also use an array of paths that will be combined into a single post.
path            | Deprecated verson of `variableName`
data            | A raw object to be posted to the server. You may use templates in order to construct it.
