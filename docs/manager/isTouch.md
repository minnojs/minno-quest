# Is Touch

Detecting when users are using a touch interface on the way is notoriously difficult.
It is reasonably easy to detect touch features (such as the existance of a touch screen),
but many devices allow the use of both a touch screen and a keyboard and the player can 
not know which of these the user *prefers* to use.

`isTouch` is a task that allows you to identify users that are using touch interfaces.
It detects whether the user device has a device capable of touch interactions and if so
explicitly asks if they whish to use these capabilities.

The interface for this task is similar to the interface of the `yesNo` [task](./yesno.md).
With the following differences; first, `propertyName` has a default value of `$isTouch`, and second the default values for the texts are differnt.

A typical `isTouch` task may simply look like the following.
It would set the response to the question into `global.$isTouch`.

```javascript
{ type:'isTouch' }
```

If you want to get more fancy you can customize it:

```javascript
{ 
    type:'isTouch',
    text: 'Would you like to use the touch interface?',
    yesText: 'Yes! Touch is my thing!',
    noText: 'Nah, I\'ll go with the keyboard.'
}
```
