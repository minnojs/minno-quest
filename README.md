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