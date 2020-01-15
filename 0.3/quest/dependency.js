define(['questAPI'], function(Quest){
	var API = new Quest();

	// ### Questions
	API.addQuestionsSet('basicSelect',
	{
		type: 'selectOne',
		autoSubmit:true,
		numericValues:true,
		required:true,
		errorMsg: {
			required: "Please select an answer, or click 'decline to answer'"
		},
		help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Selecting an answer once colors it blue.<br/>You can change your answer by selecting another option.<br/>To confirm, click the selected (blue) button a second time.'
	});

	API.addQuestionsSet({
		funnyChoice: [{
			inherit: 'basicSelect',
			name:'moreFunny',
			stem:'On avarage, who do you think are funnier, women or men?',
			answers : ['Men', 'Women']
		}],
		funnyMen: [{
			inherit: 'basicSelect',
			name:'menMore',
			stem:'How much funnier do you think that men are in comparison to women?',
			answers : ['Extremely funneir', 'Moderately funnier', 'Slightly funnier']
		}],
		funnyWomen: [{
			inherit: 'basicSelect',
			name:'womenMore',
			stem:'How much funnier do you think that women are in comparison to men?',
			answers : ['Extremely funneir', 'Moderately funnier', 'Slightly funnier']
		}]
	});

	// ### Pages
	API.addPagesSet('basicPage',
	{
		progressBar: '<%= pagesMeta.number %> out of 2',
		headerStyle : {'font-size':'1em'},
		v1style:2,
		decline:true,
		numbered: false
	});

	// ### Sequence
	API.addSequence(
	[
		//Present the first question
		{inherit :'basicPage', questions:{inherit:'funnyChoice'}},

		//Select one of the two possible questions, based on the response to the previous question.
		{
			mixer : 'multiBranch',
			branches: [
				{
					conditions: [
						{compare: 'current.questions.moreFunny.response', to: 1}
					],
					data: [
						{inherit :'basicPage', questions:{inherit:'funnyMen'}}
					]
				},
				{
					conditions: [
						{compare: 'current.questions.moreFunny.response', to: 2}
					],
					data: [
						{inherit :'basicPage', questions:{inherit:'funnyWomen'}}
					]
				}
			]
		}
	]);

	/**
	Return the script to piquest's god, or something of that sort.
	**/
	return API.script;
});
