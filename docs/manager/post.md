# Post

- [Local variables](#local-variables)
- [Manual data](#manual-data)
- [API](#api)

The post task is responsible for posting plain data to the server. 
You can either send data that has been saved in the global object or manually set the values to be sent.
This is a good way to keep track of complex conditions within your tasks.

### Local variables
The following post task takes all data from `global.iat.randomization` and posts it to the server.

```javascript
{
    type:'post',
    name:'primaryRandomization'
    variableName: 'iat.randomization'
}
```

You can also send several variables together. 
The following task sends both `global.iat.randomization` and `global.iat.feedback` back to the server:

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

### Manual data

You can also manually define an object to be sent.
This can be usefull for example when you want to save a specific branch that the participant reached.
Note that you can use templates within the data object.

```javascript
{
    type:'post',
    name:'primaryRandomization'
    data: {
        condition: 'branch1'
    }
}
```

In case data is set as a function, it will be called with `global` and the `task` itself as arguments:

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
