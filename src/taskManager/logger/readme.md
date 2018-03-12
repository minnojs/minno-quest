# Logger

The logger is responsible for managing multiple streams of logs and allowing easy fine tuning of posting them to a server.
Each logger can create named log streams that can then be used to manage your data.

```javascript
import Logger from './logger';
const noop = function(){};
const settings = {
    onRow: (name, log) => console.log(log), 
    onEnd:()=>console.log('The end'), 
    serialize:noop, 
    send:noop
};

const logger = Logger(settings);
const managerLog = logger.createLog('manager');

managerLog('first log'); // logs 'first log'
managerLog('second log'); // logs 'second log'
managerLog.end(true); // logs 'The end'
```

The raw logger takes a settings object with four properties:

Property    | Signature                                             | Descritpion
----------- | ----------------------------------------------------- | -----------
onRow       | (logName, log, settings, ctx) => Any&#124;undefined   | Maps over the log stream, return any value in order to pass it to `serialize`.
onEnd       | (logName, settings, ctx) => Any&#124;undefined        | Gets called when a stream ends, return any value in order to pass it to `serialize`.
serialize   | (logName, logs, settings, ctx) => Any                 | Transforms the logs returned by onRow/onEnd before sending them
send        | (logName, serialized, settings, ctx) => void          | Sends serialized data to server (or whatever...)

The arguments for the logging functions are as follows:

Argument                | Description
----------------------- | -----------
logName                 | The name for this log group - the name of the task producing these logs.
log/logs/serialized     | The data piped down to this function.
settings                | The settings object + some meta data. See below for some additional details.
ctx                     | The context object of the logger. You can assign any values you like into it. This is a good place to keep state across logging actions.

 * The settings object here is rather dynamic. It is composed of 
 (a) The defalut settings as defined by the `type` settings. 
 (b) The manager logger settings. 
 (c) The task logger settings.
 (d) If the log was created by API.save `settings.isManual` is set to true.
 (e) The task type is set into `settings.is<Type>` so that quest tasks will have `settings.isQuest` set to true.
