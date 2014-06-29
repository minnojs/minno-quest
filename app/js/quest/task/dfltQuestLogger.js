define(function(require){
	var _ = require('underscore');

	function dfltQuestLogger(log, pageData, global){
		global;
		return _.extend({},pageData,log);
	}

	return dfltQuestLogger;

});