
## piMessage

An extremely simple directive that allows presenting plain html within piManager. It takes a simple script function as follows:

```js
var task = {
    name: 'instr1',
    template: '<div>My html</div>',
    templateUrl: 'my/url',
    keys: ' '
}
```

The message tasks are extremely simple, all they do is present simple html templates. In order to load a template simply set it into the `template` property as a string, or set the appropriate URL into `templateUrl`. Thats it. 
(This is most likely not relevant to you, but the templates are rendered using angularjs $compile and therefore all the relevant services are available).

The context for the element has the following variables available: {global, current, task}.

You can use any element in your template as a proceed button, all you have to do is add the `pi-message-done` attribute to the appropriate element.

```
<button pi-message-done type="button" class="btn btn-primary">My next text...</button>
```

Alternatively you may use the `keys` property in order to set a key (or keys) that proceed. The keys property takes either a key (i.e. `'a'`) a keyCode (i.e. `65`) or an array of such (i.e. `['a','b']`).

This table shows several useful keyCodes for your convinience (there are more [here](http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)):

Code    | Function
------- | -----------
13      | Enter
27      | Escape
32      | Space
37      | Left arrow
38      | Up arrow
39      | Right arrow
40      | Down arrow

### Project Implicit build

The project implicit build has an optional "meta template" that you may use by setting the `piTemplate` property to true. When using it, you have several additional options.

property        | description
--------------- | ---------------------
piTemplate      | (true, false or 'debrief') Activates the PI template. If set to 'debrief' activates the debrief template, and makes the debrief functions available.
header          | Header text.
footer          | Footer text.
buttonText      | Text for the proceed button (Defaults to: Click Here or press the space button to Proceed).
buttonHide      | Do not display the button at all (use this as a final page or for messages that use only the `keys` advance method).
demo            | If piTemplate is set to 'debrief', this property set to `true` will activate the demo version of the debrief.
noDonate        | (true or false) Do not show the donate button.

The project implicit template supports a debrief template activated by setting `piTemplate` to 'debrief'. If it is activated, there are two additional functions exposed from within the template.
They can be used like so: `<%= showPanel('body','header','footer') %>`

##### showPanel(body, header, footer)
`showPanel` displays content within a stylized panel.

argument        | description
--------------- | ---------------------
body            | The main text of the panel
header          | The panel header (optional)
footer          | The panel footer (optional)

##### showFeedback(options)
`showFeedback` automatically gathers feedback from the global object and displays it within your page. It takes an options object as its single argument.

property        | description
--------------- | ---------------------
pre             | A string to be injected before each feedback (default :'<p>').
post            | A string to be injected after each feedback (default :'</p>').
wrap            | Whether to wrap the results in a panel (default: true).
header          | If wrapped within a panel, set the panel heading.
noFeedback      | The text to show if no feedback is found (default: '<p>No feedback was found</p>').
property        | The default property in which to look for the feedback string (default: 'feedback').
exclude         | An array of task names to skip when gathering feedback.

The feedback is gathered from the global object by going through each tasks object and searching for the feedback property. It depends on the individual tasks respecting this convention.
