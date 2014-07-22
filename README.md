[![Build Status](https://travis-ci.org/ProjectImplicit/PIquest.svg?branch=master)](https://travis-ci.org/ProjectImplicit/PIquest)

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
	- [Mixer types](#mixer-types)
	- [Conditions](#conditions)
	- [Operators](#operators)
	- [Aggregation](#aggregation)
* [Variables](#variables)
* [Templates](#templates)
* [Inheritance ](#inheritance)


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
Settings allow you to control the generic way that the player works, the are set using the `addSettings` function. The first argument to the function is always the name of the setting, the second argument is the setting itself. In case the setting is an object, subsequent objects will extend each other so that settings may be progressively added.

##### onEnd
`onEnd` is a function to be called as soon as the task ends. It should be taken care of automatically when PIQuest is run from within the task manager.

```js
API.addSettings('onEnd', function(){
	// Do something: for instance, redirect to 'my/url.js'
	location.href = 'my/url.js';
});
```

##### logger
This setting controls the way that logging works within the player.

```js
API.addSettings("logger", {
	pulse: 34,
	url: '/my/url',
	DEBUG: false,
	logfn: function(log,pageData, global){
		return {name: log.name, set: global.setName};
	}
});
```

Setting 	| Description
----------- | ---------------
pulse 		| (Number: 0) After how many objects should we post to the server. Setting this to 0 tells the player to log only at the end of the task.
url 		| (String:"") The URL to which we should post the data to.
DEBUG 		| (Boolean: false) When set to true, logs each logged object to the console.
logfn 		| (Function) The task has a default object that it logs, if you want to change the logged obj itself, you may use a function of the form: `function(log, pageData, global){return logObj;}`

### Mixer
The mixer is responsible for managing lists (arrays) within PIQuest, it is capable of repeating, randomizing and even changing the list according to [environmental variables](#variables). You may use it within the sequence, for answer lists within pages and even for answers within the `selectOne` or `selectMulti` questions.
The mixer allows wrapping a sub list in an object that allows you to manipulate the way in which it appears. You may insert such an object at any place within a list and it will be replaced by the appropriate objs.

The basic structure of a mixer object is:
```js
{
	mixer: 'functionType',
	data: [obj1, obj2]
}
```

The `mixer` property holds the mixer type, essentially it tells the mixer what to do with the sub-list. The `data` property holds the sub-list; an array of elements (either plain objects or mixer objects).

A sequence can look something like this (don't get scared it's simpler than it looks):

```js
[
	// The first obj to present.
	firstobj,

	// Repeat the structure inside 10 time (so we get 40 objs)
	{
		mixer: 'repeat',
		times: 10,
		data: [
			// Delay the mixing of these elements until after the `repeat`.
			{
				mixer: 'wrapper',
				data: [
					obj1,
					// Randomize the order of the objectss within.
					{
						mixer: 'random',
						data: [
							obj2,
							// Keep obj 3 and 4 together.
							{
								mixer: 'wrapper',
								data: [
									obj3,
									obj4
								]
							}
						]
					} // end random
				]
			} // end wrapper
		]
	}, // end repeat

	// the last obj to present
	lastobj
]
```
This sequence has an opening and ending obj (`firstobj` and `lastobj`).
Between them them we repeat a set of four objs ten times.
The order of the four objs is randomized, so that `obj1` always comes first and the order of the following objs are randomized but `obj3` and `obj4` are wrapped together and therefore always stay consecutive.

##### Mixer types
We support several mixer types.

**repeat**:
Repeats the element in `data` `times` times.
* `{mixer:'repeat', times:10, data: [obj1,obj2]}`

**random**:
Randomizes the order of elements in `data`.
* `{mixer:'random', data: [obj1,obj2]}`

**weightedRandom**:
Picks a single element using a weighted random algorithm. Each element in `data` is given the appropriate weight from `weights`. In the following example obj2 has four times the probability of being picked as obj1.
* `{mixer:'weightedRandom', weights: [0.2,0.8], data: [obj1,obj2]}`

**choose**:
Picks `n` random elements from `data` (by default the chooser picks one element).
* `{mixer:'choose', data: [obj1,obj2]}` pick one of these two objs
* `{mixer:'choose', n:2, data: [obj1,obj2,obj3]}` pick two of these three objs

**wrapper**:
The wrapper mixer serves a sort of parenthesis for the mixer. It has two primary functions; first, in case you want to keep a set of elements as a block (when randomizing) simply wrap them and they'll stay together. Second, when repeating a `random` mixer, the mixer first randomizes the content of the inner mixer and only then repeats it. If you want the randomization to be deferred until after the repeat all you have to do is wrap it in a wrapper.
* `{mixer:'wrapper', data: [obj1,obj2]}`

**branch**:
Pick the elements in `data` if `conditions` is true, pick the elements in `elseData` if `conditions` is not true. If `elseData` is not defined, or is left empty, then this object is skipped (See [conditions](#conditions) to learn about how conditions work).
* `{mixer:'branch', conditions:[cond], data:[obj1,obj2]}`
* `{mixer:'branch', conditions:[cond], data:[obj1,obj2], elseData: [obj3, obj4]}`

**multiBranch**:
Find the first object within `branches` for which `conditions` is true, and pick the elements in that objects `data`. If no object is picked then pick `elseData` (optional). (See [conditions](#conditions) to learn about how conditions work).
```js
{
    mixer: 'branch',
    branches: [
        {conditions: [],data: []},
        {conditions: [],data: []}
    ],
    elseData: [] // optional
}
```

##### Conditions
The conditional mixers allow you to change the content of a list according to [environmental variables](#variables). Each list has specific variables available to it, you can find the relevant details in the documentation for each list, but all lists have access to the `global` and `current` objects, so we'll use them for all examples here.

A condition is a proposition, it is evaluated to either a `true` or `false` value. They are used for decision making within the branching mixers. Conditions are represented by objects. The following condition object `compare`s **global.var** `to` **local.otherVar** and checks if the are equal (if you aren't sure what **global.var** means you should check [this](#variables) out):

```js
var cond = {
	compare: 'global.var',
	to: 'local.otherVar'
}
```

Conditions should be treated as a type of equation. 

The `compare` and `to` properties have a special syntax that describes the value that they refer to. Most values that you use will be treated as-is. The special case is string that have dots in them: `global.var`, `questions.q1.response`; these values will be treated as pointing to variables within the lists context. So that `questions.q1.response` will retrieve the value of the response for q1 from the questions object. The following check whether the global variable var is equal to 15. 

```js
var cond = {
	compare: 'global.var',
	to: 15
}
```

The following is a list of condition properties:

Property 		| Description
--------------- | -------------------
compare 		| The left side of the equation.
to 				| The right side of the equation.
operator 		| The type of comparison to do (read more about operators [here](#operators)).
DEBUG 			| Set this to `true` so that the any condition that is evaluated will be logged to the console.

##### Operators
The default comparison for a condition is to check equality (supports comparison of objects and arrays too). You can use the `operator` property to change the comparison method. The following checks if var is greater than otherVar:

```js
var cond = {
	compare: 'global.var',
	to: 'local.otherVar',
	operator: 'greaterThan'
}
```

Operator 			| Description
-------------------	| -----------------
equals 				| This is the default operator. It checks if *compare* is equal to *to* (supports comparison of objects and arrays too)
exactly 			| Checks if *compare* is exactly equal to *to* (uses ===)
greaterThan 		| *compare* > *to*
greaterThanOrEquals | *compare* >= *to*
in 					| *compare* is in the Array *to*;
function(){} 		| This operator allows you to use a custom function of the form: `function(compareValue, toValue){return {Boolean}}`

##### Aggregation
Sometimes you will want a branch to be activated only if more than one condition is true, or in some other complex specific condition. For cases like this, the mixer supports aggregation. The mixer supports applying logical operations on conditions in the following way:

An aggregator object has a single property, denoting the type of aggregation, holding an array of conditions to aggregate. The following condition will only be true if `cond1` and `cond2` are both true:

```js
var cond = {and:[cond1, cond2]};
```

The mixer supports several types of aggregators:

Aggregator 	| Description
----------- | --------------
and 		| If all conditions are true
or 			| If at least one condition is true
nor 		| If all conditions are false
nand 		| If at least one condition is false

By default, if the mixer runs into an array instead of an object, it will treat it as an `and` aggregator and be true only if all conditions within the array are true.

Following are several examples for how to create different aggregations:

```js
// cond1 && cond2
var conds = [cond1, cond2];

// cond1 && (cond2 || cond3)
var conds = [cond1, {or:[cond2,cond3]}];

// (cond1 && cond2) || cond2
var conds = [{or:[{and:[cond1,cond2]},cond3]}]
```

### Variables
Sometimes it is not enough to hard code behaviors into your tasks, sometimes you want behavior to depend on a previous response, or change texts according to randomization. In order to support these behaviors you can use variables. 

The `global` variable is the context of everything that happens within the task manager. It is an object that holds a property for each task that is run. 
The current task object is automatically set into the global, as well as any questions that the user completes. In addition you as a user may extend it manually using the `API.addGlobal` function. You can also set Global by using the `pi-global` attribute of `pi-task`;


```js
API.addGlobal({
	value: 123,
	variable: [1,2,3]
})
```

Each **PIQuest** task has an object associated with it that logs anything that happens within the task. In the duration of the task, this object can be accessed using the `current` object. After the task ends, the object stays available from within the global object as `global.taskName`, where "taskName" is the name associated with this specific task.
The task object is there for you to change. You can extend it to your hearts content using `API.addCurrent`:

```js
API.addCurrent({
	value: 123,
	variable: [1,2,3]
})
```

**PIQuest** task objects have a reserved property called `questions`. `questions` holds an object that keeps track of all questions answered throughout the questionnaire. Each question is logged on to the property with its name; for instance if you have a question named quest1, then `questions.quest1` will hold an object describing the user response.
The following is a list of the response object properties:

Property 			| Description
-------------------	| --------------
response 			| The user response itself.
latency 			| The time from the moment the question was displayed to the last time it was changed.
pristineLatency 	| The time from the moment the question was displayed to the first time it was changed.
declined 			| whether the user declined to answer this question.

Throughout the player there are several components that refer to environmental variables. In particular you should check out [mixer conditions](#conditions) and [templates](#templates).

### Templates
One of the ways to create dynamic questionnaires is using templates. Templates are a format that allows you to dynamically generate settings for your questions. You can replace any non-object setting from within you questions/pages with a template, and it will be rendered according to the [environmental variables](#variables) (The exception to this rule is the `inherit` setting that cannot use templates). 

A template is a string that has a section of the form `<%= %>` in it. Within these brackets you can write any Javascript that you like and it will be evaluated and printed out. For instance, in order to print the global variable "name", you could create a template that looks like this: `My name is <%= global.name%>`.

The player uses [lodash templates](lodash.org/docs#template) internally, you can look them up to see all the possible uses.

Questions and Pages have access to the same local variables, with the exception of questData that is available only to questions.

Variable 	| Description
----------- | -------------
global 		| The global object.
current 	| The current task object.
questions 	| The questions object.
pageData 	| The 'data' attribute from the page.
questData 	| The 'data' attribute from the question (available only within questions).
pageMeta 	| An object describing meta data about the page:</br> `number`: the serial number of this page, `outOf` the overall number of pages, `name`: the name of the current page. These can be used for instance to generate a description of your place within the questionnaire: `<%= pageMeta.number %> out of <%= pageMeta.outOf%>`.

### Inheritance

Each element in PIQuest (page/question) can inherit its attributes from an element set.

#### Sets

The element sets are defined using the `addPagesSet` and `addQuestionsSet` function in the API.

Each set is simply an array of elements that can later be referred to as a base for new elements. Note that the name that you give the set (in the example: base or demographics) is the handle that you later use to refer to it.

```js
API.addQuestionsSet('likert', [
	{type: 'selectOne', numericValues: true}
]);

API.addQuestionsSet('sizeLikert', [
	{inherit: 'likert', answers: ['Big', 'Medium', 'Small']}
]);
```

#### Inheriting

When inheriting an element the new element starts out with all of the parent's attributes and extends them with its own. This means that we use the parent element as a base and then copy in any properties that the child has, overwriting any existing properties.
The only exception to this rule is the `data` objects which we attempt to merge (giving precedence to the child).

Follow this pseudo code:
```js
// The parent page
{
	data: {name: 'jhon', family:'doe'}
	questions: [
		quest1,
		quest2
	]
}

// The child page which attempts to inherit the parent
{
	inherit: 'parent',
	data: {name: 'jack'}
	questions: [
		quest3
	]
}

// The result would be:
{
	data: {name: 'jack', family:'doe'} 	// the child kept its own name but inherited the family name
	stimuli: [							// the questions array was completely overwritten
		quest3
	]
}
```

In order for an element to inherit another element it must use the `inherit` property of the inheriting element.

```js
{
	inherit: inheritObject
}
```

The inherit object has a `set` property defining which element set it should inherit from.
It also has a `type` property that defines what type of inheritance we should use.

We have implemented several types of inheritance:

**random**:
Randomly picks an element from the set. Note that this is the default inheritance type and so it is not obligatory to use the `type` property. You can also use a short cut and set the `set` using a simple string instead of an object (see example below).
* `'setName'`
* `{set: 'setName'}`
* `{set: 'setName', type:'random'}`

**exRandom**:
Picks a random element without repeating the same element until we've gone through the whole set
* `{set: 'setName', type:'exRandom'}`

**bySequence**:
Picks the elements by the order they were inserted into the set
* `{set: 'setName', type:'bySequence'}`

**byData**:
Picks a specific element from the set.
We compare the `data` property to the `element.data` property and if `data` is a subset of `element.data` it picks the element
(this means that if all properties of data property equal to the properties of the same name in element.data it is a fit).
This function will pick only the first element to fit the data.
If the data property is set as a string, we assume it refers to the element handle.

* `{set: 'setName', type: 'byData', data: {block:1, row:2}}` picks the element with both block:1 and row:2
* `{set: 'setName', type: 'byData', data: "myStimHandle"}` picks the element that has the "myStimHandle" handle

**function**:
You may also use a custom function to pick your element.
```js
{set: 'setName', type: function(definitions){
	// definitions is the inherit object (including  set, type, and whatever other properties you'd like to use)
}}
```

##### Customization

Each question/page can also have a customize method, this method is called once the element is inherited but before it is activated.
It accepts two arguments: the source object on which it is called (in this case the appropriate trial object), and the global object. The source object is also the context for the function.

```js
{
	inherit: 'something',
	customize : function(source, globalObject){
	}
}
```
