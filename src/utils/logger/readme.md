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

Property | Signature | Descritpion
------- | ---- | ------
onRow | (logName, log, settings, ctx) => Any&#124;undefined | Maps over the log stream, return any value in order to pass it to `serialize`.
onEnd | (logName, settings, ctx) => Any&#124;undefined | Gets called when a stream ends, return any value in order to pass it to `serialize`.
