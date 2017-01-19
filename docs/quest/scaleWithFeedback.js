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
		answers : ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree'],
		help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Selecting an answer once colors it blue.<br/>You can change your answer by selecting another option.<br/>To confirm, click the selected (blue) button a second time.'
	});


	API.addQuestionsSet('rosenberg',
	[
		{
			inherit : 'basicSelect',
			name : 'ros1',
			stem : "On the whole, I am satisfied with myself."
		},
		{
			inherit : 'basicSelect',
			name : 'ros2',
			reverse:true,
			stem : "At times, I think I am no good at all."
		},
		{
			inherit : 'basicSelect',
			name : 'ros3',
			stem : "I feel that I have a number of good qualities."
		},
		{
			inherit : 'basicSelect',
			name : 'ros4',
			stem : "I am able to do things as well as most other people."
		},
		{
			inherit : 'basicSelect',
			name : 'ros5',
			reverse:true,
			stem : "I feel I do not have much to be proud of."
		},
		{
			inherit : 'basicSelect',
			name : 'ros6',
			reverse:true,
			stem : "I certainly feel useless at times."
		},
		{
			inherit : 'basicSelect',
			name : 'ros7',
			stem : "I feel that I'm a person of worth, at least on an equal plane with others."
		},
		{
			inherit : 'basicSelect',
			name : 'ros8',
			reverse:true,
			stem : "I wish I could have more respect for myself."
		},
		{
			inherit : 'basicSelect',
			name : 'ros9',
			reverse:true,
			stem : "All in all, I am inclined to feel that I am a failure."
		},
		{
			inherit : 'basicSelect',
			name : 'ros10',
			stem : "I take a positive attitude toward myself."
		}
	]);

	API.addQuestionsSet('showme', {
		type: 'selectOne',
		autoSubmit:true,
		stem:'Click next to see your self-esteem score',
		name:'next',
		answers : ['ok'],
		onSubmit : function(log, current){
			var sum=0, count=0, prop, response;

			// for each question (that has a response and begings with "ros") add to sum
			for (prop in current.questions){
				response = current.questions[prop].response;
				if (response && /^ros/.test(prop)) {
					sum += response;
					count+=1;
				}
			}

			if (count === 10){
				current.selfEsteemScore = sum/10;
			} else {
				current.selfEsteemScore = 'No score; You did not answer all the questions';
			}
		}
	});

	API.addQuestionsSet('score', {
		type: 'selectOne',
		autoSubmit:true,
		stem: "Your self-esteem score: <%=current.selfEsteemScore%>.<br/><br/>"+
		"A score above 5 means you're a douche; A score below 2 means you probably deserve more love than you give yourself.",
		name:'end'
	});


	// ### Pages
	API.addPagesSet('scalePage',
	{
		progressBar: '<%= pagesMeta.number %> out of 10',
		header: 'Please rate your agreement with the following statement',
		headerStyle : {'font-size':'1em'},
		questions : {inherit:{set:'rosenberg', type:'exRandom'}},
		v1style:2,
		decline:true,
		numbered: false
	});

	API.addPagesSet('endPage',
	{
		v1style:2,
		decline:false,
		numbered: false
	});


	// ### Sequence
	API.addSequence(
	[
		{
			mixer : 'repeat',
			times : 10,
			data :
			[
				{inherit : 'scalePage'}
			]
		},
		{
			inherit:'endPage',
			questions:[{inherit:'showme'}]
		},
		{
			inherit:'endPage',
			questions:[{inherit:'score'}]
		}
	]);

	/**
	Return the script to piquest's god, or something of that sort.
	**/
	return API.script;
});
