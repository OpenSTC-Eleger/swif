/******************************************
* Officer Model
*/
app.Models.Officer = Backbone.RelationalModel.extend({
    
	model_name: "res.users",
	
	url: "/#officers/:id",
	urlRoot: "/api/open_object/users",

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
		{
			type: Backbone.HasMany,
			key: 'team_ids',
			relatedModel: 'app.Models.Team',
			collectionType: 'app.Collections.Teams',
			includeInJSON: ['id', 'name','manager_id','tasks'],	
		},
		{
            type: Backbone.HasMany,
            key: 'contact_id',
            relatedModel: 'app.Models.ClaimerContact',
            collectionType: 'app.Collections.ClaimersContacts',
            includeInJSON: ['id', 'name','partner_id','phone','email'],
        },
		{
			type: Backbone.HasMany,
			key: 'groups_id',
			relatedModel: 'app.Models.STCGroup',
			collectionType: 'app.Collections.STCGroups',
			includeInJSON: ['id', 'name','code'],	
		},
	],


	defaults:{
		id:0,
		firstname: null,
		name: null,
		login: null,
		password: null,
		groups_id: [],
		service_ids: [],
		
		isDST			: false,
		isManager		: false,
	},


	// Officer name //
	getName : function() {
		if(this.get('name') != false){
			return this.get('name').toUpperCase();
		}
		else{ return ''; }
	},
	setName : function(value) {
		if( value == 'undefined') return;
		this.set({ name : value });
	},
    
	// Officer firstname //
	getFirstname : function() {
		if(this.get('firstname') != false){
			return _.capitalize(this.get('firstname').toLowerCase());
		}
		else{ return ''; }
	},
	setFirstname : function(value) {
		if( value == 'undefined') return;
		this.set({ firstname : value });
	},

	// Officer Fullname //
	getFullname : function() {
        return this.getFirstname()+' '+this.getName();
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
	// Group IDs //
	getGroupsId: function() {
	    return this.get('groups_id');
	},
	setGroupsID : function(value) {
		if( value == 'undefined') return;
		this.set({ groups_id : value });
	},
	
	// Group Name //
	setGroupSTCName : function(value) {
		if( value == 'undefined') return;
		this.set({ groupSTCName : value });
	},
	getGroupSTCName: function() {
	    return this.get('groupSTCName');
	},

	// Team services ID //
	getServicesId: function() {
	    return this.get('service_ids');
	},
	setServicesID : function(value) {
		if( value == 'undefined') return;
		this.set({ service_ids : value });
	},

	// Teams ID// 
	getTeamsInArray: function(){
		jsonTeamId = this.get('team_ids');

		var officerTeams = [];
		_.each(jsonTeamId.models, function(item){
			officerTeams.push(item.id);
		})

		return officerTeams;
	},
	
	isDST: function(value) {
    	return this.get('isDST');
    },
    
    setDST: function(value) {
        this.set({ isDST : value });
    },



	/** Model Initialization
	*/
    initialize: function(){
        //console.log('Officer Model initialization');
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
		this.setGroupsID( params.groups_id );
		this.setServicesID( params.service_ids );
	},



	/** Save Officer
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