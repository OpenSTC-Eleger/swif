/******************************************
* Category Task Model - Task category
*/
app.Models.CategoryTask = Backbone.RelationalModel.extend({
	
	model_name : 'openstc.task.category',	
	
	url: "/#category/:id",

	relations: [
		{
			type: Backbone.HasMany,
			key: 'service_ids',
			relatedModel: 'app.Models.ClaimerService',
			collectionType: 'app.Collections.ClaimersServices',
			includeInJSON: ['id', 'name'],
		},
	  ],

	defaults:{
		id:0,
		name: null,
		code: null,
		unit: null,
		parent_id: null,
		service_ids: [],
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



	/** Model Parser
	*/
	parse: function(response) {    	
		return response;
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
