define(['questAPI'], function(Quest){
	var API = new Quest();


	// ### Questions

	// Create the generic question template:
	// * `autoSubmit`: submit when an answer is clicked twice.
	// * `answers`: the text for all answers (in our case only the questions change...)
	// * `help`: add help text (only for the first three questions presented).
	API.addQuestionsSet('basicSelect', {
		type: 'selectOne',
		autoSubmit:true,
		numericValues:true,
		answers: [
			"1- Not at all true about me",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7 - Very true about me"
		],
		help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Selecting an answer once colors it blue.<br/>' +
			'You can change your answer by selecting another option.<br/>' +
			'To confirm, click the selected (blue) button a second time.'
	});

	// Create a set with all the questions that we are going to use.
	// Each questions `inherit`s our *basicSelect*, sets a `name` and sets the questions text (`stem`).
	API.addQuestionsSet('baQuestions', [
		{
			inherit : 'basicSelect',
			name : 'ba1',
			stem : "I notice differences in the way my body reacts to various foods."
		},
		{
			inherit : 'basicSelect',
			name : 'ba2',
			stem : "I can always tell when I bump myself whether or not it will become a bruise."
		},
		{
			inherit : 'basicSelect',
			name : 'ba3',
			stem : "I always know when I've exerted myself to the point where I'll be sore the next day."
		},
		{
			inherit : 'basicSelect',
			name : 'ba4',
			stem : "I'm always aware of changes in my energy level when I eat certain foods."
		},
		{
			inherit : 'basicSelect',
			name : 'ba5',
			stem : "I know in advance when I'm getting the flu."
		},
		{
			inherit : 'basicSelect',
			name : 'ba6',
			stem : "I know I'm running a fever without taking my temperature."
		},
		{
			inherit : 'basicSelect',
			name : 'ba7',
			stem : "I can distinguish between tiredness because of hunger and tiredness because of lack of sleep."
		},
		{
			inherit : 'basicSelect',
			name : 'ba8',
			stem : "I can accurately predict what time of day lack of sleep will catch up with me."
		},
		{
			inherit : 'basicSelect',
			name : 'ba9',
			stem : "I am aware of a cycle in my activity level throughout the day."
		},
		{
			inherit : 'basicSelect',
			name : 'ba10',
			stem : "I <b>don't</b> notice seasonal rhythms and cycles in the way my body functions."
		},
		{
			inherit : 'basicSelect',
			name : 'ba11',
			stem : "As soon as I wake up in the morning I know how much energy I'll have during the day."
		},
		{
			inherit : 'basicSelect',
			name : 'ba12',
			stem : "I can tell when I go to bed how well I will sleep that night."
		},
		{
			inherit : 'basicSelect',
			name : 'ba13',
			stem : "I notice distinct body reactions when I am fatigued."
		},
		{
			inherit : 'basicSelect',
			name : 'ba14',
			stem : "I notice specific body responses to changes in the weather."
		},
		{
			inherit : 'basicSelect',
			name : 'ba15',
			stem : "I can predict how much sleep I will need at night in order to wake up refreshed."
		},
		{
			inherit : 'basicSelect',
			name : 'ba16',
			stem : "When my exercise habits change, I can predict very accurately how that will affect my energy level."
		},
		{
			inherit : 'basicSelect',
			name : 'ba17',
			stem : "There seems to be a best time for me to go to sleep at night."
		},
		{
			inherit : 'basicSelect',
			name : 'ba18',
			stem : "I notice specific bodily reactions to being overhungry."
		}
	]);


	// ### Pages
	// Create the generic pages template:
	// * `decline`: allow participants to decline answering
	// * `noSubmit`: do not display the submit button (we rely on `autoSubmit` for submitting)
	API.addPagesSet('basicPage', {
		progressBar: '<%= pagesMeta.number %> out of 18',
		header: 'Please rate your agreement with the following statement',
		headerStyle : {'font-size':'1em'},
		questions : {inherit:{set:'baQuestions', type:'exRandom'}},
		decline:true,
		noSubmit:true
	});



	// ### Sequence
	// We use a simple mixer here to repeat a simple page that inherits from the basicPage.
	// The basic page randomly inherits a question, therfore we get a different question for every page.
	// We use exRandom in the basicPage page so that questions don't randomly appear more than once.
	API.addSequence([
		{
			mixer : 'repeat',
			times : 18,
			data : [
				{inherit : 'basicPage'}
			]
		}
	]);


	// Return the script to piquest's god, or something of that sort.
	return API.script;
});