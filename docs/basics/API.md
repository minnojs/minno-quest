# API

- [Task creation](#task-creation)
    - [setName(name)](#setnamename)
    - [addSettings(name, setting)](#addsettingsname-setting)
    - [addSequence(sequence)](#addsequencesequence)
    - [addSet(setName, setArray)](#addsetsetname-setarray)
- [Environmental variables](#environmental-variables)
    - [addGlobal(obj)](#addglobalobj)
    - [getGlobal()](#getglobal)
    - [addCurrent(obj)](#addcurrentobj)
    - [getCurrent()](#getcurrent)
- [Convenience methods](#convenience-methods)
    - [post(url, object)](#posturl-object)
    - [shuffle(collection)](#shufflecollection)
    

### Task creation

#### setName(name)

Argument    | Type  | Description
----------- | ----  | -----------
name        | String| The name of this task. If used as part of miManager, this setting may be overided by the manager task object.

##### returns:
(*Object*) this `API`

##### example:
```javascript
API.setName('taskName');
```


#### addSettings(name, setting)

Argument    | Type          | Description
----------- | ----          | -----------
name        | String        | The name of the setting that you want to change.
setting     | * or Object   | The setting value. If this is an object, it will extend the existing setting object instead of overwriting it.

##### returns:
(*Object*) this `API`

##### example:
```javascript
API.addSettings('onEnd', function(){
    // something to do at the end of the task    
});
```

#### addSequence(sequence)

Argument    | Type              | Description
----------- | ----              | -----------
sequence    | Array or Object   | An array of objects or a single object to add to the sequence (for example, trial or page objects).

##### returns:
(*Object*) this `API`

##### example:
```javascript
API.addSequence([
    trial1,
    trial2
]);
```

#### addSet(setName, setArray)

Each task API has one or more "addSet" functions. These function take the form `add<*SetName*>Set` so that, for instance pages use the `API.addPagesSet` function and tasks use the `API.addTaskSet` function. They are used in order to register prototypes of objects for the sequencer [inheritance](sequencer.html#inheritance) system.

Argument    | Type              | Description
----------- | ----              | -----------
setName     | String            | The name of the set to be registered.
setArray    | Array or Object   | An array or object to add this this set.

This function has an alternative notation : `add<*SetName*>Set(setName, setArray)`.

Argument    | Type              | Description
----------- | ----              | -----------
setsObject  | String            | An object where each property name is a setName and the content is the set content.

Task        | setName     | Function Name
----------- | ----------- | ------------
miManager   | tasks       | addTasksSet
miQuest     | pages       | addPagesSet
            | questions   | addQuestionsSet
miTime    | trial       | addTrialSet
            | stimulus    | addStimulusSet
            | media       | addMediaSet


##### returns:
'undefined'

##### examples:
First notation:
```javascript
API.addTrialSet('set1', trial1);
API.addTrialSet('set2', [trial2, trial3]);
```

Second notation. Does the same thing as the first pair:
```javascript
API.addTrialSet({
    set1: [trial1],
    set2: [trial2,trial3]
});
```

### Environmental variables

#### addGlobal(obj)

Argument    | Type          | Description
----------- | ----          | -----------
obj         | Object        | An object to merged into the global object

##### returns:
(*Object*) `global` object.

##### example:
```javascript
API.addGlobal({myFlag: true});
```

#### getGlobal()

##### returns:
(*Object*) `global` object.

##### example:
```javascript
var global = API.getGlobal();
global.myFlag = true;
```

#### addCurrent(obj)

Argument    | Type          | Description
----------- | ----          | -----------
obj         | Object        | An object to merged into the current object.

##### returns:
(*Object*) `current` object.

##### example:
```javascript
API.addCurrent({myFlag: true});
```

#### getCurrent()

##### returns:
(*Object*) `current` object.

##### example:
```javascript
var current = API.getCurrent();
current.myFlag = true;
```

### Convenience methods

#### post(url, object)
Posts JSONified data to the server. 

Argument    | Type          | Description
----------- | ----          | -----------
url         | String        | The url to post to.
object      | object        | An Object to be JSONified then posted.

##### returns:
(*Promise*) a promise to be resolved when the post completes.

##### example:
```javascript
API.post('my/server/url', {my:'data'});
```

#### shuffle(collection)
Returns an array of shuffled values, using a version of the Fisher-Yates shuffle (Uses [lodash shuffle](https://lodash.com/docs#shuffle)).

Argument    | Type                      | Description
----------- | ----                      | -----------
collection  | Array, Object or String   | The collection to shuffle.

##### returns:
(*Array*) The new shuffled array.

##### example:
```javascript
var shuffled = API.shuffle([1,2,3,4]);
console.log(shuffled); // prints [4, 1, 3, 2] for example
```

#### save(object)
This function is available only on the project implicit build.
Posts JSONified data to the server. 

Argument    | Type          | Description
----------- | ----          | -----------
object      | object        | An Object to be JSONified then posted.

##### returns:
(*Promise*) a promise to be resolved when the post completes.

##### example:
```javascript
API.save({my:'data'});
```
