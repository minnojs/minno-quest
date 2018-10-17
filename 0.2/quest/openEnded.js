define(['questAPI'], function(Quest){
	var API = new Quest();

	// ### Questions
	API.addQuestionsSet(
	{
		email1 : [{
			type: 'text',
			name:'email1',
			stem: 'Please leave your email address',
			required: true,
			errorMsg: {
				required: "Are you sure you don't want to leave your email? Click Decline to Answer to skip without a response"
			}

		}],
		email2 : [{
			type: 'text',
			name:'email2',
			stem: 'Please confirm your email address',
			required: true,
			errorMsg: {
				required: "Are you sure you don't want to confirm your email address? Click Decline to Answer to skip without a response"
			}
		}]
	});


	// ### Pages
	API.addPagesSet('basicPage',
	{
		progressBar: '<%= pagesMeta.number %> out of 2',
		v1style:2,
		decline:true,
		numbered: false
	});

	// ### Sequence
	API.addSequence(
	[
		{
			inherit : 'basicPage',
			questions : [{inherit:'email1'}]
		},
		{
			inherit : 'basicPage',
			questions : [{inherit:'email2'}]
		}
	]);

	/**
	Return the script to piquest's god, or something of that sort.
	**/
	return API.script;
});
