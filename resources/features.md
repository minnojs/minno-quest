RT recording  -- supported
Capability to turn off RT, TRT recording

**randomization**
Present items in fixed or random order -- supported
Present set of items in fixed or random order -- supported
Present subset of items (e.g. choose 5 of 10 questionnaire items to present) - use mixer!!!


**branching**
Branching: specific response leads to skipping questionnaire in total
Branching: specific response leads to extra item(s)
Branching: specific response leads to different set of questions than another specific response (e.g. all women get one set of items, all men get a different set). Ideally, the branching set-up makes it easy for an item with 10 different response options to lead to 10 different sets of items -- like the nested quality of the occupation item in our demographics XML)
Branching: needs to work with multi-mark items, too.


**Header**: Present customized instruction (or no instruction) before item (e.g. "Please rate your agreement with the following statement")
Present images in item text


Semantic error feedback to developers -- supported

**q types**
Multiple choice/response
Multi-mark option ("select all that apply")
Open text validation (e.g. numbers between 0-10, only positive numbers, valid email, Character minimum and maximum lengths for text responses)
	Numeric value recording
	String value recording
Columns for items with lots of response options (e.g. countries) - how about multiple choice dropdown?

**Responses**
Default response option coding would have the first listed response option to be coded as a 1, the second as a 2, and so forth.
Additional response option possibility: reverse coding (last option is a 1)
Additional response option possibility: novel coding (user defines coding for each response option)
Present response options in fixed order
Present response options in random order

Decline to answer button || required

Optional header to provide info on % complete, questionnaire name, etc. - Needs to be static...

Customization of fonts, colors, sizes of elements (this should probably be an option but used very rarely -- we want a standard questionnaire format) - Can we leave this to css?


for each question log
	id, response, RT,
	Record order of items (when randomized) -- using TRT or other mechanism

## Tech
Templates for question types.
Maybe add a micro markdown option? Or even a full one? Hardly any cost, and can make creating instructions loads easier (bar colors...).

```js
// question
{
	prefix: "Markdown **enabled**/n get it?",
	suffix: "Select one of the previous",
	input: "text" || "textarea" || "Multiple choice" ||
	reverse:false, // flip the default values
	responses: [
		{text: "option 1", value:"2"},
		{text: "option 2", value:"4", correct:true},
		{text: "option 3", value:"6"}
	],
	default: 'value', // what to compute in case of  a declined question.
	validation: ['correct','email', 'numeric','length:30'],
	force:true, // continue vs decline to answer?

}
```