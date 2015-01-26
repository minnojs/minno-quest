define(['questAPI', function(Quest){

	// create new quest API
	var API = new Quest();

    // create questionnaire sequence
    API.addSequence([

    ]);

    // return questionnaire script to the player gods ...
    return API.script;
}]);