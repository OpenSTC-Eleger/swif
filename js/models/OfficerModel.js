define([
	'app',

	'genericModel',

], function(app, GenericModel){

	'user strict';


	/******************************************
	* Officer Model
	*/
	var OfficerModel = GenericModel.extend({

		urlRoot : "/api/open_object/users",

		fields: ["complete_name", "contact_id", "context_lang", "context_tz", "date", "firstname", "groups_id", "current_group", "openresa_group", "id", "isDST", "isManager", "isResaManager", "lastname", "login", "name", "phone", "service_id", "service_names", "tasks", "team_ids", "user_email", "actions"],


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

		getCompleteName : function() {
			return _.titleize(this.get('complete_name').toLowerCase());
		},

	    // Officer email //
	    getEmail : function() {
	        if(this.get('user_email')){
	        	return this.get('user_email');
	        }
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
		getGroups: function() {
		    return this.get('groups_id');
		},
		setGroups : function(value) {
			this.set({ groups_id : value });
		},


		// Group IDs //
		getLastConnection: function() {
		    return this.get('date');
		},
		
		// Group Name //
		setGroupSTC : function(value) {
			this.set({ current_group : value });
		},
		getGroupSTC : function(type) {
			switch (type){ 
				case 'id': 
					return this.get('current_group')[0];
				break;
				case 'json':
					return {id: this.get('current_group')[0], name: this.get('current_group')[1]};
				break;
				default:
					return this.get('current_group')[1];
			}
		},
		
		getGroupResa : function(type) {
			switch (type){ 
				case 'id': 
					return this.get('openresa_group')[0];
				break;
				case 'json':
					return {id: this.get('openresa_group')[0], name: this.get('openresa_group')[1]};
				break;
				default:
					return this.get('openresa_group')[1];
			}
		},

		getServices : function(type){

			var placeServices = [];

			_.each(this.get('service_names'), function(s){
				switch (type){
					case 'id': 
						placeServices.push(s[0]);
					break;
					case 'json': 
						placeServices.push({id: s[0], name: s[1]});
					break;
					default:
						placeServices.push(s[1]);
				}
			});

			if(type == 'string'){
				return _.toSentence(placeServices, ', ', ' '+app.lang.and+' ')
			}
			else{
				return placeServices;
			}
		},
		setServicesID : function(value) {
			this.set({ service_ids : value });
		},

		getService : function(type) {
			switch (type){ 
				case 'id': 
					return this.get('service_id')[0];
				break;
				case 'json':
					return {id: this.get('service_id')[0], name: this.get('service_id')[1]};
				break;
				default:
					return this.get('service_id')[1];
			}
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

		/** Get Informations of the model
		*/
		getInformations : function(){
			var informations = {};

			informations.name = this.getCompleteName();

			if(!_.isEmpty(this.getService())){
				informations.infos = {};
				informations.infos.key = _.capitalize(app.lang.service);
				informations.infos.value = this.getService();
			}

			return informations;
		},



		getActions: function(){
			return this.get('actions');
		}

	});

return OfficerModel;

});