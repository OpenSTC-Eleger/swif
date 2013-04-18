/******************************************
* Team Model
*/
app.Models.Team = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'openstc.team',	
	
	url: "/#teams/:id",	
	
	relations: [{
			type: Backbone.HasMany,
			key: 'tasks',
			relatedModel: 'app.Models.Task',
			collectionType: 'app.Collections.Tasks',
			includeInJSON: 'id',
			reverseRelation: {
				type: Backbone.HasOne,
				key: 'teamWorkingOn',
				includeInJSON: ['id','manager_id'],
			}
		},
		{
			type: Backbone.HasMany,
			key: 'user_ids',
			relatedModel: 'app.Models.Officer',
			collectionType: 'app.Collections.Officers',
			includeInJSON: ['id', 'firstname', 'name'],
			reverseRelation: {
				type: Backbone.HasOne,
				key: 'belongsToTeam',
				includeInJSON: ['id','manager_id','tasks'],
			}
		},
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
		manager_id: null,
		user_ids: [],
		service_ids: []
	},


	// Team Name //
	getName : function() {
		return this.get('name');
	},
	setName : function(value) {
		if( value == 'undefined') return;
		this.set({ name : value });
	},
    
	// Team service ID //
	getServiceId : function() {
		return this.get('service_ids');
	},
	setServiceID : function(value) {
		if( value == 'undefined') return;
		this.set({ service_ids : value });
	},

    // Team manager ID //
    getManagerId : function() {
        return this.get('manager_id');
    },
    setManagerID : function(value) {
		if( value == 'undefined') return;
		this.set({ manager_id : value });
	},

    // Team services ID //
    getServicesId: function() {
        return this.get('service_ids');
    },
    setServicesID : function(value) {
		if( value == 'undefined') return;
		this.set({ service_ids : value });
	},

	// Team members ID //
    getMembersId: function() {
        return this.get('user_ids');
    },
    setMembersID : function(value) {
		if( value == 'undefined') return;
		this.set({ user_ids : value });
	},


	/** Model Initialization
	*/
	initialize: function (model) {
		console.log("Request task Initialization");
	},


	/** Model Parser
	*/
	parse: function(response) {
		return response;
	},



	/** Update each attributes to the model
	*/
	update: function(params) {
		this.setName( params.name );
		this.setManagerID( params.manager_id );
		this.setServicesID( params.service_ids );
		this.setMembersID( params.user_ids );
	},



	/** Save Team
	*/
	save: function(data, id, options) { 
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(),options);
	},



	/** Delete Team
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