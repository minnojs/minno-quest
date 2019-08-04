
import _ from 'lodash';

sequenceProvider.$inject = ['Database','$rootScope','mixerDefaultContext','templateDefaultContext'];
function sequenceProvider(Database, $rootScope, mixerDefaultContext, templateDefaultContext){

    /**
		 * The sequence for the manager (essentialy the model).
		 * @param  {Object} script A manager script.
		 * @return {Object}
		 */
    function sequence(script){
        var db, context;
        // make sure this works without a new statement
        if (!(this instanceof sequence)){
            // jshint newcap:false
            return new sequence(script);
            // jshint newcap:true
        }

        // setup database
        db = this.db = new Database();
        db.createColl('tasks');
        db.add('tasks', script.tasksSets || []);

        // setup default contexts
        context = {global: $rootScope.global};
        _.extend(mixerDefaultContext, context);
        _.extend(templateDefaultContext, context);

        // setup sequence
        this.sequence = db.sequence('tasks', script.sequence);
    }

    _.extend(sequence.prototype, {
        next: function(){
            this.sequence.next();
            return this;
        },

        prev: function(){
            this.sequence.prev();
            return this;
        },

        current: function(){
            var ctx = {};
            var options = {skip: ['script']}; // do not template whole scripts
            return this.sequence.current(ctx, options);
        }
    });

    return sequence;
}

export default sequenceProvider;
