define(function(require){
	var _ = require('underscore');

	function dfltQuestLogger(log, pageData, global){
		global;
		return _.extend({
			pageData: 'pageData place holder',
			global: 'globalData place holder'
		},log);
	}

	return dfltQuestLogger;

});