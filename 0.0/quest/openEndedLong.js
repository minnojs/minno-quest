define(['questAPI'], function(Quest){
	var API = new Quest();

	// ### Questions
	API.addQuestionsSet(
	{
		vacation : [{
			type: 'textarea',
			name:'vacation',
			stem: 'Please briefly describe your dream vacation',
			rows:4,
			maxlength:350,
			maxlengthLimit:true,
			required: true,
			errorMsg: {
				required: "Are you sure you don't want to describe your dream vacation? Click Decline to Answer to skip without a response"
			}
		}],
		mondays : [{
			type: 'textarea',
			name:'mondays',
			stem: 'Please explain why you do not like Mondays',
			rows:4,
			maxlength:350,
			maxlengthLimit:true,
			required: true,
			errorMsg: {
				required: "Are you sure you don't want to tell us why you don't like Mondays? Click Decline to Answer to skip without a response"
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
			mixer:'random',
			data :
			[
				{
					inherit : 'basicPage',
					questions : [{inherit:'vacation'}]
				},
				{
					inherit : 'basicPage',
					questions : [{inherit:'mondays'}]
				}
			]
		}
	]);

	/**
	Return the script to piquest's god, or something of that sort.
	**/
	return API.script;
});
