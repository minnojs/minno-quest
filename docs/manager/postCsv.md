# Post CSV

The postCsv task is responsible for posting CSV data to the server.
It is a good way to save data in a simple easy to use format.
In fact, you can use [this](https://github.com/minnojs/simple-minno-server) simple server in order to save it.

In order to use the postCsv task, you should set up csv logging in the task settings:

```javascript
API.addSettings('logger', {type:'csv', url:'csv.php'});
```

Then, whenever you want in your task you can send the data using the `postCsv` task.
Any properties of the task object are merged into the logger settings (so you can for example change the url for posting).

```
{ type:'postCsv', url:'data.php' }
```
