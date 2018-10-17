define(['questAPI'], function(Quest){
	var API = new Quest();

	// ### Questions
	API.addQuestionsSet('basicSlider',
	{
		type: 'slider',
		steps:201, min: -100, max:100,
		hidePips:true,
		//showTicks:true,
		highlight:true,
		required:true,
		maxWidth:'800px',
		errorMsg: {
			required: "Please select an answer, or click 'decline to answer'"
		},
		leftLabelCss : {color:'#8b2500','font-size':'1.5em'},
		rightLabelCss: {color:'#8b2500','font-size':'1.5em'},
		help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Click on the gray line to indicate your judgment. After clicking the line, you can slide the circle to choose the exact judgment.',
		labels : ['Extremely negative', 'Neutral', 'Extreme positive']
	});

	API.addQuestionsSet('people',
	[
		{
			inherit : 'basicSlider',
			name : 'Obama',
			stem : 'How positive or negative are your feelings toward Barack Obama?'
		},
		{
			inherit : 'basicSlider',
			name : 'Beyonce',
			stem : 'How positive or negative are your feelings toward Beyonce Knowles?'
		},
		{
			inherit : 'basicSlider',
			name : 'Colbert',
			stem : 'How positive or negative are your feelings toward Stephen Colbert?'
		},
		{
			inherit : 'basicSlider',
			name : 'Letterman',
			stem : 'How positive or negative are your feelings toward David Letterman?'
		}
	]);

	// ### Pages
	API.addPagesSet('basicPage',
	{
		progressBar: '<%= pagesMeta.number %> out of 4',
		header: 'How positive or negative are your feelings toward the animal presented below?',
		headerStyle : {'font-size':'1em'},
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
