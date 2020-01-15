define(['questAPI'], function(Quest){
	var API = new Quest();

	// ### Questions
	API.addQuestionsSet('basicSelect',{
		type: 'selectOne',
		autoSubmit:true,
		numericValues:true,
		required:true,
		style:'multiButtons',
		errorMsg: {
			required: "Please select an answer, or click 'decline to answer'"
		},
		answers : [
			'1 - Extremely negative',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9 - Extremely positive'
		],
		help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Selecting an answer once colors it blue.<br/>You can change your answer by selecting another option.<br/>To confirm, click the selected (blue) button a second time.'
	});

	API.addQuestionsSet('people',[
		{
			inherit : 'basicSelect',
			name : 'Obama',
			stem : 'What are your feelings toward Barack Obama?'
		},
		{
			inherit : 'basicSelect',
			name : 'Beyonce',
			stem : 'What are your feelings toward Beyonce Knowles?'
		},
		{
			inherit : 'basicSelect',
			name : 'Colbert',
			stem : 'What are your feelings toward Stephen Colbert?'
		},
		{
			inherit : 'basicSelect',
			name : 'Letterman',
			stem : 'What are your feelings toward David Letterman?'
		}
	]);

	// ### Pages
	API.addPagesSet('basicPage',
	{
		progressBar: '<%= pagesMeta.number %> out of 4',
		questions : {inherit:{set:'people', type:'exRandom'}}, //One question in the page, selected randomly (exhaustive)
		v1style:2,
		decline:true,
		numbered: false
	});

	// ### Sequence
	API.addSequence(
	[
		{
			mixer : 'repeat',
			times : 4,
			data :
			[
				{inherit : 'basicPage'}
			]
		}
	]);

	/**
	Return the script to piquest's god, or something of that sort.
	**/
	return API.script;
});
