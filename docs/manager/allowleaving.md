# AllowLeaving

By default, each time users attempt to leave the page, minno-manager inquires whether they actually mean it.
The `allowLeave` task cancels this inquiry, and allows easily leaving the player..
It is usefull if you want to allow users to browse away from a page, for example toward the end of a task in a debriefing page.
It makes debugging a bit easier as well.

The API is as follows:

property        | description
--------------- | ---------------------
preventLeaving  | Whether to prevent users from leaving the page (default is false).

The following task will allow users to leave the page:

```javascript
{ type:'allowLeaving' }
```

The following study shows how to use `allowLeaving` in order to allow users to browse away within an informed consent message.

```javascript
API.addSequence([
    { type: 'allowLeaving' },
    { type: 'message', templateUrl: 'consent.jst' },
    { type: 'allowLeaving' , preventLeaving: true},
    { type: 'quest', scriptUrl: 'quest.js' }
]);
```

