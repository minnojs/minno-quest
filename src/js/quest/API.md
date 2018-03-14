### Table of contents

- [Pages](#pages)
	- [Page Timer](#page-timer)
	- [Page Messages](#page-messages)
- [Questions](#questions)
	- [Hooks](#hooks)
	- [Info](#info)
	- [Text & Textarea](#text-&-textarea)
	- [textNumber](#textnumber)
	- [dropdown](#dropdown)
	- [selectOne & selectMulti](#selectone-selectmulti)
	- [grid](#grid)
	- [multGrid](#multigrid)
	- [slider](#slider)
	- [rank](#rank)
- [settings](#settings)
	- [onEnd](#onend)
	- [logger](#logger)
	- [timer](#timer)
	- [Debugging](#debugging)
- [Data](#data)
	- [Logs](#logs)
	- [Variables](#variables)

### Pages
The basic unit in PIquest is the **page**. A page is usually one screen in your questionnaire. If your questionnaire presents all its questions in one screen, it will probably have only one page. The properties within a page manage how the question(s) is(are) displayed and how the participants interact with it (e.g., select an answer and then click a submit button).

property		| description
--------------- | ---------------------
name 			| (text) The identifier for this page, is used mainly for logging.
text			| (text) Some html to present above the questions.
decline 		| (true, false, 'double'. default:false) Whether to allow participants decline to answer the questions on this page. This option displays a "decline" button that proceeds to the next page without validation and marks this response as "declined". If decline is set to 'double' then two click are required in order to decline answering.
declineText		| (text) The text for the decline button (default value: "Decline to answer")
prev 			| (true or false) Whether to allow users to return to the previous page. The previous button does not appear on the first page (default value: false).
prevText		| (text) The text for the previous button (default value: "Go Back")
noSubmit		| (true of false) remove submit button (useful when using the 'autoSubmit' function of some questions; default value: false).
submitText		| (text) The text of the submit button (default: "Submit").
header  		| (text) Text for the page header.
headerStyle		| (Object) A [css object](#http://api.jquery.com/css/#css-properties)  to set the style of the header (see examples below).
progressBar 	| (text) Text for the progress bar (You might want to use a template for this, maybe something like: `<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>`.).
numbered 		| (true of false) Whether to  display the number of each question (default value: false).
numberStart		| (Number) The number for the first question in the page (default: 1).
timer 			| (Object) This property controls the page timer, its properties are documented right [here](#page-timer).
questions 		| (Array or Object) an array of [questions](#questions) to be displayed in the page. Note that the questions may be randomized and chosen conditionally using a [mixer](#mixer). This property also accepts a single question object if you want to present only a single question per page.
lognow 			| (true or false) Whether to log the questions on this page. This option is useful when you know that the page will not be accessed any more. It allows you to use the `pulse` option from the [logger](#logger) to send questions as they are being answered instead of sending only at the end of the task. (default: false)
animate 		| (text) What types of animation to use when this page enters and leaves the screen. We currently support three animations: fade, slide, and drop-in. You can use any and all of them by adding them to the string (for example: "slide fade" will activate both of these animations).
v1style			| (true or false or 2) Activate in order to use the version 0.1 style. Currently this only affects the way that the submit/decline buttons are presented. Set this to 2 in order to use the latest version of 0.1
autoFocus 		| (true or false) Automatically focus on the first input in the page so that keyboard users have an easier time.
pageValidation  | (function) A custom validation function. Return `false` if the page is unvalid. You can control the error message using the `pageValidationText` property.
pageValidationText | (text) The error message for cases where `pageValidation` is not valid. By default the error message here is *Page Invalid*.

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

#### Page Timer
The page timer allows you to constrain the time that users have to answer their questions. In order to control it, you may use the following properties.

property		| description
--------------- | ---------------------
duration 		| (number) How long (in seconds) before the timer ends.
submitOnEnd 	| (true or false) Whether to submit when the timer ends (true by default).
show 			| (true or false) Whether to display a visual countdown (true by default).
direction 		| ("up" or "down") Whether to use a countdown or to count up ("down" by default).
removeOnEnd 	| (true or false) Whether to remove the visual timer when the countdown ends (if you don't auto proceed when the timer ends. ).		
message 		| (String or Object) Display a message at the end the timer duration. You can input a simple string here, but if you want finer control over the content of the message you can use the [object API](#page-messages).

#### Page Messages
You may want to display a message to the users when they run out of time at the end of a timer. Messages can be simple strings, or if you want finer control over the content of the message you can use the object API, that may be used as follows:

property		| description
--------------- | ---------------------
header 			| The header text for the message (defaults to "Timer Done").
body 			| The body of the message.
button 			| The close button (defaults to "close").

All these strings may use templates, and have access to the following objects: `global`, `current`, `pagesData`, `pagesMeta`.

### Questions

Here are the types of questions PIQuest currently supports:

- [Info](#info)
- [Text & Textarea](#text-&-textarea)
- [textNumber](#textnumber)
- [dropdown](#dropdown)
- [selectOne & selectMulti](#selectone-selectmulti)
- [grid](#grid)
- [slider](#slider)
    
All question types share some basic properties:

property		| description
--------------- | ---------------------
type 			| (text; default: 'text') Controls the question type. See the possible types below. 
name 			| (text) The name that this question is marked with when it is logged. Also allows you to refer to the question from within PIquest.
stem 			| (text; default: '') The text for the question itself..
stemCss			| A [css object](#http://api.jquery.com/css/#css-properties) to be applied to the stem.
description 	| (text; default: '') Any additional text you want in order to extend the question description.
maxWidth 		| Force question inputs to have this maximum width. The `maxWidth` must include an explicit measuring unit (for example '800px' or '50%').
help			| (true or false;  (default: false)) Whether to display the question help text.
helpText		| (text) The question help text. (Some questions have default help texts, some don't).
lognow 			| (true or false) Whether to log this questions when the page is submitted. This option is useful when you know that the question will not be accessed any more. It allows you to use the `pulse` option from the [logger](#logger) to send questions as they are being answered instead of sending only at the end of the task. (default: false)
errorMsg		| (Object: {}) This object has a property for each validation type. Setting the appropriate type changes the validation message. For instance setting the `required` property will change the validation message for instances where no response was given.

You may want to debug questions by [activating the `question` DEBUG setting](#debugging). You will then be warned in the console if a question name is reused (note: sometimes a question is supposed to be reused, if this warning pops up just make sure the use case is correct).

#### Hooks

Questions have hooks that allow you to respond to many events in the life time of the question. Each hook is invoked with `global`, `current` and the question `log`. 

property		| description
--------------- | ---------------------
onCreate 		| At the creation of the question.
onChange 		| At each change of the question response (note that this hook may be called many times for each question).
onSubmit 		| When the question is submitted.
onDecline 		| When the question is declined.
onTimeout 		| When the timer finishes.
onDestroy 		| When the question is removed from the screen (either decline or submit).

For example, in case the participant made an error you can mark it on the current object:

```js
var questions = {
	stem: 'Please write "Hello"',
	onSubmit: function(log, current){
		// if the question response is not correct
		if (log.response !== 'Hello'){
			// mark an arbitrary flag so that it may be accessed somewhere else
			current.error = true;
		}
	}
}
```

#### Info
The info question isn't strictly a question. It allows you to use the common question properties in order to display information to the users. For example you can use it as follows:

```js
{
	type: 'info',
	description: '<p>The following questions deal with emotions</p>' +
		'<p>Please answer them as honestly as possible</p>'
}
```

This question will simply display the description without offering any additional user interface (explicit question).

#### Text & Textarea
The `text` and `textarea` questions consist of a simple text input in which the users can type in text. The difference between them is that text questions consist of a single line, whereas textareas are multiline. There are also several properties that are unique to textareas.
Both types of questions support the following properties.

property		| description
--------------- | ---------------------
dflt 			| (test; default value: "") The default value for this question.
inline 			| Show the stem in the same line as the input box (this will make the input box narrower as well).
width 			| (Number or text) The width of the input box (By default numbers are translated to pixels, but you can use text to use other units).
autoSubmit 		| (true or false; default: false) If this property is set to true typing `Enter` while this input is focused will submit the page.
minlength 		| (Number) Validation: force at least this number of characters.
minLength 		| @DEPRECATED see minlength. (Number) Validation: force at least this number of characters.
maxlength		| (Number) Validation: force at most this number of characters.
maxlengthLimit 	| (true or false) Do not allow the user to input more characters than defined by `maxlength` (if maxlength is not defined, any number of characters will be allowed).
required		| (true of false; default: false) Validation: require a non-empty string as a response.
pattern			| (text [supports regex]) Validation: require the response to match the regular expression set in pattern (takes either a string <code>"a&#124;b"</code> or a regular expression <code>/a&#124;b/</code>).
correct 		| (true or false; default: false) Validation: require the response to be correct (set the target value using `correctValue`)
correctValue 	| (*) Set the correct response value for the correct validation.
errorMsg		| (Object: {}) This object has a property for each validation type. Setting the appropriate type changes the validation message. For instance setting the `required` property will change the validation message for instances where no response was given.

The following properties are supported only by `textarea`s:

property		| description
--------------- | ---------------------
rows 			| The number of visible text lines.
columns 		| The visible width of the textarea, in average character widths (this setting overrides the width setting).

For example, this is a text question that requires a valid email address (although there are better *patterns* out there for this purpose):

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

#### textNumber
The `textNumber` questions consist of a simple text input that limits the participant to numeric responses only. This type of questions have the following parameters:

property		| description
--------------- | ---------------------
dflt 			| (Number; default: null) The default value for this question.
inline 			| Show the stem in the same line as the input box (this will make the input box narrower as well).
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

#### dropdown
The `dropdown` question presents a dropdown that the user can use to select a single response. It has the following parameters: 

property		| description
--------------- | ---------------------
dflt 			| The default *value* for this question.
autoSubmit 		| (true or false; default: false) If this property is set to true, selecting a response will submit the form.
randomize 		| (true or false; default: false) Shuffle response options after mixing them (the mixer is activated regardless of this parameter, this serves as a shortcut)
reverse 		| (true or false; default: false) Reverses the order of response options in this question. It is useful when you inherit a question and only wants to change the order of the response options. Or, if you want to have a between-participant condition that reverses the response scale for half of the participants.
numericValues 	| (true or false; default: false) If `numericValues` is true, default numeric values are set for each answer, they are set *before* randomization, but *after* the mixer is activated.
answers			| (Array: []) The list of possible answers for this question. There are two acceptable formats; (1) an array of strings/numbers, (2) an array of objects with `text`, `value` and optionally `group` parameters. The `group` parameter will display the values divided into groups with the same name.
required		| (true or false; default: false) Validation: require a response.
correct 		| (true or false; default: false) Validation: require the response to be correct (set the target value using `correctValue`)
correctValue 	| (*) Set the correct response value for the correct validation.
errorMsg		| (Object: {}) This object has a property for each validation type. Setting the appropriate type changes the validation message. For instance setting the `correct` property will change the validation message for instances where the correct response was not given.
chooseText      | (String) The text to show instead of "-- Choose an option --".

#### selectOne & selectMulti
The `selectOne` and `selectMulti` questions present a list of possible response options for the user to pick from. The only difference between them is that select Multi allows the user to select more than one response option. They have the following parameters:

property		| description
--------------- | ---------------------
dflt 			| The default *value* for this question; Use one value for `selectOne`, and an array of values for `selectMulti`.
autoSubmit 		| (true or false; default: false) If this property is set to true, Clicking twice on the same answer will submit the form. This options is not supported for `selectMulti`.
randomize 		| (true or false; default: false) Shuffle response options after mixing them (the mixer is activated regardless of this parameter, this serves as a shortcut)
reverse 		| (true or false; default: false) Reverses the order of response options in this question. It is useful when you inherit a question and only wants to change the order of the response options. Or, if you want to have a between-participant condition that reverses the response scale for half of the participants.
numericValues 	| (true or false; default: false) If `numericValues` is true, default numeric values are set for each answer, they are set *before* randomization, but *after* the mixer is activated.
style 			| The default style for the select questions is a vertical list (`list`). You can display the individual answers as a horizontal button group using `horizontal` instead, or if you have many short answers you can use `multiButtons` (you might want to use `minWidth` in order to fineTune the way your question looks). 
minWidth		| (String, default:auto) The minimum width for individual answers (e.g. '30%' or '200px'). Usefull in concert with `style`.
buttons 		| *@DEPRECATED* (true or false; default: false) Do not use this property any more! use `style` instead. </br> By default we use a vertical list format for this question. Set this property to true in order to use a horizontal scale (Likert style). This option  does not currently support extremely narrow screens.
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

#### grid
The grid question allows you to group multiple "multiple choice" questions into a single table. This is often useful when asking several likert type questions using the same scale.

The grid question itself keeps track of the sum of the row questions (excluding any questions that have non-number values).

Property    	| Description
----------- 	| -----------
columns 		| An array of column descriptions. You can use a string here or a column object as described [below](#gridcolumns).
rows 			| An array of row descriptions. You can use a string here or a row object as described [below](#gridrows).
shuffle 		| Whether to randomize the order of the rows.
required 		| Require the user to respond to all rows (true or false).
columnStemCss	| CSS object for *all* the column stems.
columnStemHide	| Hide the column stem row.
rowStemCss		| CSS object for the row stems.
rowStemHide 	| Hide the row stem column.
checkboxType	| Customize the type of checbox we use. `checkMark`: the default check style. `xMark`: use an X instead of the check. `colorMark`: fill the checkbox with a dark background.
cellLabels 		| Show the column label with the grid cells.
##### grid.columns
If you set a string instead of a column object it will be treated as if you set only the stem and all other values will be set by default.

Property    | Description
----------- | -----------
stem 		| (text) The description of this column.
value 		| The value to set for this column. Defaults to the number of the column (starting from 1, so that the response for choosing the third column is 3).
noReverse 	| When reversing row values, ignore this column (it will retain its normal value).
type		| What type of interface should this column have. 
css 		| CSS object for the whole column. This is the place that you can control the column width (using the `width` property).
stemCss		| CSS object for the column stem.

There are several column types at your disposal, 
Type        | Description
----------- | -----------
checkbox    | The default is "checkbox".
text        | Display text of you choice (use the `textProperty` property to set the row property that will be used as the text).  For example `{type: 'text', textProperty:'rightStem'}` will use the `rightStem` property of each row as the text content.
dropdown    | Display a dropdown input. Use the `answers` property to set the options for the dropdown. For example `{type:'text', answers: ['Male', 'Female']}'. See the [dropdown](#dropdown) question for more `answers` options.
input       | Display a text input. Note that users can input responses that may be confused with other responses (if a user inputs a 1 it may be confused with a selection of a checkbox in the first column).

##### grid.rows
If you set a string instead of a row object it will be treated as if you set only the stem and all other values will be set by default.

Property     | Description
----------- | -----------
stem 		| (text) The description of this column.
name 		| The name you want this row to be called within the `questions` object. If this is not set the grid automatically sets it according to the grid name. So that if grid.name is "myGrid" then you're first row will be called by default "myGrid001".
reverse 	| When calculating the default value for this row, should we reverse the order of columns (high to low and vise versa).
required 	| Require the user to respond to this row (this property is redundant if you've already set main questions required property to true).
overwrite   | An array of column deffinitions to overwrite. Each element of the array overwrites the corresponding column column (so that the first element in the array overwrites the first column definitions and so on). If you do not want to overwrite a specific column, simply set it to `false`.

Here is a simple example of using a grid:

```js
var grid = 	{
	type: 'grid',
	name:'grid',
	columns: ['Strongly agree' , 'agree' , 'don\'t know' , 'disagree' , 'Strongly disagree'],
	rows: ['I like grids', 'I like bananas too']
}
```

You can, of course have tighter control over the way things work:

```js
var grid = 	{
	type: 'grid',
	name:'grid',
	columns: [
		'Strongly agree',
		'agree',
		'don\'t know',
		'disagree',
		'Strongly disagree',
		{stem:'Decline to answer', value:'n/a', noReverse:true}
	],
	rows: [
		{stem:'I like grids',name:'likeGrids'},
		// This questions scores will be reversed so that the sum of scores is meaningful 
		{stem:'I hate bananas', name:'likeBananas', reverse:true},

        // Allow only the extreme responses and declining to answer for this row only
		{stem:'Only extremes', name:'extremes', overwrite:[false, {type:'text'}, {type:'text'}, {type:'text'}, false, false]}
	]
}
```

#### multiGrid
The multiGrid question allows you to group multiple questions into a single table. 
This is often useful when you are asking a set of simple qustions repeatedly.

The response for this question is an array of responses corresponding to the columns of the grid, so that the first item in the array corresponds to the response in the first column and so on.

Property    	| Description
----------- 	| -----------
columns 		| An array of column descriptions. You can use a string here or a column object as described [below](#multigridcolumns).
rows 			| An array of row descriptions. You can use a string here or a row object as described [below](#multigridrows).
shuffle 		| Whether to randomize the order of the rows.
columnStemCss	| CSS object for *all* the column stems.
columnStemHide	| Hide the column stem row.
rowStemCss		| CSS object for the row stems.
rowStemHide 	| Hide the row stem column.
checkboxType	| Customize the type of checbox we use. `checkMark`: the default check style. `xMark`: use an X instead of the check. `colorMark`: fill the checkbox with a dark background.
cellLabels 		| Show the column label within the grid cells.
required        | Require all subquestions in the multigrid to be full

##### multiGrid.columns
If you set a string instead of a column object it will be treated as if you set only the stem and all other values will be set by default.

Property    | Description
----------- | -----------
stem 		| (text) The description of this column.
value 		| The value to set for this column checkboxes. Defaults to `true`.
type		| What type of interface should this column have (see below, defaults to checkbox)
css 		| CSS object for the whole column. This is the place that you can control the column width (using the `width` property).
stemCss		| CSS object for the column stem.
required    | Require all subquestions in the column to be full
pattern     | (text or [regular expression](http://www.regular-expressions.info/)) Require all subquestions in the column to match the pattern. This validation method only affects input type columns.

There are several column types at your disposal, 

Type        | Description
----------- | -----------
checkbox    | The default is "checkbox".
text        | Display text of you choice (use the `textProperty` property to set the row property that will be used as the text).  For example `{type: 'text', textProperty:'rightStem'}` will use the `rightStem` property of each row as the text content. You can use this option to present an empty cell by leaving the text empty.
dropdown    | Display a dropdown input. Use the `answers` property to set the options for the dropdown. For example `{type:'text', answers: ['Male', 'Female']}'. See the [dropdown](#dropdown) question for more `answers` options.
input       | Display a text input. Note that users can input responses that may be confused with other responses (if a user inputs a 1 it may be confused with a selection of a checkbox in the first column).

##### multiGrid.rows
If you set a string instead of a row object it will be treated as if you set only the stem and all other values will be set by default.

Property     | Description
----------- | -----------
stem 		| (text) The description of this row.
name 		| The name you want this row to be called within the `questions` object. If this is not set the grid automatically sets it according to the grid name. So that if grid.name is "myGrid" then you're first row will be called by default "myGrid001".
overwrite   | An array of column deffinitions to overwrite. Each element of the array overwrites the corresponding column column (so that the first element in the array overwrites the first column definitions and so on). If you do not want to overwrite a specific column, simply set it to `false`.
required    | Require all subquestions in the row to be full

Here is a simple example of using a multiGrid:

```js
var multiGrid = 	{
	type: 'multiGrid',
	name:'multiGrid',
	columns: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	rows: ['Days you work out', 'Days you go to work']
}
```

You can, of course have tighter control over the way things work:

```js
var grid = 	{
	type: 'multiGrid',
	name:'multiGrid',
	columns: [
		{stem:'Gender', type:'dropdown', answers: ['Male', 'Female']},
        'Study together',
        'Work together',
		{stem:'Description', type:'input'}
	],
	rows: ['Friend 1', 'Friend 2' ]
}
```

#### slider
The slider question presents a slider that allows the user to pick a response along a preassigned range. It allows either the creation a continuous scale or dividing the range into steps. The values of the slider are always numbers.
These are the supported properties:

Property    			| Description
----------- 			| -----------
min         			| Maximum slider value (default:0).
max         			| Minimum slider value (default:100).
highlight   			| Show highlight to left of handle.
highlightDirection 		| By default the slider highlight goes from left to right. If you want it to go right to left set the property to 'rtl'. If you want the highlight to begin at the center, set this to 'center'.
steps       			| How many steps the slider should be divided into. These intervals are marked with pips and the handle snaps to them.
hidePips 				| When the slider is divided into steps, do not display the step pips.
showTicks 				| @EXPERIMENATAL: this option may change in the future. Mark three vertical lines to accent the slider visually.
leftLabel   			| A label to display on the top left of the slider.
leftLabelCss			| A style object to apply to the left label.
rightLabel  			| A label to display on the top right of the slider.
rightLabelCss			| A style object to apply to the right label.
labels					| An array of labels to display underneath the slider. They will be spread evenly across the slider.
displayValue			| Display the value of the slider, beneath the slider control.
required				| (true of false; default: false) Validation: require a non-empty string as a response.
dflt 					| The default value for the slider. If no default value is defined, the handle will not be displayed until the slider is first clicked.
autoSubmit				| Submit automatically on click or when handle is drop.

The most common use of the slider is the creation of a visual analog scale (VAS). This is an example of using a slider to create a Likert type scale:

```js
var quest = {
	type: 'slider',
	stem: 'Sliders are exremely useful.',
	min:1,
	max:7,
	steps:7,
	labels: ['Strongly Agree', 'Neutral', 'Strongly Disagree']	
}
```

#### rank
Ranking questions allow your subjects to sort a list of values.
By default elements in the list are randomized.
The response returned by this question is an array of numbers corresponding to the original - pre-randomized list.
For example if you had a list `['a','b','c']` and it was sorted into`['a','c','b']` then the response array will be `[1,3,2]` because the second and third element changed locations. 

The syntax is fairly simple:

```js
var quest = {
      type: 'rank', 
      stem: 'Please sort the follownig activities according to level of difficulty:',
      name: 'mart',
      correct: false,
      list: ['Cooking', 'Running', 'Dancing', 'Studying']
}
```

Property    | Description
----------  | -----------
type        | Must be set to `'rank'`.
list        | (Array) An array values to be sorted (can be either strings or numbers).
required    | (true of false; default: false) Require the user to make a change from the original order (as defined in `list`).
correct     | (true of false; default: false) Require the user to order the list according to a preset value (as defined in `correctValue`
correctValue| (Array) The order that the list should be organized for the `correct` validator. This value should be a list of numbers coresponding to the target order.
randomize   | (true of false; default: true) If false prevents the automatic randomization of the list order.

### settings
Settings allow you to control the generic way that the player works. Change the settings using the `addSettings` function. The first argument to the function is always the name of the setting, the second argument is the setting values. In case the setting is an object, subsequent objects will extend each other so that settings may be progressively added.

#### onEnd
`onEnd` is a function to be called as soon as the task ends. It should be taken care of automatically when PIQuest is run from within the task manager.

```js
API.addSettings('onEnd', function(){
	// Do something: for instance, redirect to 'my/url.js'
	location.href = 'my/url.js';
});
```

#### logger
This setting controls the way that logging works within the player.

```js
API.addSettings("logger", {
	pulse: 34,
	url: '/my/url',	
	logfn: function(log,pagesData, global){
		return {name: log.name, set: global.setName};
	}
});
```

Setting 	| Description
----------- | ---------------
pulse 		| (Number; Default: 0) How many rows to collect before posting to the server. 0 means that the player sends to the server only at the end of the task. Note that only questions and pages marked with the `lognow` property will be pulsed. All other questions will be sent at the end of the task.
url 		| (Text; default:"") The URL to which we should post the data to.
logfn 		| (Function) The task has a default object that it logs, if you want to change the logged object itself, you may use a function of the form: `function(log, pagesData, global){return logObj;}`
error       | (Function) A function to manage errors in logging. It gets called when a post to the server fails.

Within the player, each question (as defined by unique question name) may be logged only once. By default questions are logged at the end of a page (on submit or decline), if you want to delay logging until the end of the task, you may do so by setting `nolog` in the appropriate page or question.

If you want a question not to be logged at all, simply do not give it a name.

You may want to debug the logger by [activating the DEBUG `logger` setting](#debugging). When activated, it prints each logged object into the console.

#### Timer
The questionnaire timer allows you to constrain the time that users have to answer the whole questionnaire.

```js
API.addSettings('timer', {
	duration: 10,
	message: {
		header: 'Time out!',
		body: 'You will now be redirected to the next task.'
	}
});
```

In order to control it, you may use the following properties.

property		| description
--------------- | ---------------------
duration 		| (number) How long (in seconds) before the timer ends.
show 			| (true or false) Whether to display a visual countdown (true by default).
direction 		| ("up" or "down") Whether to use a countdown or to count up ("down" by default).
removeOnEnd 	| (true or false) Whether to remove the visual timer when the countdown ends (if you don't auto proceed when the timer ends. ).		
message 		| (String or Object) Display a message at the end the timer duration. You can imput a simple string here. If you want finer control over the content of the message you can use the an object with the following properties: `header`: the header text for the message (defaults to "Timer Done"). `body`: the body of the message. `button`: the close button (defaults to "close").




#### Debugging
PIQuest can supply some extra information regarding its inner workings, all you have to do is set the DEBUG setting property like so:

```js
// Log everything
API.addSettings('DEBUG', {
	level: 'warn', // log errors and warnings
	tags: ['page','animation'], // Log page and animation related messages
	hideConsole: true 
});
```

**tags**:
Logs are broken down into subjects by tags. The tags property allows you to insert an array of tags that you want to be logged. If you want all tags to printed you may use the string `'all'` instead of an array (this is also the default).

The tags currently available are as follows: `page`, `question`, `conditions` and `animate`.

**level**:
The player has several levels of logging, by default it logs only `error` level logs. When you want to debug you should probably use `info` or `warn`. The precedence of logging levels is as follows: error>warn>info>debug. Each logging level includes any levels higher than itself.

level 	| Description
----- 	| -----------
none 	| Do not log any messages
error 	| Log messages that warn that something in the script is broken (this is the default level, and you should probably leave at least this level active).
warn 	| Log warning messages that something smells fishy, these are not necessarily errors, but you might want to check them out.
info 	| Log General useful information.
debug 	| Just spill everything out.

**hideConsole**:
This property allows you to control the display of logs inside the browser, if it is set to `true` then the logs will only be printed into your console.

## Data
### Logs
piQuest keeps record of user responses using plain js objects. These objects are kept locally (see #variables) and sent to the server (see [logger](#logger) setting).

Following are the properties of the logged object:

Property 		| Description
----------- 	| -----------
name 			| The `name` of the question.
response 		| The actual response for this question. This may be a string, a number or even an array.
declined 		| Whether or not the question was declined (if a question was declined, the response field will be undefined).
latency 		| The time (from question presentation) to the last change of this response.
submitLatency	| The time (from question presentation) to the time this page was submitted.

### Variables

The data logs are available as variables under the current object like so:

```js
current.questions = {
	questionName1 : {...}, // log object
	questionName2 : {...} // log object
}
```

The response for questionName1 can be accessed using `current.questions.questionName1.response`. You can use this data within [templates](../basics/sequencer.html#templates) or from within [branches](../basics/sequencer.html#conditions).
