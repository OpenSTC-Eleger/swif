/******************************************
* User Model
*/
app.Models.User = Backbone.Model.extend({

	url: '/api/open_object/users',

	relations: [
		{
			type: Backbone.HasMany,
			key: 'service_ids',
			relatedModel: 'app.Models.ClaimerService',
			reverseRelation: {
				type: Backbone.HasMany,
				key: 'users',
				includeInJSON: ['id','name'],
			}
		},
		{
			type: Backbone.HasMany,
			key: 'officers',
			relatedModel: 'app.Models.Officer',
			includeInJSON: ['id', 'firstname', 'name'],
		},

	],

	defaults: {
		uid             : '',
		login           : '',
		sessionID       : '',
		lastConnection  : '',
		firstname       : '',
		lastname        : '',
		service_ids		: [],
		context			: {},
		officers        : [],
		teams			: [],
		isDST			: false,
		isManager		: false
	},

	initialize: function(){
		console.log('User initialize: ' + this.getLogin());
	},
	
	/** Model Parser */
	parse: function(response) {    	
		return response;
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
		this.set({ firstname : _.capitalize(value) });
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

	getSessionID : function() {
		return this.get('sessionID');
	},
	setSessionID : function(value) {
		this.set({ sessionID : value });
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
		if (this.get('authToken') != '') {
			return true;
		}
		else {
			return false;
		}
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
	
	/**
	 * Get Officer By Id
	 */
	getOfficerById: function(id){
		return _.find(this.getOfficers(), function(officer){
			return officer.id == id
		});
	},

	setMenu: function (menu) {
		this.set({menu: menu});
	},
	/**
	 * Get officer's teams list selected in planning
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
	
	/**
	 * Get Officer By Id
	 */
	getTeamById: function(id){
		return _.find(this.getTeams(), function(team){
			return team.id == id
		});
	},

	/**
	 * Get team's officers list selected in planning
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


	/**
	 * Retrieve teams than current user can manage and stores them in user's data
	 */
	queryManagableTeams: function () {
		var user = this;
		$.ajax({
			url: app.config.barakafrites.url + this.url + '/' + this.get("uid") + '/manageable_teams',
			headers: {Authorization: 'Token token=' + this.get('authToken')},
			success: function (data) {
				user.setTeams(data);
			}
		});

	},

	/**
	 * Retrieve officers than current user can manage and stores them in user's data
	 */
	queryManagableOfficers: function() {
		var user = this;
		$.ajax({
			url: app.config.barakafrites.url + this.url + '/' + this.get("uid") + '/manageable_officers',
			headers: {Authorization: 'Token token=' + this.get('authToken')},
			success: function (data) {
				user.setOfficers(data);
			}
		});

	},

	/** Login function
	*/
	login: function (loginUser, passUser) {

		"use strict";
		var self = this;

		console.log('Login User: ' + loginUser + ' - ' + passUser);

		var login_data = {
			'dbname'  : app.config.openerp.database,
			'login'   : loginUser,
			'password': passUser,
		};

		$.ajax(
			{
				url        : app.config.barakafrites.url + '/sessions',
				type       : "POST",
				contentType: 'application/json',
				data       : JSON.stringify(login_data),
				error      : function (error) {
					console.error(error);
					app.loader('hide');
					app.notify('large', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.serverUnreachable);
				},
				success    : function (data) {

					if (data.token == false) {
						app.loader('hide');
						app.notify('large', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.loginIncorrect);
					}
					else {
						self.populateUserData(self,data);
						app.views.headerView.render(app.router.mainMenus.manageInterventions);
						Backbone.history.navigate(app.routes.home.url, {trigger: true, replace: true});

					}
				}

			}
		)
	},

	populateUserData: function (user,data) {
		localStorage.setItem('currentUserAuthToken', data.token)
		user.set({authToken: data.token});
		user.setMenu(data.menu);
		user.setUID(data.user.id)
		user.setLogin(loginUser);
		user.setLastConnection(moment().format("LLL"));
		user.setContext({tz: data.user.context_tz, lang: data.user.context_lang});
		user.setFirstname(data.user.firstname);
		user.setLastname(data.user.name);
		user.setGroups(data.user.groups_id);
		user.setServices(data.user.service_ids);
		user.setService(data.user.service_id);
		user.setContact(data.user.contact_id);
		user.setManager(data.user.isManager);
		user.setDST(data.user.isDST);
		user.queryManagableTeams();
		user.queryManagableOfficers();

		app.collections.users.add(user);
		user.save()
	},

	/** Logout fonction
	*/
	logout: function(options){
		"use strict";
		var self = this;

		var deferred = $.Deferred();

		app.json(app.config.openerp.url+app.urlOE_sessionDestroy, {
			'session_id': self.getSessionID()
		})
		.fail(function (){
			app.notify('', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.serverUnreachable);
		})
		.done(function (data) {
			// On détruit la session dans le localStorage //
			self.destroySessionID();
			self.save();
			// Reset des filtres initialisées dans les listes //
			sessionStorage.clear();
			
			app.notify('large', 'info', app.lang.infoMessages.information, app.lang.infoMessages.successLogout);

			// Refresh the header //
			app.views.headerView.render();

			// Navigate to the login Page //
			Backbone.history.navigate(app.routes.login.url, {trigger: true, replace: true});
			deferred.resolve();
		});

	   return deferred;
	},

	/** Get the informations of the user
	*/
	getUserInformations: function(options){
		"use strict";
		var self = this;

		var fields = ['firstname', 'name', 'groups', 'contact_id', 'service_id', 'service_ids', 'isDST', 'isManager'];

		return $.ajax({
				url: app.config.barakafrites.url + '/api/open_object/users/' + self.getUID(),
				data: fields,
				headers: {Authorization: 'Token token=' + self.get('authToken')},
				success: function (data) {

					self.setFirstname(data.user.firstname);
					self.setLastname(data.user.name);
					self.setGroups(data.user.groups_id);
					self.setServices(data.user.service_ids);
					self.setService(data.user.service_id);
					self.setContact(data.user.contact_id);
					self.setManager(data.user.isManager);
					self.setDST(data.user.isDST);

					// Refresh the header //
					app.views.headerView.render(app.router.mainMenus.manageInterventions);

					// Navigate to the Home page //
					Backbone.history.navigate(app.routes.home.url, {trigger: true, replace: true});

				},
				error: function (error) {
					console.error(error);
					app.notify('', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.serverUnreachable);
				}
			})

		}

});