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
	header: 'My header',
	timeout: 3452, // how long in ms before timeout triggers
	timeoutMessage: 'you ran out of time...', // an optional message to be displayed upon timeout
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
	dflt: 3, // default value
	randomize: true, // shuffle answers after mixing them (the mixer is activated in any case...)
	reverse: true, // reverses the order of the answers
	// by default values are set numericaly by the order of the answers
	// they are set *after* the mixer is activated
	answers: [
		'first',
		'second',
		'third'
	],
	answers: [
		{text:'first', value:1},
		{text:'second', value:2},
		{text:'third', value:3}
	]
}
```