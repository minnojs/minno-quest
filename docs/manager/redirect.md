# Redirect

The post task is responsible for redirecting users to an external url. It is 

A typical redirect task looks like this:

```javascript
{
    type:'redirect',
    url: 'my/redirect/url'    
}
```

The API is as follows:

property        | description
--------------- | ---------------------
url             | The url we intend to redirect to.
condition       | The redirect will occur if condition is not defined or evaluates to true. If condition is a function it will be invoked and its result will be used instead.

The condition option is a bit advanced so here is an example of using it. The following code will only redirect if `piGlobal.shouldRedirect` is true.

```javascript
{
    type:'redirect',
    url: 'my/redirect/url',
    condition: function(){
        return piGlobal.shouldRedirect;
    }
}
```
