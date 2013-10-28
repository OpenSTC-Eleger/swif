define([
	'jquery',
	'underscore',
	'backbone',
	'global'
  
], function($, _, Backbone, global){


	/******************************************
	* User Model
	*/
	var UserModel = Backbone.Model.extend({

		urlA             : '/api/open_object/users',
		urlAuthentication: '/sessions',

		defaults: {
			uid             : null,
			authToken       : null,
			isDST			: false,
			isManager		: false,
		},

		initialize: function(){
			//console.log('User initialize: ' + this.getLogin());
		},


		getUID : function() {
			return this.get('uid');
		},
		setUID : function(value) {
			this.set({ uid : value });
		},
		
		getGroups : function() {
			return this.get('groupsID');
		},
		setGroups : function(value) {
			this.set({ groupsID : value });
		},

		getLogin : function() {
			return this.get('login');
		},
		setLogin : function(value) {
			this.set({ login : value });
		},

		getFirstname : function() {
			return this.get('firstname');
		},
		setFirstname : function(value) {
			this.set({ firstname : value });
		},

		getLastname : function() {
			return this.get('lastname');
		},
		setLastname : function(value) {
			this.set({ lastname : value.toUpperCase() });
		},

		getFullname : function() {
			return this.get('firstname')+' '+this.get('lastname');
		},

		getLastConnection : function() {
			return this.get('lastConnection');
		},
		setLastConnection : function(value) {
			this.set({ lastConnection : value });
		},

		destroySessionID: function(){
			this.setSessionID('');
		},

		hasAuthToken: function () {
			if(!_.isNull(this.get('authToken'))) {
				return true;
			}
			else {
				return false;
			}
		},
		getAuthToken : function() {
			return this.get('authToken');
		},
		setAuthToken : function(value) {
			this.set({ authToken : value });
		},
		
		getService : function() {
			return this.get('service_id');
		},
		setService : function(value) {
			this.set({ service_id : value });
		},
		
		getOfficers: function() {
			return this.get('officers');
		},

		setOfficers : function(value) {
			this.set({ officers : value });
		},	
		
		getTeams: function() {
			return this.get('teams');

		},
		setTeams : function(value) {
			this.set({ teams : value });
		},

		getContact : function() {
			return this.get('contact_id');
		},
		setContact : function(value) {
			this.set({ contact_id : value });
		},

		getServices : function() {
			return this.get('service_ids');
		},
		setServices : function(value) {
			this.set({ service_ids : value });
		},
		
		getContext : function() {
			return this.get('context');
		},
		setContext : function(value) {
			this.set({ context : value });
		},
		
		isManager: function(value) {
			return this.get('isManager');
		},
		
		setManager: function(value) {
			this.set({ isManager : value });
		},
		
		isDST: function(value) {
			return this.get('isDST');
		},
		
		setDST: function(value) {
			this.set({ isDST : value });
		},
		
		/** Get Officer By Id
		*/
		getOfficerById: function(id){
			return _.find(this.getOfficers(), function(officer){
				return officer.id == id
			});
		},

		setMenu: function (menu) {
			this.set({menu: menu});
		},
		
		/** Get officer's teams list selected in planning
		*/
		getOfficerIdsByTeamId: function(id) {
			var self = this;
			var officers = []
			               
			var team = _.find(this.getTeams(), function(team){
				return team.id == id
			});
			if(_.isUndefined(team)) return officers;
			
			_.each(team.members, function(member){			
				officers.push(member.id);
			});
			return officers;	
		},
		
		/** Get Officer By Id
		*/
		getTeamById: function(id){
			return _.find(this.getTeams(), function(team){
				return team.id == id
			});
		},

		/** Get team's officers list selected in planning
		*/
		getTeamIdsByOfficerId: function(id) {
			var self = this;
			var teams = []

			var officer = _.find(this.getOfficers(), function(officer){
				return officer.id == id
			});
			if(_.isUndefined(officer)) return teams;

			_.each(officer.teams, function(team){
				teams.push(team);
			});
			return teams;
		},


		getMenus: function () {
			return this.get('menu')
		},


		/** Retrieve teams than current user can manage and stores them in user's data
		*/
		queryManagableTeams: function () {
			var user = this;
			return $.when($.ajax({
				async: true,
				url: this.urlA + '/' + this.get("uid") + '/manageable_teams',
				headers: {Authorization: 'Token token=' + this.get('authToken')},
				success: function (data) {
					user.setTeams(data);
				}
			}));

		},


		/** Retrieve officers than current user can manage and stores them in user's data
		*/
		queryManagableOfficers: function() {
			var user = this;
			return $.when($.ajax({
				async: true,
				url: this.urlA + '/' + this.get("uid") + '/manageable_officers',
				headers: {Authorization: 'Token token=' + this.get('authToken')},
				success: function (data) {
					user.setOfficers(data);
				}
			}));

		},


		/** Set all attributes to the user after login
		*/
		setUserData: function(data){

			this.setLogin(data.user.login);
			this.setUID(data.user.id)
			this.setAuthToken(data.token);
			this.setMenu(data.menu);
			this.setLastConnection(moment());
			this.setContext({tz: data.user.context_tz, lang: data.user.context_lang});
			this.setFirstname(data.user.firstname);
			this.setLastname(data.user.name);
			this.setGroups(data.user.groups_id);
			this.setServices(data.user.service_ids);
			this.setService(data.user.service_id);
			this.setContact(data.user.contact_id);
			this.setManager(data.user.isManager);
			this.setDST(data.user.isDST);

			//this.queryManagableTeams();
			//this.queryManagableOfficers();
		},



		/** Login function
		*/
		login: function (loginUser, passUser) {

			var self = this;

			var login_data = {
				'dbname'  : global.config.openerp.database,
				'login'   : loginUser,
				'password': passUser,
			};

			return $.ajax({
				url        :  self.urlAuthentication,
				type       : 'POST',
				dataType   : 'json',
				data       :  JSON.stringify(login_data)
			})
		},



		/** Logout fonction
		*/
		logout: function(options){
			var self = this;

			$.ajax({
				url    : self.urlAuthentication +'/'+ self.getAuthToken(),
				method : 'DELETE',
			})
			.always(function () {
				// Delete the Auth token of the user //
				self.setAuthToken(null);
				self.save();

				//app.setAjaxSetup();

				// Refresh the header //
				global.views.headerView.render();

				// Navigate to the login Page //
				Backbone.history.navigate(app.routes.login.url, {trigger: true, replace: true});
			});

		}

	});


	return UserModel
});