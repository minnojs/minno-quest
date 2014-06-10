define(function(require){
	var _ = require('underscore');

	function dfltQuestLogger(log, pageData, global){
		global;
		return _.extend({
			global: 'globalData place holder'
		},pageData,log);
	}

	return dfltQuestLogger;

});