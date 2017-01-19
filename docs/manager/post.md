# Post

The post task is responsible for posting plain data to the server. You can either send data directly from the global object or create it yourself. This is a good way to keep track of complex conditions within your tasks or of manual manipulation of all sorts.

A typical post task may look like this:

```javascript
{
    type:'post',
    url: 'my/post/url',
    data: {something:'I',want:'to save.'}
}
```

The API is as follows:

property        | description
--------------- | ---------------------
url             | The url we intend to post to.
path            | A path within the global to the object that you want to send. For example: `"iat.feedback"` will post the object `feedback` from `global.iat`.
data            | A raw object to be posted to the server. You may use templates in order to construct it.
