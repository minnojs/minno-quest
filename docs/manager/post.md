# Post

The post task is responsible for posting plain data to the server. You can either send data directly from the global object or create it yourself. This is a good way to keep track of complex conditions within your tasks or of manual manipulation of all sorts.

The following post task takes all data from `global.randomization` and posts it to the server.

```javascript
{
    type:'post',
    name:'primaryRandomization'
    path: 'randomization'
}
```

In case the data to be sent is a function, it will be called with `global` and the `task` itself as arguments:

```
{
    type:'post',
    name:'secondaryRandomization'
    data: function(global, task){
        return {
            score: global.currentScore,
            stage: task.data.stage
        }
    }
}
```

The API is as follows:

property        | description
--------------- | ---------------------
settings        | Optional settings that overide the logger settings [as defined](./API.md#logger) in the manager.
path            | A path within the global to the object that you want to send. For example: `"iat.feedback"` will post the object `feedback` from `global.iat`. You can also use an array of paths that will be combined into a single post.
data            | A raw object to be posted to the server. You may use templates in order to construct it.
