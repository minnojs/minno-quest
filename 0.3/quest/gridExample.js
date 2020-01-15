define(['questAPI'], function(Quest){
	var API = new Quest();

	// ### Questions
	// Create the template
	API.addQuestionsSet('basicGrid',
	{
		type: 'grid',
		cellLabels:true,
		rowStemHide: true,
		checkboxType : 'colorMark',
		required : true,
		errorMsg: {
			required: "Please select an answer."
		},
		columnStemHide: true,
		maxWidth:420,
		name : '<%=questionsData.name%>',
		columns: [
			{type:'text', textProperty:'left', css : {width:'13.5%'}},
			{stem:'1', css : {width:'7%'}},
			{stem:'2', css : {width:'7%'}},
			{stem:'3', css : {width:'7%'}},
			{stem:'4', css : {width:'7%'}},
			{stem:'5', css : {width:'7%'}},
			{stem:'6', css : {width:'7%'}},
			{stem:'7', css : {width:'7%'}},
			{stem:'8', css : {width:'7%'}},
			{stem:'9', css : {width:'7%'}},
			{type:'text', textProperty:'right', css : {width:'13.5%'}}
		],
		rows: [
			{left:'Unlikeable', right:'Likeable', name:'<%=questionsData.name%>.likeable'},
			{left:'Untrustworthy', right:'Trustworthy', name:'<%=questionsData.name%>.trustworthy'},
			{left:'Unfriendly', right:'Friendly', name:'<%=questionsData.name%>.friendly'}
		]
	});

	// create the specific question instances instances
	API.addQuestionsSet('gridQuestions',
	[
		{
			inherit : 'basicGrid',
			data : {name : 'Barack'},
			stem: '<br/>Please rate Barack Obama on the following traits<br/><br/>'
		},
		{
			inherit : 'basicGrid',
			data : {name : 'Beyonce'},
			stem: '<br/><br/>Please rate Beyonce Knowles on the following traits<br/>'
		}
	]);

	// ### Pages
	API.addPagesSet('basicPage',
	{
		progressBar: 'Page <%= pagesMeta.number %> out of 2',
		questions : {inherit:{set:'gridQuestions', type:'exRandom'}},
		v1style:2,
		decline:true,
		numbered: false
	});

	// ### Sequence
	API.addSequence(
	[
		{
			mixer : 'repeat',
			times : 2,
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
