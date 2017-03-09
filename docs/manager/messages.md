# Messages

The message tasks are built to be as simple as possible, all they do is present simple html templates. In order to load a template simply set it into the `template` property as a string, or set the appropriate URL into `templateUrl`. 
That's it. (This is not relevant for most users, but the templates are rendered using angularjs $compile and therefore all the relevant directives are available).

The context for the template has the following variables available: {global, current, task}.

property        | description
--------------- | ---------------------
template        | (text) A string of html to display (The template uses [lodash templates](https://lodash.com/docs#template)).
templateUrl     | (text) A url to a html template (The template uses [lodash templates](https://lodash.com/docs#template)).
keys            | Sets a key (or keys) that allow users to proceed. The keys property takes either a key (i.e. `'a'`) a keyCode (i.e. `65`) or an array of such (i.e. `['a','b']`).

&nbsp;

The following example will display the message "Hello World. I am a template.", and proceed when the **keys** space is pressed.

```javascript
var task = {
    template: '<div>Hello World. I am a template.</div>',
    keys: ' '
}
```

The following task will do the exact same thing using two separate files:

*manager.js*
```javascript
var task = {
    templateUrl: 'hello.jst',
    keys: ' '
}
```

*hello.jst*
```html
<div>Hello World. I am a template.</div>
```

### Proceeding

There are two types of controls that allow users to proceed to the next task.

First, you can use any element in your template as a proceed button, all you have to do is add the `pi-message-done` attribute to the appropriate element.

```html
<button type="button" pi-message-done>Click here to proceed</button>
```

Alternatively you may use the `keys` property in order to set a key (or keys) that proceed. The keys property takes either a key (i.e. `'a'`) a keyCode (i.e. `65`) or an array of such (i.e. `['a','b']`).

This table shows several useful keyCodes for your convenience (there are more [here](http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)):

Code    | Function
------- | -----------
13      | Enter
27      | Escape
32      | Space
37      | Left arrow
38      | Up arrow
39      | Right arrow
40      | Down arrow

### Links out
PI tasks have a system to prevent accidental browsing away from your tasks.
It will ask the user if she is sure that she wants to navigate away.
When using links within you tasks you want the links to allow immediate navigation away.
In order to do that, all you have to do is add a `pi-link` attribute to your link,

```javascriptt
<a href="google.com" pi-link>Link text</a>
```

## Project Implicit build

The project implicit build has an optional "meta template" that you may use by setting the `piTemplate` property to true. When using it, you have several additional options.

Property        | Description
--------------- | ---------------------
piTemplate      | (true, false or 'debrief') Activates the PI template. If set to 'debrief' activates the debrief template, and makes the debrief functions available.
header          | Header text.
footer          | Footer text.
buttonText      | Text for the proceed button (Defaults to: Click Here or press the space button to Proceed).
buttonHide      | Do not display the button at all (use this as a final page or for messages that use only the `keys` advance method).
demo            | If piTemplate is set to 'debrief', this property set to `true` will activate the demo version of the debrief.
isTouch         | In the debriefing page, if demo is set to true, use the url for touch studies.
noDonate        | (true or false) Do not show the donate button.

The project implicit template supports a debrief template activated by setting `piTemplate` to 'debrief'. If it is activated, there are two additional functions exposed from within the template.
They can be used like so: `<%= showPanel('body','header','footer') %>` or `<%= showFeedback({wrap:false}) %>`.

#### showPanel(body, header, footer)
```
<%= showPanel('body','header','footer') %>
```

`showPanel` displays content within a stylized panel.

Argument        | Description
--------------- | ---------------------
body            | The main text of the panel
header          | The panel header (optional)
footer          | The panel footer (optional)

#### showFeedback(options)
```
<%= showFeedback({wrap:false}) %>
```

`showFeedback` automatically gathers feedback from the global object and displays it within your page. It takes an options object as its single argument. The feedback is gathered from the global object by going through each task object (current) and searching for the `feedback` property. It depends on the individual tasks respecting this convention.
You can fine tune the way feedback is collected and displayed using the following options:

Property        | Description
--------------- | ---------------------
pre             | A string to be injected before each feedback (default :'&lt;p&gt;').
post            | A string to be injected after each feedback (default :'&lt;/p&gt;').
wrap            | Whether to wrap the results in a panel (default: true).
header          | If wrapped within a panel, set the panel heading.
noFeedback      | The text to show if no feedback is found (default: '&lt;p&gt;No feedback was found&lt;/p&gt;').
property        | The default property in which to look for the feedback string (default: 'feedback').
exclude         | An array of task names to skip when gathering feedback.
