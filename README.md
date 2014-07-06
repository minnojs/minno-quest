[![Build Status](https://travis-ci.org/ProjectImplicit/PIquest.svg?branch=master)](https://travis-ci.org/ProjectImplicit/PIquest)

# PIquest

A framework for administering on-line questionnaires.

This repository is nowhere near ready for use - keep in touch, things are moving fast around here!

## settings
```js
settings: {
	onEnd: function(){
		// do something when the questionnaire ends
		// this usualy be taken care of automaticaly by the task manager...
		// for instance: redirect to 'my/url.js'
		location.href = 'my/url.js';
	},
	logger: {
		pulse: 34, // after how many objects should we post
		url: '/my/url', // where should we post to
		DEBUG: false // activate logging each object to the console
		logfn: function(log,pageData, global){
			log = {name:111,latency:8976, prestineLatency:45634, response:'response', data: {/* data */}};
			pageData = {startTime:'234645345', pageName: 'name'}
			return {};
		}
	}
}
```

## templates
any of the settings in questions/pages may use js templates `'<%= global.value %>'`
all templates may use the global, current and questions variables.
pages may use the pageData as well.
questions may use both pageData and questData.
They can both use pageMeta that has `number`, `outOf`, `name` of the page (so you can use `<%= pageMeta.number %> out of <%= pageMeta.outOf%>`)
## sequence
A sequence of pages that should be displayed to the user.
The pages are processed sequentialy, they may be inherited from the pages/questions sets.
Also, you can mix them to your hearts conent.
The conditional object contains three objects: global, current and questions. documentation of the global and current objects should be elsewhere.
Questions is an object indexed by question name. You can access any question property with the following syntax:

```js
var cond = {
	compare: 'questions.quest1.response', // compare the response of quest1
	to: 'questions.quest2.latency' // to the latency of question2
}
```

##quest.wrapper
Any quest object can take the following properties:

```js
{
	stem: "My question stem"
}
```

## questText
```js
{
	name: "identifier",
	dflt: "default value",
	minlength: 11,
	maxlength: 11,
	required: true,
	autoSubmit: false, // if this is set to true, the page will submit on "Enter"
	pattern: "/^\\d\\d\\d-\\d\\d-\\d\\d\\d\\d$/",
	errorMsg: {
		minlength: "too short",
		maxlength: "too long",
		required: "required",
		pattern: "Should have the form 000-00-0000"
	}
}
```

## quest.number
```js
{
	name: "identifier",
	dflt: 42,
	min: 3,
	max: 54,
	required: true,
	errorMsg: {
		min: "too small",
		max: "too large",
		required: "required",
		number: "has to be a number"
	}
}
```

## piQuest (page)
```js
{
	name: "identifier",

	decline:true, // should we allow users to decline (proceed without validation, mark responses as `declined`)
	declineText: "my decline Text",  // set to a string to change decline text
	noSubmit: false, // remove submit button
	submitText: "my submit text",

	header: 'My header',
	numbered: false, // should we display the number of each questions
	numberStart: 4, // what number should the page start at
	timeout: 3452, // how long in ms before timeout triggers
	timeoutMessage: 'you ran out of time...', // an optional message to be displayed upon timeout
	// the questions may be randomized using the regular mixer syntax
	questions: [
		{type:'text'},
		{type:'textNumber'},
		{type:'multi'}
	]
}
```

## selectOne
```js
{
	name: 'identifier',
	autoSubmit: false, // if this is set to true, the page will submit on second click on button
	dflt: 3, // default value
	randomize: true, // shuffle answers after mixing them (the mixer is activated in any case...)
	reverse: true, // reverses the order of the answers
	numericValues: false, // if numericValues is set default values are set numericaly by the order of the answers, they are set *after* the mixer is activated
	buttons: false, // by default uses a list format, set to true in order to use vertical buttons (likert style, currently does not support extremely narrow screens)
	// by default, value is set to equal text
	answers: [
		'first',
		'second',
		'third'
	],
	answers: [
		{text:'first', value:0},
		{text:'second', value:1},
		{text:'third', value:2}
	]
}
```

## mixer:conditions
```js
var cond = {
	compare: 'global.var',
	to: 'local.otherVar',
	operator: 'equals',
	DEBUG: false // console.log the comparison for debuging
}
```

**operators**

* `equals/default`: compare == to (supports comparison of objects and arrays too)
* `exactly`: compare === to
* `greaterThan`: compare > to
* `greaterThanOrEquals`: compare >= to
* `in`: compare is in Arr(to);
* `function(){}`: custom function (compareValue, toValue){return {Boolean}}

```js
var branch = {
    mixer: 'branch',
    conditions: [],
    data: [],
    elseData: [] // optional
}

var multiBranch = {
    mixer: 'branch',
    branches: [
        {
            conditions: [],
            data: []
        },
        {
            conditions: [],
            data: []
        }
    ],
    elseData: [] // optional
}

var condition = {
    compare: 'global.myVar',
    to: 'local.myVar'
}
```

**logical operators**

PIquest supports logical operators with the following form:

How about: (defaults to AND, objects may assign OR)
```js
// cond1 && cond2
var conds = [cond1, cond2];

// cond1 && (cond2 || cond3)
var conds = [cond1, {or:[cond2,cond3]}];

// (cond1 && cond2) || cond2
var conds = [{or:[{and:[cond1,cond2]},cond3]}]
```

The supported operators are: `and`, `or`, `nand`, `nor`.