/******************************************
* Place Model
*/
app.Models.Officer = Backbone.RelationalModel.extend({
    
	model_name: "res.users",
	
	url: "/#officers/:id",
	
	relations: [{
			type: Backbone.HasMany,
			key: 'tasks',
			relatedModel: 'app.Models.Task',
			collectionType: 'app.Collections.Tasks',
			includeInJSON: true,
		},
		{
			type: Backbone.HasMany,
			key: 'service_ids',
			relatedModel: 'app.Models.ClaimerService',
			collectionType: 'app.Collections.ClaimersServices',
			includeInJSON: ['id', 'name'],	
		},
//		{
//			type: Backbone.HasMany,
//			key: 'team_ids',
//			relatedModel: 'app.Models.Team',
//			collectionType: 'app.Collections.Teams',
//			includeInJSON: 'id',	
//		},
//		{
//			type: Backbone.HasMany,
//			key: 'works',
//			relatedModel: 'app.Models.Work',
//			reverseRelation: {
//				key: 'officer',
//			}
//		},
		

	],


	defaults:{
		id:0,
		firstname: null,
		name: null,
		login: null,
		password: null
	},


	// Officer name //
	getName : function() {
		return this.get('name');
	},
	setName : function(value) {
		if( value == 'undefined') return;
		this.set({ name : value });
	},
    
	// Officer firstname //
	getFirstname : function() {
		return this.get('firstname');
	},
	setFirstname : function(value) {
		if( value == 'undefined') return;
		this.set({ firstname : value });
	},

    // Officer email //
    getEmail : function() {
        return this.get('user_email');
    },
    setEmail : function(value) {
		if( value == 'undefined') return;
		this.set({ user_email : value });
	},

    // Officer login //
    getLogin : function() {
        return this.get('login');
    },
    setLogin : function(value) {
		if( value == 'undefined') return;
		this.set({ login : value });
	},

	// Officer password //
    setPassword : function(value) {
		if( value == 'undefined') return;
		this.set({ new_password : value });
	},



	/** Model Initialization
	*/
    initialize: function(){
        console.log('Officer Model initialization');
        this.fetchRelated('tasks');
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
		this.setFirstname( params.firstname );
		this.setEmail( params.user_email );
		this.setLogin( params.login );
		this.setPassword( params.new_password );

		/*this.setManagerID( params.manager_id );
		this.setServicesID( params.service_ids );
		this.setMembersID( params.user_ids );*/
	},



	/** Save Team
	*/
	save: function(data, id, options) { 
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(),options);
	},



	/** Delete Officer
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