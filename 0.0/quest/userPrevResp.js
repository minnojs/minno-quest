define(['questAPI'], function(Quest){
	var API = new Quest();

	/**
	 * Questions
	 **/
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

	//Set the value of each response, to use it in the next question.
	API.addQuestionsSet('selectGroup', [{
		inherit: 'basicSelect',
		name:'selectGroup',
		stem:'Please choose, who would you prefer to rate now?',
		answers : [
			{text:'Black people', value:'Black people'},
			{text:'White people', value:'White people'}
		]
	}]);

	//The name of the group in this question is the response from the previous question.
	API.addQuestionsSet('groupLike', [{
		inherit: 'basicSelect',
		name:'groupLike',
		stem:'How much do you like <%=current.questions.selectGroup.response%>?',
		answers : ['Extremely dislike', 'Moderately dislike', 'Slightly disklike', 'Slightly like', 'Moderaltey like', 'Extremely like']
	}]);


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
		{inherit :'basicPage', questions:{inherit:'selectGroup'}},
		{inherit :'basicPage', questions:{inherit:'groupLike'}}
	]);

	/**
	Return the script to piquest's god, or something of that sort.
	**/
	return API.script;
});
