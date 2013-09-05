/******************************************
* Officer Model
*/
app.Models.Officer = app.Models.GenericModel.extend({

	urlRoot : "/api/open_object/users",

	defaults:{
		id       :null,
		isDST    : false,
		isManager: false,
	},


   
	// Officer firstname //
	getFirstname : function() {
		if(this.get('firstname') != false){
			return _.capitalize(this.get('firstname').toLowerCase());
		}
		else{ return ''; }
	},
	setFirstname : function(value) {
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
		this.set({ new_password : value });
	},
	// Group IDs //
	getGroupsId: function() {
	    return this.get('groups_id');
	},
	setGroupsID : function(value) {
		this.set({ groups_id : value });
	},
	
	// Group Name //
	setGroupSTCName : function(value) {
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