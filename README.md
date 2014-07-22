[![Build Status](https://travis-ci.org/ProjectImplicit/PIquest.svg?branch=master)](https://travis-ci.org/ProjectImplicit/PIquest)

This repository is nowhere near ready for use - keep in touch, things are moving fast around here!

# PIquest

PIquest is a framework for administering on-line questionnaires.

It is written in JavaScript and is built to be extremely versatile and customizable. The scripts for the player are written as JavaScript objects. This format allows, writing simple and straightforward scripts using a constrained scripting language. The format also allows advanced users to easily create complex and dynamic scripts using in-line JavaScript.

### Table of contents

* [Central concepts](#central-concepts)
* [A short introduction ](#a-short-introduction)
* [Pages](#pages)
* [Questions](#questions)
	- [text](#text)
	- [textNumber](#textnumber)
	- [selectOne & selectMulti](#selectone-selectmulti)
* [Settings](#settings)
* [The mixer ](#mixer)
* [Inheritance ](#inheritance)
* [Templates and variables](#templates-and-variables)

### Central concepts

The player treats each questionnaire a **sequence** of **pages**. Each page may have one or more **questions**.

Each page or question is implemented as a page/question object. The pages are set into a sequence and presented sequentially. This is essentially all you need to know in order to start writing questionnaires.

The sequence supports a mixer that will allow you to randomize the order of the pages (or questions) that you create. The questionnaire also supports an *inheritance* system, that will allow you to abstract you questionnaires and make them shorter, simpler and more dynamic.

Questionnaires are created by writing a Java-script object that has several properties: `settings`, `sequence`, `pages`, `questions`, `global` and `current`. Some of these properties have to do with advanced uses of the player, but really the only two that you **have** to know are `sequence` and `settings`. We'll first show a simple questionnaire, then go through each of the more advanced options.

### A short introduction

The basic unit that PIquest deals with is the page. Each page has several properties that deal with submitting and page layout, and most importantly a list of one or more questions. Your basic page is a simple object with the `questions` property. This following will create a simple page with no header/progress-bar/decline button etc.

```js
var page = {
	questions: []
}
```

There are plenty of additional features that [pages have](#pages), but this is the very minimum that you'll need.

Next, we'll want to create the question objects themselves. There are several [types of questions](#questions), but all of the share some basic properties.

```js
var question = {
	type: 'text',
	name: 'myQuestName',
	stem: 'What would you like to know?'
}
```

The `type` of question is the first decision that you have to make, it controls the question type and interface. This is where you decide if you want the user to input some text, choose from a list or maybe even set a slider. The `name` is literally the name that this question is marked with when it is logged, and also allows you to refer to the question from within PIquest. Finally, `stem` is the text for the question itself.

The question in the following example will show a text input with the question 'What would you like to know?'. Here is an example of a `selectOne` question that prompts the user to choose one response out of a list of answers: red, blue or green.

```js
var question = {
	type: 'selectOne',
	name: 'mySelectQuest',
	stem: 'What color is the sky?',
	answers: [
		'red',
		'blue',
		'green'
	]
}
```

Now that we know how to create questions we can move on to create the sequence. The main component of your questionnaire will always be the sequence. The sequence describes the course of your questionnaire; most of the time it is possible to create everything that you want just within the sequence. The sequence is simply an array of page objects that are activated one after the other. The following sequence holds two pages, the first has two questions, the second only one:

```js
var sequence = [
	// 1. This is a page object
	{
		// It has a questions property
		questions:[
			// 1a. This is the first question (a text input):
			{
				type: 'text',
				stem: 'What is your name?'
			},
			// 1b. This is a second question (a select one input)
			{
				type: 'selectOne',
				stem: 'How are you?',
				answers: ['good', 'fair' ,'bad']
			}
		]
	},
	// 2. This is the second page object
	{
		// It has the same structure as the previous one
		questions:[
			// 2a. But only one question
			{
				type: 'text',
				stem: 'What is your name again?'
			}
		]
	}
]
```

The sequence can also do quite a lot of randomization and branching, you can read about it [here](#mixer).

Now that we've created the sequence we can finally proceed to setting it into the player. The first and last two lines are the same for all scripts (they have to do with the way Javascript works), you can simply ignore them. The `API` object assists you in putting your script together, you will [eventually](#API) learn more of its functionality, but for now you should know that the `addSequence` function is responsible for adding pages into your sequence. You may call it as many times as  you like.

```js
define(['questAPI'], function(quest){
	var API = new quest();

	API.addSequence([
		page1,
		page2,
		page3
	]);

	return API.script;
});
```

Thats it! PIquest has loads of additional features, but this is really all you need to know in order to get started (by the way, if you want to log the responses to your questions you should learn about the [ logger setting ](#settings)).

### Pages
The basic unit that PIquest deals with is the **page**. The properties within a page manage the way a page of question is displayed and the users interactions with it.

| property		| description
| ------------- | ---------------------
| name 			| (string) The identifier for this page, is used mainly for logging purposes
| decline 		| (boolean) Should we allow users to decline to answer the questions on this page. This option displays a "decline" button that proceeds to the next page without validation and marks this response as "declined".
| declineText	| (string) The text for the decline button (default to "Decline to answer")
| noSubmit		| (Boolean) remove submit button (useful when using the 'autoSubmit' function of some questions).
| submitText	| (String) The text for the submit button (default to "Submit").
| header 		| (String) Text for the page header.
| numbered 		| (Boolean) Should we display the number of each questions.
| numberStart	| (Number) The number we should start the page at.
| timeout 		| (Number) If this is set to a positive integer *x*, it auto submits after *x* milliseconds (no validation allowed).
| timeoutMessage| (String) An optional message to be displayed upon timeout.
| questions 	| (Array) an array of [questions](#questions) to be displayed in the page. Note that the questions may be randomized and chosen conditionally using the [mixer](#mixer).

For example, a page can look something like this:

```js
var page = {
	header: 'Personal information:',
	decline: true,
	declineText: 'I prefer to keep this information to myself',
	questions: [
		{type:'text', stem:'What is your name?'},
		{type:'text', stem:'Where do you live?'}
	]
}
```

### Questions

Questions are the thing we've all gathered here for.

- [text](#text)
- [textNumber](#textNumber)
- [selectOne & selectMulti](#selectone-selectmulti)

There are several types of questions, but all of them share some basic properties.

property		| description
--------------- | ---------------------
type 			| (String: 'text') Controls the question type and interface. This is where you decide if you want the user to input some text, choose from a list or maybe even set a slider.
name 			| (String: undefined) The name that this question is marked with when it is logged, and also allows you to refer to the question from within PIquest.
stem 			| (String: '') The text for the question itself.
help			| (Bool: false) Whether to display the question help text.
helpText		| (String: special) The question help text. Some questions have default help texts, some don't.

##### Text
The `text` questions consist of a simple text input in which the users can type in a string of text. They have the following parameters:

property		| description
--------------- | ---------------------
dflt 			| (String: "") The default value for this question.
autoSubmit 		| (Boolean: false) If this property is set to true typing `Enter` while this input is focused will submit the form.
minlength 		| (Number: null) Validation: force at least this number of characters.
maxlength		| (Number: null) Validation: force at most this number of characters.
required		| (Boolean: false) Validation: require a non empty string as a response.
pattern			| (Regex/String: null) Validation: require the response to match the regular expression set in pattern.
correct 		| (Boolean: false) Validation: require the response to be correct (set the target value using `correctValue`)
correctValue 	| (*) Set the correct response value for the correct validation.
errorMsg		| (Object: {}) This object has a property for each validation type. Setting the appropriate type changes the validation message. For instance setting the `required` property will change the validation message for instances where no response was given.

For example, this is a text question that requires a valid email address (although there are better patterns out there for this purpose):

```js
var quest = {
	stem: "Please type your email address",
	dflt: "my@email.com",
	required: true,
	pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm,
	errorMsg: {
		required: "You must enter a valid email address.",
		pattern: "This is not a valid email address"
	}
}
```

##### textNumber
The `textNumber` questions consist of a simple text input that limit the user to numeric responses only. They have the following parameters:

property		| description
--------------- | ---------------------
dflt 			| (Number: null) The default value for this question.
autoSubmit 		| (Boolean: false) If this property is set to true typing `Enter` while this input is focused will submit the form.
min 			| (Number: null) Validation: minimum valid number.
max				| (Number: null) Validation: maximum valid number.
required		| (Boolean: false) Validation: require a non empty string as a response.
correct 		| (Boolean: false) Validation: require the response to be correct (set the target value using `correctValue`)
correctValue 	| (*) Set the correct response value for the correct validation.
errorMsg		| (Object: {}) This object has a property for each validation type. Setting the appropriate type changes the validation message. For instance setting the `required` property will change the validation message for instances where no response was given. Note that their is a special property `number` that is triggered whenever the response is not a valid number.

For example, this is a text question that asks for a number under 273:

```js
var quest = {
	type: 'textNumber',
	stem: "Please enter your height in cm",
	max: 273,
	required: true,
	errorMsg: {
		max: "That is a bit too much to believe... - even Robert Wadlow wasn't this tall!",
		number: "Your height has to be a number"
	}
}
```

##### selectOne & selectMulti
The `selectOne` and `selectMulti` questions present a list of possible answers for the user to pick from. The only difference between them is that select Multi allows the user to pick more than one answer. They have the following parameters:

property		| description
--------------- | ---------------------
dflt 			| The default *value* for this question, this is the literal value for `selectOne`, and an array of values for `selectMulti`.
autoSubmit 		| (Boolean: false) If this property is set to true, Clicking twice on the same answer will submit the form. This options is not supported for `selectMulti`.
randomize 		| (Boolean: false) Shuffle answers after mixing them (the mixer is activated regardless of this parameter, this serves as as shortcut of sorts)
reverse 		| (Boolean: false) Reverses the order of answers in this question.
numericValues 	| (Boolean: false) If `numericValues` is set, default numeric values are set for each answer, they are set *before* randomize, but *after* the mixer is activated.
buttons 		| (Boolean: false) By default we use a list format for this question, set to true in order to use horizontal buttons (Likert style). This option  does not currently support extremely narrow screens).
answers			| (Array: []) The list of possible answers for this question. There are two acceptable formats; (1) an array of strings/numbers, (2) an array of objects with `text` and `value` parameters.
correct 		| (Boolean: false) Validation: require the response to be correct (set the target value using `correctValue`)
correctValue 	| (*) Set the correct response value for the correct validation (This should be an array for selectMulti).
errorMsg		| (Object: {}) This object has a property for each validation type. Setting the appropriate type changes the validation message. For instance setting the `correct` property will change the validation message for instances where the correct response was not given.

Each answer on the list has a value associated with it. By default the value is equal to the text of the answer. If `numericValues` is set, the value is set to the appropriate number. Using the object notation, you can set values of your own.

For example, the following question uses the plain notations, using `numericValues` to abstract numbers out of the result.

```js
var quest = {
	type: 'selectOne',
	stem: "Do you like bananas?"
	numericValues: true,
	answers: [
		'Very much',	// ==> 0
		'I guess',		// ==> 1
		'Not at all'	// ==> 2
	]
}
```

The following question uses the object notation to do the exact same thing:

```js
var quest = {
	type: 'selectMulti',
	stem: "Do you like bananas?"
	numericValues: true,
	answers: [
		{text:'Very much', value:0},	// ==> 0
		{text:'I guess', value:1},		// ==> 1
		{text:'Not at all', value:2}	// ==> 2
	]
}
```


### settings

Docs not ready yet!!!!!!!!!!!!!

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

### Mixer
Docs not ready yet!!!!!!!!!!!!!

The conditional object contains three objects: global, current and questions. documentation of the global and current objects should be elsewhere.
Questions is an object indexed by question name. You can access any question property with the following syntax:

```js
var cond = {
	compare: 'questions.quest1.response', // compare the response of quest1
	to: 'questions.quest2.latency' // to the latency of question2
}
```

### Inheritance
Docs not ready yet!!!!!!!!!!!!!

### Templates and variables
Docs not ready yet!!!!!!!!!!!!!

##### global & current
Are globaly available objects.
`current` holds a special object called questions that holds all the user responses.

You can set global and current in advance using the global/current objects.

You can also set global in advance by setting it into the pi-task pi-global attribute.

##### templates
any of the settings in questions/pages may use js templates `'<%= global.value %>'`
all templates may use the global, current and questions variables.
pages may use the pageData as well.
questions may use both pageData and questData.
They can both use pageMeta that has `number`, `outOf`, `name` of the page (so you can use `<%= pageMeta.number %> out of <%= pageMeta.outOf%>`)


<hr/>
<hr/>


## mixer:conditions
Docs not ready yet!!!!!!!!!!!!!
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