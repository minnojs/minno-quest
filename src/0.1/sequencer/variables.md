<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Environmental Variables](#environmental-variables)
- [Local Variables](#local-variables)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---
title: Variables
description: Setting and controling environmental variables
---

Sometimes it is not enough to hard code behaviors into your tasks, sometimes you want behavior to depend on a previous response, or change your texts according to randomization. In order to support these behaviors you can use variables.

#### Environmental Variables
The `global` variable is the context of everything that happens within the task manager. It is an object that holds a property for each task that is run. 
In addition, you as a user may extend it manually using the `API.addGlobal` or `API.addCurrent` functions. Any Task element can have the additional property `addGlobal` or `addCurrent` that get added to the global/current whenever that element is activated. This options is useful in various cases of branching.For advanced uses you can also access the global object directly by changing the `window.piGlobal` object.

```js
API.addGlobal({
    value: 123,
    variable: [1,2,3]
})
```

Each task creates an object associated with it that logs anything that happens within the task. In the duration of the task, this object can be accessed using the `current` object. After the task ends, the object stays available from within the global object as `global.taskName`, where "taskName" is the name associated with this specific task.
The task object is there for you to change. You can extend it to your hearts content using `API.addCurrent`:

```js
API.addCurrent({
    value: 123,
    variable: [1,2,3]
})
```

Tasks add any data that they log into their task object. For instance, piQuest maintains a `current.questions` object that holds the responses for all questions.

#### Local Variables
In addition to these environmental variables, you have access to two types of local variables; *Data* and *Meta* . They are each available within the mixer/templates with specific names tied to their type. The naming convention for these variables is `<elementName>Data` and `<elementName>Meta`. For example, for tasks they appear as `tasksData` and `tasksMeta`. 

The elementNames for the various tasks are as follows:

Task        | elementName | Object names
----------- | ----------- | ------------
piManager   | tasks       | tasksData, tasksMeta
piQuest     | pages       | pagesData, pagesMeta
            | questions   | questionsData, questionsMeta
piPlayer    | trial       | trialData, trialMeta
            | stimulus    | stimulusData, stimulusMeta
            | media       | mediaData, mediaMeta

If you set the data property of your elements, then they become available as the `<elementName>Data` objects.

Each element within the sequence gets a Meta object that holds automatically generated information regarding the location of the element within the sequence. It has two properties:

Property    | Description  
----------- | -----------
number      | The serial number for this element within the sequence (i.e. 3 if this is the third element to be presented).
outOf       | An attempt to estimate how many elements are in the sequence overall. This number cannot be fully trusted as the number of elements may be dynamically generated and depend on various variables not yet determined.

