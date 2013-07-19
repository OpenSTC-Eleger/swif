/******************************************
* User Model
*/
app.Models.User = Backbone.Model.extend({

	// Model name in the database //
	model_name : 'res.users',
	
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

	hasSessionID: function(){
		if(this.getSessionID() != ''){
			return true;
		}
		else{
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
		

	/** get, by calling server, officers and teams to filter on it in tasks/planning screens
	*/
	getTeamsAndOfficers: function() {
		var self = this
		app.callObjectMethodOE([[this.get("uid")],null], this.model_name, "getTeamsAndOfficers", self.getSessionID(), {
			success: function(data){
				self.setOfficers( data.result.officers )
				self.setTeams( data.result.teams )
				self.save();
			}
		});
	},


	/** Login function
	*/
	login: function(loginUser, passUser){

		"use strict";
		var self = this;

		console.log('Login User: ' + loginUser + ' - ' + passUser);

		var deferred = $.Deferred();

		app.json(app.config.openerp.url+app.urlOE_authentication, {
			'base_location': app.config.openerp.url,
			'db': app.config.openerp.database,
			'login': loginUser,
			'password': passUser,
			'session_id': ''
		})
		.fail(function (error){
			console.error(error);
			app.notify('large', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.serverUnreachable);
		})
		.done(function (data) {


			if(data.uid == false){
				app.loader('hide');
				app.notify('large', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.loginIncorrect);
			}
			else{

				// Set the user Informations //
				self.setUID(data.uid)
				self.setSessionID(data.session_id);
				self.setLogin(loginUser);
				self.setUID(data.uid);
				self.setLastConnection(moment().format("LLL"));
				self.setContext(data.context);

				// Add the user to the collection and save it to the localStorage //
				app.collections.users.add(self);

				// Get the users informations //
				self.getUserInformations();
				self.getTeamsAndOfficers();

			}
			
			deferred.resolve();
		})

	   return deferred;
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



	/** Get the menu of the user
	*/
	getMenus: function(options){
		"use strict";
		var self = this;

		return app.json(app.config.openerp.url+app.urlOE_menuUser, {
			'session_id': self.getSessionID()
		}, options)
	},



	/** Get the informations of the user
	*/
	getUserInformations: function(options){
		"use strict";
		var self = this;


		var fields = ['firstname', 'name', 'groups', 'contact_id', 'service_id', 'service_ids', 'isDST', 'isManager'];

		return  app.getOE(this.model_name, fields, [self.getUID()], self.getSessionID(),
			({
				success: function(data){

					// Retrieve the firstname and the lastname of the user //
					self.setFirstname(data.result[0].firstname);
					self.setLastname(data.result[0].name);
					self.setGroups(data.result[0].groups_id);
					self.setServices(data.result[0].service_ids);
					self.setService(data.result[0].service_id);
					self.setContact(data.result[0].contact_id);
					self.setManager(data.result[0].isManager);
					self.setDST(data.result[0].isDST);
					self.save();

					// Refresh the header //
					app.views.headerView.render(app.router.mainMenus.manageInterventions);

					// Navigate to the Home page //
					Backbone.history.navigate(app.routes.home.url, {trigger: true, replace: true});

				},
				error: function(error){
					console.error(error);
					app.notify('', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.serverUnreachable);       
				}
			})
		);
	},


});