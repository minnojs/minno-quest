define(['questAPI'], function(Quest){
	var API = new Quest();

	// ### Questions
	API.addQuestionsSet('basicSelect',
	{
		type: 'selectMulti',
		autoSubmit:true,
		numericValues:true,
		required:true,
		errorMsg: {
			required: "Please select an answer, or click 'decline to answer'"
		}
	});

	API.addQuestionsSet({
		multi: [{
			inherit: 'basicSelect',
			name:'multi',
			stem:'Please select',
			answers : ['Men', 'Women', 'Other']
		}],
		open: [{
			type: 'text',
			name:'other',
			stem:'How do you mean other?'
		}]
	});

	// ### Pages
	API.addPagesSet('basicPage',
	{
		progressBar: '<%= pagesMeta.number %> out of 3',
		headerStyle : {'font-size':'1em'},
		v1style:2,
		decline:true,
		numbered: false
	});

	// ### Sequence
	API.addSequence(
	[
		{
			inherit :'basicPage',
			questions:[
				// always show this question
				{inherit:'multi'},
				// this question should be shown only if "other was selected"
				{
					remix: true, // remix:true is neccessary so that the mixer is re-evaluated each time that the responses change
					mixer:'branch',
		            conditions: [
						{compare: 3, operator:'in', to: 'current.questions.multi.response'}
					],
					data: [
						{inherit:'open'}
					]
				}
			]}
	]);

	/**
	Return the script to piquest's god, or something of that sort.
	**/
	return API.script;
});