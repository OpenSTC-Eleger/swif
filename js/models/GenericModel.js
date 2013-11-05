define([
	'backbone',

], function(Backbone){


	/******************************************
	* Generic Model
	*/
	var GenericModel = Backbone.Model.extend({


		defaults:{
			id : null,
		},


		searchable_fields: [
			{
				key  : 'name', 
				type : 'text'
			}
		],


		getId : function() {
			return this.get('id');
		},
		setId : function(value, silent) {
			this.set({ id : value }, {silent: silent});
		},

		getName : function() {
			return _.titleize(this.get('name').toLowerCase());
		},
		setName : function(value, silent) {
			this.set({ name : value }, {silent: silent});
		},

		getActions : function(){
			return this.get('actions');
		}

	});

return GenericModel;

});