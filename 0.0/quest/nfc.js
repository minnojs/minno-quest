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
		answers : ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neutral', 'Slightly agree', 'Moderately agree', 'Strongly agree'],
		help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Selecting an answer once colors it blue.<br/>You can change your answer by selecting another option.<br/>To confirm, click the selected (blue) button a second time.'
	});

	//Define the question texts.
	API.addQuestionsSet('nfc',
	[
		{
			inherit : 'basicSelect',
			name : 'nfc_c1',
			stem : "I do not usually consult many different opinions before forming my own view."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_c2',
			stem : "I feel irritated when one person disagrees with what everyone else in a group believes."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_d1',
			stem : "When I have made a decision, I feel relieved."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_a1',
			stem : "I feel uncomfortable when I don’t understand the reason why an event occurred in my life."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_d2',
			stem : "When I am confronted with a problem, I’m dying to reach a solution very quickly."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_d3',
			stem : "I would quickly become impatient and irritated if I would not find a solution to a problem immediately."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_c3',
			stem : "I dislike questions which could be answered in many different ways."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_a2',
			stem : "I dislike it when a person’s statement could mean many different things."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_p1',
			stem : "I don’t like to be with people who are capable of unexpected actions."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_a3',
			stem : "I don’t like situations that are uncertain."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_o1',
			stem : "I find that establishing a consistent routine enables me to enjoy life more."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_o2',
			stem : "I find that a well ordered life with regular hours suits my temperament."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_p2',
			stem : "I don’t like to go into a situation without knowing what I can expect from it."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_p3',
			stem : "I dislike unpredictable situations."
		},
		{
			inherit : 'basicSelect',
			name : 'nfc_o3',
			stem : "I enjoy having a clear and structured mode of life."
		}
	]);

	// ### Pages
	API.addPagesSet('basicPage',
	{
		progressBar: '<%= pagesMeta.number %> out of 16',
		header: 'Please rate your agreement with the following statement',
		headerStyle : {'font-size':'1em'},
		questions : {inherit:{set:'nfc', type:'exRandom'}}, //One question in the page, selected randomly (exhaustive)
		v1style:2,
		decline:true,
		numbered: false
	});

	// ### Sequence
	API.addSequence(
	[
		//Inherit the page 16 times. The page will inherit the nfc questions 16 times, thus presenting all 16 statements in random order.
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
