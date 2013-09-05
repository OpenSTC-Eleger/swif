/******************************************
* User Model
*/
app.Models.User = Backbone.Model.extend({

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
		$.ajax({
			async: false,
			url: app.config.barakafrites.url + this.urlA + '/' + this.get("uid") + '/manageable_teams',
			headers: {Authorization: 'Token token=' + this.get('authToken')},
			success: function (data) {
				user.setTeams(data);
			}
		});

	},


	/** Retrieve officers than current user can manage and stores them in user's data
	*/
	queryManagableOfficers: function() {
		var user = this;
		$.ajax({
			async: false,
			url: app.config.barakafrites.url + this.urlA + '/' + this.get("uid") + '/manageable_officers',
			headers: {Authorization: 'Token token=' + this.get('authToken')},
			success: function (data) {
				user.setOfficers(data);
			}
		});

	},



	/** Login function
	*/
	login: function (loginUser, passUser) {

		var self = this;

		console.log('Login User: ' + loginUser + ' - ' + passUser);

		var login_data = {
			'dbname'  : app.config.openerp.database,
			'login'   : loginUser,
			'password': passUser,
		};

		$.ajax({
			url        :  self.urlAuthentication,
			type       : 'POST',
			dataType   : 'json',
			data       :  JSON.stringify(login_data),
			beforeSend : function(){
				app.loader('display');
			},
			success    : function (data) {

				// Set all attributes to the user //
				self.setAuthToken(data.token);
				self.setMenu(data.menu);
				self.setUID(data.user.id)
				self.setLogin(loginUser);
				self.setLastConnection(moment());
				self.setContext({tz: data.user.context_tz, lang: data.user.context_lang});
				self.setFirstname(data.user.firstname);
				self.setLastname(data.user.name);
				self.setGroups(data.user.groups_id);
				self.setServices(data.user.service_ids);
				self.setService(data.user.service_id);
				self.setContact(data.user.contact_id);
				self.setManager(data.user.isManager);
				self.setDST(data.user.isDST);
				self.queryManagableTeams();
				self.queryManagableOfficers();

				// Add the user to the collection and save it to the localStorage //
				self.save();

				app.setAjaxSetup();

				app.views.headerView.render(app.router.mainMenus.manageInterventions);
				Backbone.history.navigate(app.routes.home.url, {trigger: true, replace: true});
			},
			statusCode : {
				401: function () {
					app.notify('large', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.loginIncorrect);
					app.loader('hide');
				}
			}
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
		.done(function (data) {

			if(data){
				app.notify('large', 'info', app.lang.infoMessages.information, app.lang.infoMessages.successLogout);
			}
			else{
				app.notify('', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.serverUnreachable);
			}

		}).always(function () {
			// Delete the Auth token of the user //
			self.setAuthToken(null);
			self.save();

			app.setAjaxSetup();

			// Refresh the header //
			app.views.headerView.render();

			// Navigate to the login Page //
			Backbone.history.navigate(app.routes.login.url, {trigger: true, replace: true});
		});

	}

});