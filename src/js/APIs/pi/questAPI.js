define(function(require){

    var Constructor = require('./questAPI');
    var decorator = require('./PIAPIdecorator');
    var _ = require('underscore');

    /**
	 * Constructor for PIPlayer script creator
	 * @return {Object}		Script creator
	 */
    function API(){
        Constructor.call(this);

        this.settings.logger = {
            url: '/implicit/PiQuest'
        };
    }

    // create API functions
    _.extend(API.prototype, Constructor.prototype);
    decorator(API);

    return API;
});
