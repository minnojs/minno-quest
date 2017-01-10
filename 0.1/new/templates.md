# Templates

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Syntax](#syntax)
- [Real time (reRender)](#real-time-rerender)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

One of the ways to create dynamic questionnaires is using templates.
Templates are a format that allows you to dynamically generate properties for your elements using the [environmental variables](./variables.html). 

### Syntax
A template is formed as a string that has a section of the form `<%= %>` in it.
Within these brackets you can inject any [environmental variables](./variables.html) that you like.
Environmental variables hold information that you set in advance or derive from the current or previous tasks, you should really [read about them](./variables.html) before you advance any further.
For example: the following message task will print out "*Hi Andy, this is an example for the use of templates*".

```javascript
API.addGlobal({
    userName: 'Andy'
});

var task = {
    type: 'message',
    template: 'Hi <%= global.userName %>, this is an example for the use of templates',
    keys: ' '
}
```

This example was an extremely simple use case.
Templates actually allow you to run any Javascript that you like, so they allow to do some really complex things.
We'll give just one example of how you can make a simple condition within a template using a [conditional operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).
The player uses [lodash templates](http://lodash.com/docs#template) internally, you should look them up to see some of the more advanced uses.
The following message will read "*Your name is Andy*" if userName actually equals Andy, and "*Your name is not Andy*" otherwise.

```javascript
var task = {
    type: 'message',
    template: 'Your name is <%= global.userName === 'Andy' ? '' : 'not' %> Andy',
    keys: ' '
}
```

You can replace any string setting in your elements with a template, and it will be rendered according to the [environmental variables](./variables.html).
The exception to this rule are the `inherit` and `mixer` properties that cannot use templates.
The reason for this is the sequencers order of execution.
It first mixes, then inherits and only finally parses templates - so that the templating effect is not activated in time to be used for mixing or inheritance.

### Real time (reRender)
Normaly each template gets rendered only once, when it is first encountered. 
Sometimes you may want it to update in response to various realtime changes. 
In order to for the templates to re-render each time you should set the `reRender` property to be true.
