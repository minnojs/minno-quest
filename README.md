# PIquest
A framework for administering on-line questionnaires.

This repository is nowhere near ready for use - keep in touch, things are moving fast around here!

##quest.wrapper
Any quest object can take the following properties:
{
	stem: "My question stem"
}

## quest.text
```js
{
	dflt: "default value",
	minlength: 11,
	maxlength: 11,
	required: true,
	pattern: "/^\\d\\d\\d-\\d\\d-\\d\\d\\d\\d$/",
	errorMsg: {
		minlength: "too short",
		maxlength: "too long",
		required: "required",
		pattern: "Should have the form 000-00-0000"
	}
}
```

## quest.number
```js
{
	dflt: 42,
	min: 3,
	max: 54,
	required: true,
	errorMsg: {
		min: "too small",
		max: "too large",
		required: "required",
		number: "has to be a number"
	}
}
```

## piQuest (page)
```js
{
	header: 'My header',
	questions: [
		{type:'text'},
		{type:'textNumber'},
		{type:'multi'}
	]
}
```