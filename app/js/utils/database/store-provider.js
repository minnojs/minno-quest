define(['underscore'],function(_){

	storeProvider.$inject = ['database.query'];
	function storeProvider(query){

		function Store(){
			this.store = {};
		}

		_.extend(Store.prototype, {
			create: function create(nameSpace){
				if (this.store[nameSpace]){
					throw new Error('The name space ' + nameSpace + ' already exists');
				}
				this.store[nameSpace] = [];
			},

			read: function read(nameSpace){
				if (!this.store[nameSpace]){
					throw new Error('The name space ' + nameSpace + ' does not exist');
				}
				return this.store[nameSpace];
			},

			update: function update(nameSpace, data){
				var coll = this.read(nameSpace);
				if (_.isArray(data)){
					_.forEach(data, function(value){
						coll.push(value);
					});
				} else {
					coll.push(data);
				}
			},

			del: function del(nameSpace){
				this.store[nameSpace] = undefined;
			},

			query: function (nameSpace, queryObj){
				return query(nameSpace, queryObj);
			}
		});

		return Store;
	}

	return storeProvider;
});