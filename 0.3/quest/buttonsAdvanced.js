define(['questAPI'], function(Quest){
	var API = new Quest();

	// ### Setup
	// Set the baseURL for use within images
	API.addCurrent({baseURL:'../../images/'});

	// ### Questions
	// Use variables from the data property to create the name and stem.
	// The idea is that this question will be inherited by many other questions.
	// Those questions will set the name and stem by setting variables into the data property (see example below).
	API.addQuestionsSet('basicSelect',
	{
		type: 'selectOne',
		autoSubmit:true,
		numericValues:true,
		required:true,
		style:'multiButtons',
		name:'<%=questionsData.trait%>.<%=questionsData.firstName%>.<%=questionsData.lastName%>',
		stem : 'How <%=questionsData.trait%> or <%=questionsData.untrait%> do you think that <%=questionsData.firstName%> <%=questionsData.lastName%> is?',
		errorMsg: {
			required: "Please select an answer, or click 'decline to answer'"
		},
		answers : [
			'1 - Extremely <%=questionsData.untrait%>',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9 - Extremely <%=questionsData.trait%>'
		],
		help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Selecting an answer once colors it blue.<br/>You can change your answer by selecting another option.<br/>To confirm, click the selected (blue) button a second time.'
	});

	// Create questions that inherit basicSelect and set the name of the target person.
	API.addQuestionsSet('people',
	[
		{
			inherit : 'basicSelect',
			data : {firstName : 'Barack', lastName : 'Obama'}
		},
		{
			inherit : 'basicSelect',
			data : {firstName : 'Beyonce', lastName : 'Knowles'}
		},
		{
			inherit : 'basicSelect',
			data : {firstName : 'Stephen', lastName : 'Colbert'}
		},
		{
			inherit : 'basicSelect',
			data : {firstName : 'David', lastName : 'Letterman'}
		}
	]);

	// Create questions that inherit one of the people questions, and set a specific trait.
	// Note that we use the seed property in order to inherit separately the people questions for each trait.
	// If we don't use seed, then the inheritance would be shared. Then, one trait might get the same target person.
	API.addQuestionsSet('traits',
	[
		{
			inherit : {set:'people', type:'exRandom', seed:'friendly'},
			data : {trait:'friendly', untrait:'unfriendly'}
		},
		{
			inherit : {set:'people', type:'exRandom', seed:'likeable'},
			data : {trait:'likeable', untrait:'unlikeable'}
		},
		{
			inherit : {set:'people', type:'exRandom', seed:'trustworthy'},
			data : {trait:'trustworthy', untrait:'untrustworthy'}
		},
		{
			inherit : {set:'people', type:'exRandom', seed:'honest'},
			data : {trait:'honest', untrait:'dishonest'}
		}
	]);

	// ### Pages
	// Each time that it is ineherited, basicPage uses one of the four trait questions. Each trait question uses one of the four people.
	API.addPagesSet('basicPage',
	{
		progressBar: '<%= pagesMeta.number %> out of 16',
		questions : {inherit:{set:'traits', type:'exRandom'}},
		v1style:2,
		decline:true,
		numbered: false
	});

	// ### Sequence
	//Inherit the page 16 times.
	//The question in the page will inherit each trait question four times,
	//and each trait question will inherit the people questions four time.
	//In that way, all four traits will appear with all four people, in random order.
	API.addSequence(
	[
		{
			mixer : 'repeat',
			times : 16,
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
