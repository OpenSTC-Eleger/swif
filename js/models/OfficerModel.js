/******************************************
* Officer Model
*/
app.Models.Officer = Backbone.Model.extend({

	urlRoot: "/api/open_object/users",

	defaults:{
		//id:0,
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


});