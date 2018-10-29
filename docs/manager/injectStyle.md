# Inject Style

The `injectStyle` task allows you to change the style of Minno throught a study.
The style of web pages is determined by their [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS).
`injectStyle` allows you to add any CSS that you like into your study.

```javascript
{
    type:'injectStyle',
    css: '[piq-page] .page-buttons .page-submit {background-color:#d9534f; border:#d43f3a}'
}
```

If you have a lot of CSS that you want to add, it makes sense to break the string down as follows:

```javascript
{
    type:'injectStyle',
    css: [
        '[piq-page] .page-buttons .page-submit {background-color:#d9534f; border:#d43f3a}',
        '[piq-page] .page-buttons .page-decline {background-color:#5cb85c; border:#4cae4c}'
    ].join('\n')
}
```

property        | description
--------------- | ---------------------
css             | A string of css to add to the page.
