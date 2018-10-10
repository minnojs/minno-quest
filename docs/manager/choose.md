# Choose

Choose is a task that allows you to ask your users simple yes/no questions without resorting to a full fledged questionnaire.

A typical choose task may look like this:

```javascript
{
    type:'choose',
    heading: 'Task length',
    text: 'Would you like to participate in the long task (15min), or in the short one (5min)',
    yesText: 'The long one',
    noText: 'The short one',
    propertyName: 'longOrShort'
}
```

After completing the task, the global property `longOrShort` will be set with `true` or `false` according to the response of the user.
This value can be used later within the player in order to branch or within templates.

Note that the value recorded is **not** posted to the server.
(If you are interested in posting it to the server, you may want to look into the [post](./post.html) task).

The API is as follows:

property        | description
--------------- | ---------------------
heading         | A bold heading for the questions (String)
text            | The actual text of the question (String)
yesText         | The text for the *true* value button (String)
noText          | The text for the *false* value button (String)
propertyName    | The property name within `global` to which to save the data. Values with dots (i.e. '$meta.isTouch') will be logged to the propery they are pointing to via [lodash set](https://lodash.com/docs/3.10.1#set)
