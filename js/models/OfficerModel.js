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
		password: null,
		groups_id: [],
		service_ids: [],
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
		this.setGroupsID( params.groups_id );
		this.setServicesID( params.service_ids );
		/*this.setManagerID( params.manager_id );
		this.setServicesID( params.service_ids );
		this.setMembersID( params.user_ids );*/
	},



	/** Save Team
	*/
	save: function(data, id, options) { 
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(),options);
	},



	/** Check if the user is DST
    */
    isDST: function(){
        if($.inArray(18, this.getGroupsId()) != -1){
            return true;
        }
        else{
            return false;    
        }
    },



    /** Check if the user is Manager
    */
    isManager: function(){
        if($.inArray(19, this.getGroupsId()) != -1){
            return true;
        }
        else{
            return false;    
        };
    },



    /** Check if the user is Agent
    */
    isAgent: function(){
        if($.inArray(17, this.getGroupsId()) != -1){
            return true;
        }
        else{
            return false;    
        }
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