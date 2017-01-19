define(['questAPI'], function(Quest){
	var API = new Quest();

	// ### Setup
	// Set the baseURL for use within images
	API.addCurrent({baseURL:'../../images/'});

	// ### Questions
	API.addQuestionsSet('basicSelect',
	{
		type: 'selectOne',
		autoSubmit:true,
		numericValues:true,
		required:true,
		name: '<%=questionsData.imageName%>',
		//Set the height of the image with the height property of the <image> HTML element.
		stem: '<image height="50px" src="<%=current.baseURL%><%=questionsData.imageName%>.jpg"></image>',
		answers : ['Extremely negative', 'Moderately negative', 'Slightly negative', 'Neutral', 'Slightly positive', 'Moderately positive', 'Extremely positive'],
		help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Selecting an answer once colors it blue.<br/>You can change your answer by selecting another option.<br/>To confirm, click the selected (blue) button a second time.'
	});


	API.addQuestionsSet('animals',
	[
		{
			inherit : 'basicSelect',
			data : {imageName : 'bunny'}
		},
		{
			inherit : 'basicSelect',
			data : {imageName : 'seal'}
		},
		{
			inherit : 'basicSelect',
			data : {imageName : 'shark'}
		},
		{
			inherit : 'basicSelect',
			data : {imageName : 'snake'}
		}
	]);

	// ### Pages
	API.addPagesSet('basicPage',
	{
		progressBar: '<%= pagesMeta.number %> out of 4',
		header: 'How positive or negative are your feelings toward the animal presented below?',
		headerStyle : {'font-size':'1em'},
		questions : {inherit:{set:'animals', type:'exRandom'}},
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
