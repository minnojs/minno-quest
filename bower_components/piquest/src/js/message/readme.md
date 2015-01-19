
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