[![Build Status](https://travis-ci.org/ProjectImplicit/PIquest.svg?branch=master)](https://travis-ci.org/ProjectImplicit/PIquest)

# PIquest

PIquest is a framework for administering on-line questionnaires.

It is written in JavaScript and is built to be extremely versatile and customizable. The scripts for are written as JavaScript objects. This format allows writing simple and straightforward scripts using a constrained scripting language. The format also allows advanced users to easily create complex and dynamic scripts using in-line JavaScript.

### Table of contents

* [Central concepts](#central-concepts)
* [A short introduction ](#a-short-introduction)
* [Pages](#pages)
* [Questions](#questions)
	- [text](#text)
	- [textNumber](#textnumber)
	- [select](#select)
	- [selectOne & selectMulti](#selectone-selectmulti)
* [Settings](#settings)
* [Making your questionnaire Dynamic](#making-your-questionnaire-dynamic)
	- [The mixer ](#mixer)
		+ [Mixer types](#mixer-types)
		+ [Conditions](#conditions)
		+ [Operators](#operators)
		+ [Aggregation](#aggregation)
	- [Variables](#variables)
	- [Templates](#templates)
	- [Inheritance ](#inheritance)


### Central concepts

The player treats each questionnaire a **sequence** of **pages**. Each page may have one or more **questions**.

The pages are set into a sequence and presented sequentially. This is essentially all you need to know in order to start writing questionnaires.

The sequence supports ***mixers*** that allow randomizing the order of the pages (or questions) that you create, and other features often needed when creating the sequence of a questionnaire. The questionnaire also supports an *inheritance* system, that allows abstracting questionnaires and makes them shorter, simpler, more dynamic, and most important, reusable.

Questionnaires are created by writing a Java-script object that has several property objects: `settings`, `sequence`, `pages`, `questions`, `global` and `current`. Some of these properties have to do with advanced uses of the player. The only objects that you **have** to know are `sequence` and `settings`. We'll first show a simple questionnaire, then go through each of the more advanced options.

### A short introduction

The basic unit in PIquest's scripts is the page. A page represents one screen in the questionnaire. A page can have a few properties to define its settings, and, most importantly, a list of one or more questions that will be displayed in the page. Here is the most basic page. It only has the `questions` property. It creates a simple page with no header/progress-bar/decline button, and other features.

```js
var page = {
	questions: []
}
```

There are plenty of additional features that [pages have](#pages), but this is the very minimum that you'll need.

Well, you also need to define the questions. There are several [types of questions](#questions). All share a few basic properties.

```js
var question = {
	type: 'text',
	name: 'myQuestName',
	stem: 'What would you like to know?'
}
```

The `type` of question is the first decision that you have to make, it defines the question type and interface. This is where you decide if you want the user to enter some text, choose from a list or use a slider. The `name` is the question's name to save when logged to the server. The name also allows you to refer to the question from other objects. Finally, `stem` is the text that will be displayed.

The question in the example above shows a text input with the question 'What would you like to know?'. 

Here is an example of a `selectOne` question that prompts the user to choose one response out of a list of answers: red, blue or green.

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

Now that we know how to create questions, let's create the sequence. The main component of your questionnaire will always be the sequence. The sequence describes the course of your questionnaire; most of the time it is possible to create everything that you want just within the sequence (i.e., define all the pages and all the questions when you define the sequence). The sequence is a javascript array of page objects that are activated one after the other. The following sequence includes two pages, the first has two questions, the second only one:

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

The sequence also supports randomization and branching. Read about it [here](#mixer).

Now that we've created the sequence, let's put it into the player. The first and last two lines are the same for all scripts (they have to do with the way Javascript works), you can simply ignore them. The `API` object assists you in putting your script together, you will [eventually](#API) learn more about its functionality, but for now we only need to know that the `addSequence` function is responsible for adding pages into the sequence. You may call it as many times as you like.

```js
define(['questAPI'], function(quest){
	var API = new quest();

	API.addSequence([
		{
			questions:[
				{
					type: 'text',
					stem: 'What is your name?'
				},
				{
					type: 'selectOne',
					stem: 'How are you?',
					answers: ['good', 'fair' ,'bad']
				}
			]
		},
		{
			questions:[
				{
					type: 'text',
					stem: 'What is your name again?'
				}
			]
		}
	]);

	return API.script;
});
```

That's it! PIquest has loads of additional features (as you can read below), but this was the very basic information that you must know first. (by the way, if you want to log the responses to your questions you should learn about the [ logger setting ](#settings)).

### Pages
The basic unit in PIquest is the **page**. A page is usually one screen in your questionnaire. If your questionnaire presents all its questions in one screen, it will probably have only one page. The properties within a page manage how the question(s) is(are) displayed and how the participants interact with it (e.g., select an answer and then click a submit button).

 property		| description
 -------------- | ---------------------
name 			| (text) The identifier for this page, is used mainly for logging
decline 		| (true or false) Whether to allow participants decline to answer the questions on this page. This option displays a "decline" button that proceeds to the next page without validation and marks this response as "declined" (default value: false).
declineText		| (text) The text for the decline button (default value: "Decline to answer")
prev 			| (true or false) Whether to allow users to return to the previous page. The previous button does not appear on the first page (default value: false).
prevText		| (text) The text for the previous button (default value: "Go Back")
noSubmit		| (true of false) remove submit button (useful when using the 'autoSubmit' function of some questions; default value: false).
submitText		| (text) The text of the submit button (default: "Submit").
header  		| (text) Text for the page header.
headerStyle		| (Object) An object to set the style of the header (has most css properties; see examples below).
progressBar 	| (text) Text for the progress bar (You might want to use a template for this, maybe something like: `<%= pageMeta.number %> out of <%= pageMeta.outOf%>`.).
numbered 		| (true of false) Whether to  display the number of each question (default value: false).
numberStart		| (Number) The number for the first question in the page (default: 1).
timeout 		| (Number) If this is set to a positive integer *x*, the page auto-submits after *x* milliseconds (no validation allowed).
timeoutMessage	| (text) An optional message to be displayed upon timeout. (default: "")
questions 		| (Array) an array of [questions](#questions) to be displayed in the page. Note that the questions may be randomized and chosen conditionally using a [mixer](#mixer).
lognow 			| (true or false) Whether to log the questions on this page. This option is useful when you know that the page will not be accessed any more. It allows you to use the `pulse` option from the [logger](#logger) to send questions as they are being answered instead of sending only at the end of the task. (default: false)

For example, a page can look something like this:

```js
var page = {
	header: 'Personal information:',
	headerStyle: {'background-color':'red',color:'blue'},
	decline: true,
	declineText: 'I prefer to keep this information to myself',
	questions: [
		{type:'text', stem:'What is your name?'},
		{type:'text', stem:'Where do you live?'}
	]
}
```

### Questions

Here are the types of questions PIQuest currently supports:
- [text](#text)
- [textNumber](#textNumber)
- [selectOne & selectMulti](#selectone-selectmulti)

All question types share some basic properties:

property		| description
--------------- | ---------------------
type 			| (text; default: 'text') Controls the question type. See the possible types below. 
name 			| (text) The name that this question is marked with when it is logged. Also allows you to refer to the question from within PIquest.
stem 			| (text; default: '') The text for the question itself..
help			| (true or false;  (default: false)) Whether to display the question help text.
helpText		| (text) The question help text. (Some questions have default help texts, some don't).
lognow 			| (true or false) Whether to log this questions when the page is submited. This option is useful when you know that the question will not be accessed any more. It allows you to use the `pulse` option from the [logger](#logger) to send questions as they are being answered instead of sending only at the end of the task. (default: false)
DEBUG 			| (true or false) Warn in the console if a question name is reused (note: sometimes a question is supposed to be reused, if this warning pops up just make sure the use case is correct).

##### Text
The `text` questions consist of a simple text input in which the users can type in text. These kind of questions have the following properties:

property		| description
--------------- | ---------------------
dflt 			| (test; default value: "") The default value for this question.
autoSubmit 		| (true or false; default: false) If this property is set to true typing `Enter` while this input is focused will submit the page.
minlength 		| (Number) Validation: force at least this number of characters.
maxlength		| (Number) Validation: force at most this number of characters.
required		| (true of false; default: false) Validation: require a non-empty string as a response.
pattern			| (text [supports regex]) Validation: require the response to match the regular expression set in pattern.
correct 		| (true or false; default: false) Validation: require the response to be correct (set the target value using `correctValue`)
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
The `textNumber` questions consist of a simple text input that limits the participant to numeric responses only. This type of questions have the following parameters:

property		| description
--------------- | ---------------------
dflt 			| (Number; default: null) The default value for this question.
autoSubmit 		| (true or false; default: false) If this property is set to true typing `Enter` while this input is focused will submit the form.
min 			| (Number) Validation: minimum valid number.
max				| (Number) Validation: maximum valid number.
required		| (true or false; default: false) Validation: require a non empty string as a response.
correct 		| (true or false; default: false) Validation: require the response to be correct (set the target value using `correctValue`)
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

##### dropdown
The `dropdown` question presents a dropdown that the user can use to select a single response. It has the following parameters: 

property		| description
--------------- | ---------------------
dflt 			| The default *value* for this question.
autoSubmit 		| (true or false; default: false) If this property is set to true, selecting a response will submit the form.
randomize 		| (true or false; default: false) Shuffle response options after mixing them (the mixer is activated regardless of this parameter, this serves as a shortcut)
reverse 		| (true or false; default: false) Reverses the order of response options in this question. It is useful when you inherit a question and only wants to change the order of the response options. Or, if you want to have a between-participant condition that reverses the response scale for half of the participants.
numericValues 	| (true or false; default: false) If `numericValues` is true, default numeric values are set for each answer, they are set *before* randomization, but *after* the mixer is activated.
answers			| (Array: []) The list of possible answers for this question. There are two acceptable formats; (1) an array of strings/numbers, (2) an array of objects with `text`, `value` and optionally `group` parameters. The `group` parameter will display the values devided into groups with the same name.
required		| (true or false; default: false) Validation: require a response.
correct 		| (true or false; default: false) Validation: require the response to be correct (set the target value using `correctValue`)
correctValue 	| (*) Set the correct response value for the correct validation.
errorMsg		| (Object: {}) This object has a property for each validation type. Setting the appropriate type changes the validation message. For instance setting the `correct` property will change the validation message for instances where the correct response was not given.

##### selectOne & selectMulti
The `selectOne` and `selectMulti` questions present a list of possible response options for the user to pick from. The only difference between them is that select Multi allows the user to select more than one response option. They have the following parameters:

property		| description
--------------- | ---------------------
dflt 			| The default *value* for this question; Use one value for `selectOne`, and an array of values for `selectMulti`.
autoSubmit 		| (true or false; default: false) If this property is set to true, Clicking twice on the same answer will submit the form. This options is not supported for `selectMulti`.
randomize 		| (true or false; default: false) Shuffle response options after mixing them (the mixer is activated regardless of this parameter, this serves as a shortcut)
reverse 		| (true or false; default: false) Reverses the order of response options in this question. It is useful when you inherit a question and only wants to change the order of the response options. Or, if you want to have a between-participant condition that reverses the response scale for half of the participants.
numericValues 	| (true or false; default: false) If `numericValues` is true, default numeric values are set for each answer, they are set *before* randomization, but *after* the mixer is activated.
buttons 		| (true or false; default: false) By default we use a vertical list format for this question. Set this property to true in order to use a horizontal scale (Likert style). This option  does not currently support extremely narrow screens.
answers			| (Array: []) The list of possible answers for this question. There are two acceptable formats; (1) an array of strings/numbers, (2) an array of objects with `text` and `value` parameters.
required		| (true or false; default: false) Validation: require a response.
correct 		| (true or false; default: false) Validation: require the response to be correct (set the target value using `correctValue`)
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
Settings allow you to control the generic way that the player works. Change the settings using the `addSettings` function. The first argument to the function is always the name of the setting, the second argument is the setting values. In case the setting is an object, subsequent objects will extend each other so that settings may be progressively added.

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
	logfn: function(log,pagesData, global){
		return {name: log.name, set: global.setName};
	}
});
```

Setting 	| Description
----------- | ---------------
pulse 		| (Number; Default: 0) How many rows to collect before posting to the server. 0 means that the player sends to the server only at the end of the task.
url 		| (Text; default:"") The URL to which we should post the data to.
DEBUG 		| (true or false; default: false) When set to true, prints each logged object in the console.
logfn 		| (Function) The task has a default object that it logs, if you want to change the logged object itself, you may use a function of the form: `function(log, pagesData, global){return logObj;}`

Within the player, each question (as defined by unique question name) may be logged only once. By default questions are logged at the end of a page (on submit or decline), if you want to delay logging until the end of the task, you may do so by setting `nolog` in the appropriate page or question.

If you want a question not to be logged at all, simply do not give it a name.

### Making your questionnaire dynamic
There are several ways that you can make your questionnaire more dynamic. We will give a short overview and then get into the specifics.

The basic elements of the player (pages or questions) are set into ordered lists (arrays). The player parses these lists into the questionnaire that the user eventually sees.

The first level of parsing has to do with the order that the elements appear.The [mixer](#mixer) allows you to control the order of the lists; it allows you to randomize the order, duplicate elements and even display them conditionally.

The second level of parsing has to do with inheritance. Many times you want to present several elements that share some of the same features (for instance, you may want all your pages to have the same header or the same submit text). The [inherit ](#inheritance) feature allows you to create prototypes of elements that you may reuse thought your script.

The third and last level of parsing has to do with templates. [Templates](#templates) allow you to change the settings of your elements depending on existing data from within the player. For instance, you may want to refer to the answer of a previous question. 

Some sequence may be parsed more than once, for instance, the questions sequences get re-parsed each time a response is changed, and each time a user returns to a page it is re-parsed. By default, none of the parsing is repeated so that the questionnaires can stay fixed. For each type of parsing there is a property that lets the player know that you want it re-parsed.

In order to re-parse mixers, set `remix` to true. In order to re-parse inheritance set `reinflate` to true. In order to re-parse templates set `regenerateTemplate` to true.

Another consideration when creating complex sequnces is logging. By default the player logs user responses automaticaly as soon as the user submits. If you are creating a sequence that allows users to go back to previous questions etc. you should make sure you don't prematurely log the user response (use `nolog`. learn more [here](#logger)).

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

The `mixer` property defines the mixer type. It tells the mixer what to do with the list. The `data` property defines the list; an array of elements (either plain objects or mixer objects).

A sequence can look something like this:

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

**repeat**:
Repeats the element in `data` `times` times.
* `{mixer:'repeat', times:10, data: [obj1,obj2]}`

**random**:
Randomizes the order of elements in `data`.
* `{mixer:'random', data: [obj1,obj2]}`

**weightedRandom**:
Selects a single element using a weighted random algorithm. Each element in `data` is given the appropriate weight from `weights`. In the following example obj2 has four times the probability of being selected as obj1.
* `{mixer:'weightedRandom', weights: [0.2,0.8], data: [obj1,obj2]}`

**choose**:
Selects `n` random elements from `data` (by default the chooser picks one element).
* `{mixer:'choose', data: [obj1,obj2]}` pick one of these two objs
* `{mixer:'choose', n:2, data: [obj1,obj2,obj3]}` pick two of these three objs

**wrapper**:
The wrapper mixer serves a sort of parenthesis for the mixer. In case you want to keep a set of elements as a block (when randomizing) simply wrap them and they'll stay together.
* `{mixer:'wrapper', data: [obj1,obj2]}`

**branch**:
* `{mixer:'branch', conditions:[cond], data:[obj1,obj2]}`
* `{mixer:'branch', conditions:[cond], data:[obj1,obj2], elseData: [obj3, obj4]}`
Select the elements in `data` if all the conditions in the `conditions` array are true, select the elements in `elseData` if at least one of the conditions in `conditions` are not true. If `elseData` is not defined, or is left empty, then nothing happen in case the conditions are not true (See [conditions](#conditions) to learn about how conditions work).

**multiBranch**:
```js
{
    mixer: 'multiBranch',
    branches: [
        {conditions: [],data: []},
        {conditions: [],data: []}
    ],
    elseData: [] // optional
}
```
Find the first object within `branches` for which `conditions` is true, and select the elements in that objects `data`. If no object is selected then select `elseData` (optional). (See [conditions](#conditions) to learn about how conditions work).

##### Conditions
The conditional mixers allow you to change the content of a list according to [environmental variables](#variables). Each list has specific variables available to it, you can find the relevant details in the documentation for each list, but all lists have access to the `global` and `current` objects, so we'll use them for all examples here.

A condition is a proposition, it is evaluated to either a `true` or `false` value. Conditions are used for decision making within the branching mixers. Conditions are represented by objects. The following condition object `compare`s **global.var** `to` **local.otherVar** and examines if they are equal (if you aren't sure what **global.var** means, see [here](#variables)):

```js
var cond = {
	compare: 'global.myVar',
	to: 'local.myOtherVar'
}
```

Conditions should be treated as a type of equation.

In `compare` and `to` you can use simple values or values that are actually the name of a variable: 
```js
//Compares the variable time to the value 12
var cond1 = {
	compare: 'global.time',
	to: '12'
}
//Compare the variable gender to the value 'Female'
var cond2 = {
	compare: 'Female',
	to: 'local.gender'
}
```

When you want to refer to a variable, you use text with dots: `global.var`, `questions.q1.response`; these values will be treated as pointing to variables within the lists context. `questions.q1.response` will retrieve the value of the response for q1 from the questions object. The following checks whether the global variable var is equal to 15.

Here are the condition's possible properties:

Property 		| Description
--------------- | -------------------
compare 		| The left side of the equation.
to 				| The right side of the equation.
operator 		| The type of comparison to do (read more about operators [here](#operators)).
DEBUG 			| If `true`, then any condition that is evaluated will be logged to the console.

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
One of the ways to create dynamic questionnaires is using templates. Templates are a format that allows you to dynamically generate settings for your questions. You can replace any non-object setting from within your questions/pages with a template, and it will be rendered according to the [environmental variables](#variables) (The exception to this rule is the `inherit` setting that cannot use templates).

A template is a string that has a section of the form `<%= %>` in it. Within these brackets you can write any Javascript that you like and it will be evaluated and printed out. The main use of templates is probably accessing local and global variables. For instance, in order to print the global variable "name", you could create a template that looks like this: `My name is <%= global.name%>`.

The player uses [lodash templates](http://lodash.com/docs#template) internally, you can look them up to see all the possible uses.

Templates allow access only to a confined number of variables; following is a list of the variables that you can access from within templates:

Variable 	| Description
----------- | -------------
global 		| The global object.
current 	| The current task object.
questions 	| The questions object.
pagesData 	| The 'data' attribute from the page.
questionsData 	| The 'data' attribute from the question (available only within questions).
pageMeta 	| An object describing meta data about the page:</br> `number`: the serial number of this page, `outOf` the overall number of pages, `name`: the name of the current page. These can be used for instance to generate a description of your place within the questionnaire: `<%= pageMeta.number %> out of <%= pageMeta.outOf%>`.

Questions and Pages have access to the same local variables, with the exception of questionsData that is available only to questions.

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
Randomly selects an element from the set (in case the set has only one element, the same element will always be selected, of course). 
* `'setName'`
* `{set: 'setName'}`
* `{set: 'setName', type:'random'}`
`random` this is the default inheritance type, so it is not obligatory to use the `type` property. You can also use a short cut and set the `set` using only its name, like we did in the example above:
```js
{
	inherit: 'parent',
	data: {name: 'jack'}
	questions: [
		quest3
	]
}
```

**exRandom**:
Selects a random element without repeating the same element until we've gone through the whole set
* `{set: 'setName', type:'exRandom'}`

**bySequence**:
Selects the elements by the order they were inserted into the set
* `{set: 'setName', type:'bySequence'}`

**byData**:
Selects a specific element from the set.
We compare the `data` property to the `element.data` property and if `data` is a subset of `element.data` it selects the element (this means that if all properties of data property equal to the properties of the same name in element.data it is a fit).
This function will select only the first element to fit the data.
If the data property is set as a string, we assume it refers to the element handle.

* `{set: 'setName', type: 'byData', data: {block:1, row:2}}` picks the element with both block:1 and row:2
* `{set: 'setName', type: 'byData', data: "myStimHandle"}` picks the element that has the "myStimHandle" handle

**function**:
You may also use a custom function to select your element.
```js
{set: 'setName', type: function(definitions){
	// definitions is the inherit object (including  set, type, and whatever other properties you'd like to use)
}}
```

##### Customization

Each question/page can also define a `customize` method, this method is called once the element is inherited but before it is activated.
It accepts two argument: the source object on which it is called (the page or question object), and the global object (in which you can find the current object etc.). The source object is also the context for the function.

```js
{
	inherit: 'something',
	customize : function(source){
		source.questions.push(quest);
	}
}
```
