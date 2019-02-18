# setValue

- [API](#api)
- [Basic use](#basic-use)
- [Experiment conditions](#experiment-conditions)

The `setValue` task allows setting a value to [environmental variables](../basics/variables.md) (e.g., variables stored in the global object). 
It is useful for implementing experiment conditions.


### API

property            | description
------------------- | ---------------------
variableName        | The name of the variable to which the value is set within the global object. For assigning variables nested within global, use the following format: `iat.feedback` would assign the value to the variable `feedback` under `global.iat`. 
value               | A raw value to be set into `variableName`.
valueFromVariable   | The name of the variable from which the value is copied. It is within the global object. For accessing variables nested within global, use the following format: `iat.feedback` would assign the value to the variable `feedback` under `global.iat`. 
fn                  | A function, that should be called, and the result set int `variableName`.
post                | (true/false) should we log this value.
settings            | Optional settings that overide the logger settings [as defined](./API.md#logger) in the manager.
path                | Deprecated verson of `variableName`.

Only one of `value`, `valueFromVariable` and `fn` can be used.



### Basic use
Following are a set of examples for the basic use of the `setValue` task, [below](#experimental-conditions) are some more advanced applications.

In the following example, we set the value 'condition1' into the variable cond within the global object.

```javascript
{
    type:'setValue',
    variableName:'cond',
    value:'condition1'
}
```

It is possible to assign nested variable names. 
In the following example, we set the value of the variable `isControl` within the `global.conditions` object.

```javascript
{
    type:'setValue',
    variableName:'conditions.isControl',
    value:true
}
```

You can also copy variables. In the following example, we copy the user's response to a questionnaire into a variable under global

```javascript
{
    type:'setValue',
    variableName:'conditions.hasConsent',
    valueFromVariable: 'consent.questions.consent.response'
}
```

You can also create variables dynamically, using a function. The global object is the function's argument:

```javascript
{
    type: 'setValue',
    variableName: 'score',
    fn: function(global){
        return global.score1 + global.score2;
    }
}
```

Finally, the task allows posting the variable and its value to the server (i.e., logging it):

```javascript
{
    type:'setValue',
    variableName:'cond',
    value:'condition1',
    post:true
}
```
### Experimental conditions
Following, are two examples for the use of `setValue` in order to manage multiple experimental conditions.

In this example, we use a "choose" mixer to choose an experimental condition. We set the selected condition to `global.condition` and even send it to the server (post:true). 

```javascript
{
    mixer: 'choose',
    data: [
        {
            mixer: 'wrapper',
            data: [
                {type:'setValue', variableName: 'condition', value: 'trueInstructions', post:true},
                {type:'message', template: 'These are the true instructions', keys: ' '}
            ]
        },
        {type:'setValue', variableName: 'condition', value: 'control', post:true},
    ]
}
```

Sometimes it is more convinient to separate the randomization from actually running the tasks.
In this example, we use a "weightedChoose" mixer in order to randomize the `global.condition` variable, so that there is twice the probability to be in the 'trueInstructions' group than in the 'control' group.
We then use a branch mixer in order to choose the appropriate instructions.

```javascript
[
    // Randomization
    {
        mixer: 'weightedChoose',
        weights: [2,1],
        data: [
            {type:'setValue', variableName: 'condition', value: 'trueInstructions', post:true},
            {type:'setValue', variableName: 'condition', value: 'control', post:true}
        ]
    },
    // Execute appropriate task (or not...)
    {
        mixer: 'branch',
        conditions: {compare: 'global.condition', to: 'trueInstructions'},
        data: [
            {type:'message', template: 'These are the true instructions', keys: ' '}
        ]
    }
]
```
