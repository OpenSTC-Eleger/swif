/******************************************
* Category Intervention  Model - Intervention classification for budget
*/
app.Models.CategoryRequest = Backbone.RelationalModel.extend({
	

	fields       : ['id', 'name', 'code'],
	
	urlRoot    : '/api/openstc/intervention_categories',


	defaults:{
		id : null,
	},
	  

	searchable_fields: [
		{
			key  : 'id',
			type : 'numeric'
		},
		{
			key  : 'name', 
			type : 'text'
		},
		{
			key  : 'code', 
			type : 'text'
		}
	],



	getName : function() {
		return this.get('name');
	},
	setName : function(value) {
		this.set({ name : value });
	},

	getCode : function() {
		return this.get('code');
	},
	setCode : function(value) {
		if( value == 'undefined') return;
		this.set({ code : value });
	}, 



	/** Model Initialization
	*/
	initialize: function(){
		//console.log('Category Intervention Model initialization');
	},
	


	update: function(params) {
		this.setName(params.name);
		this.setCode(params.code);
	},
	

	
	/** Save Model
	*/
	save: function(data, id, options) { 
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(), options);
	},



	/** Delete category
	*/
	delete: function (options) {
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	}

});
