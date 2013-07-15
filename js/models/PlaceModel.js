/******************************************
* Place Model
*/
app.Models.Place = Backbone.RelationalModel.extend({
	
	model_name : 'openstc.site',
	
	url: "/#places/:id",
	
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
		id             : 0,
		name           : null,
		type           : 0,
		site_parent_id : 0,
		width          : 0,
		lenght         : 0,
		surface        : 0,
	},



	getId : function() {
		return this.get('id');
	},
	setId : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ id : value });
	},

	getName : function() {
		return _.titleize(this.get('name').toLowerCase());
	},
	setName : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ name : value });
	},

	getLenght : function() {
		return this.get('lenght');
	},
	setLenght : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ lenght : value });
	},  
	
	getWidth : function() {
		return this.get('width');
	},
	setWidth : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ width : value });
	},

	getSurface : function() {
		return this.get('surface');
	},
	setSurface : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ surface : value });
	},

	getParent : function() {
		return this.get('site_parent_id');
	},
	setParent : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ site_parent_id : value });
	},

	getType : function() {
		return this.get('type');
	},
	setType : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ type : value });
	},



	/** Model Initialization
	*/
	initialize: function(){

	},

	
	/** Model Parser 
	*/
	parse: function(response) {
		response.complete_name = _.titleize(response.complete_name.toLowerCase());

		return response;
	},
	


	update: function(params) {
		this.setName( params.name );
		this.setType( params.type );
		this.setService( params.service );
		this.setParent( params.site_parent_id );
		this.setWidth( params.width );
		this.setLenght( params.lenght );
		this.setSurface( params.surface );
	},
	

	/** Save Model
	*/
	save: function(data, id, options) { 
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(), options);
	},


	/** Create Model
	*/
	create: function(data, options) { 
		app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(), options);
	},


	
	/** Delete place
	*/
	delete: function (options) {	
		app.deleteOE( 
			[[this.get('id')]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	}


});