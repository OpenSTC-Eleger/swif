/******************************************
* Category Task Model
*/
app.Models.CategoryTask = Backbone.RelationalModel.extend({
	
	fields  : ['id', 'name', 'code', 'complete_name', 'parent_id', 'service_ids'],
	
	urlRoot : '/api/openstc/task_categories',


	defaults:{
		id : null,
	},



	getId : function() {
		return this.get('id');
	},
	setId : function(value, silent) {
		this.set({ id : value }, {silent: silent});
	},

	getName : function() {
		return this.get('name');
	},
	setName : function(value) {
		if( value == 'undefined') return;
		this.set({ name : value });
	},  

	getCode : function() {
		return this.get('code');
	},
	setCode : function(value) {
		if( value == 'undefined') return;
		this.set({ code : value });
	}, 

	getUnit : function() {
		return this.get('unit');
	},
	setUnit : function(value) {
		if( value == 'undefined') return;
		this.set({ unit : value });
	}, 

	getParent : function() {
		return this.get('parent_id');
	},
	setParent : function(value) {
		if( value == 'undefined') return;
		this.set({ parent_id : value });
	}, 	
	// Team services ID //
	getServicesId: function() {
		return this.get('service_ids');
	},
	setServicesID : function(value) {
		if( value == 'undefined') return;
		this.set({ service_ids : value });
	},



	/** Model Initialization
	*/
	initialize: function(){
		//console.log('Category Request Model initialization');
	},

	
	update: function(params) {
		this.setName( params.name );
		this.setCode( params.code );
		this.setUnit( params.unit );
		this.setParent( params.parent_id );
		this.setServicesID( params.service_ids );
	},
	


	/** Save Model
	*/
	save: function(data, id, options) {
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(),options);
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