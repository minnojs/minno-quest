define(['questAPI'], function(Quest){
	var API = new Quest();

	// This is just a trick you can use in order to simplify the use of images;
	// set the baseUrl into your current object, and use templates in order to inject them into your questions.
	API.addCurrent({
		baseURL: '../../images/'
	});

	// ### Questions
	// Create the general structure of our questions
	API.addQuestionsSet('basicSelect', {
		type: 'selectOne',
		autoSubmit:true,
		numericValues:true,
		help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Selecting an answer once colors it blue.<br/>' +
			'You can change your answer by selecting another option.<br/>' +
			'To confirm, click the selected (blue) button a second time.'
	});

	// ### Pages
	// Create the generic pages template:
	// * `decline`: allow participants to decline answering
	// * `noSubmit`: do not display the submit button (we rely on `autoSubmit` for submitting)
	API.addPagesSet('basicPage', {
		progressBar: '<%= pagesMeta.number %> out of 3',
		headerStyle : {'font-size':'1.2em'},
		decline:true,
		noSubmit:true
	});

	// ### Sequence
	// We put the questions together within the sequence here.
	// The stem here includes an image. It uses plain html, but this is a template you can definitely use yourself.
	// Note that we use a template to set the baseUrl for the images, this is useful so that you can easily change the location of you images.
	API.addSequence(
	[
		{
			mixer : 'random',
			data :[
				{
					inherit: 'basicPage',
					header: 'How much do you like this man?',
					questions: {
						inherit: 'basicSelect',
						name: 'like',
						stem :  '<h4>Chris</h4><img class="img-responsive" src="<%=current.baseURL%>face1.jpg">',
						answers: ["Dislike extremely", "Dislike moderately", "Dislike slightly","Neither like or dislike", "Like slightly", "Like moderately", "Like extremely"]
					}
				},
				{
					inherit: 'basicPage',
					header: 'How friendly do you think that this man is?',
					questions: {
						inherit: 'basicSelect',
						name: 'friendly',
						stem :  '<h4>Chris</h4><img class="img-responsive" src="<%=current.baseURL%>face1.jpg">',
						answers: ["Extremely unfriendly", "Moderately unfriendly", "Slightly unfriendly","Neither friendly nor unfriendly", "Slightly friendly", "Moderately friendly", "Extremely friendly"]
					}
				},
				{
					inherit: 'basicPage',
					header: 'How trustworthy do you think that this man is?',
					questions: {
						inherit: 'basicSelect',
						name: 'trustworthy',
						stem :  '<h4>Chris</h4><img class="img-responsive" src="<%=current.baseURL%>face1.jpg">',
						answers: ["Extremely untrustworthy", "Moderately untrustworthy", "Slightly untrustworthy","Neither trustworthy nor untrustworthy", "Slightly trustworthy", "Moderately trustworthy", "Extremely trustworthy"]
					}
				}
			]
		}
	]);

	// Return the script to piquest's god, or something of that sort.
	return API.script;
});