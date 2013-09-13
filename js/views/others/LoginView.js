/******************************************
* Login View
*/
app.Views.LoginView = Backbone.View.extend({


	el           : '#rowContainer',

	templateHTML : 'login',

	
	// The DOM events //
	events: {
		'submit #formConnection'          : 'login',
		'change #loginUser'               : 'hideLastConnection',

		'mousedown #toggelDisplayPassword': 'displayPassword',
		'mouseup #toggelDisplayPassword'  : 'hidePassword'
	},



	/** View Initialization
	*/
	initialize: function(user) {
		//console.log('Login view Initialize');
	},



	/** Display the view
	*/
	render: function() {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.applicationName +' '+ app.lang.viewsTitles.login);

		// Retrieve the Login template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang: app.lang, 
				user: self.model
			});

			$(self.el).html(template);

			// Set the Tooltip //
			$('*[data-toggle="tooltip"]').tooltip();


			// Set the focus to the login or password input //
			if(!_.isNull(self.model.getUID())){
				$('#passUser').focus();
			}
			else{
				$('#loginUser').focus();
			}

		});


		$(this.el).hide().fadeIn();
		return this;
	},



	/** Login Function
	*/
	login: function(e){
		e.preventDefault();
		var self = this;


		// Set the button in loading State //
		$('#formConnection').find('fieldset').prop('disabled', true);
		$(this.el).find("button[type=submit]").button('loading');

		// Execution user login function //
		var checkLogin = this.model.login($('#loginUser').val(), $('#passUser').val());

		
		checkLogin.done(function(data){
			// Set user data and Save it //
			app.models.user.setUserData(data);
			app.models.user.save();

			app.setAjaxSetup();

			app.views.headerView.render(app.router.mainMenus.manageInterventions);
			Backbone.history.navigate(app.routes.home.url, {trigger: true, replace: true});
		});
		checkLogin.fail(function(){
   	        $('#passUser').parents('.form-group').addClass('has-error');
   	        $('#errorLogin').removeClass('hide');
   	        $('#formConnection').find('fieldset').prop('disabled', false);
   	        $('#passUser').focus();
   	        //app.notify('large', 'danger', app.lang.errorMessages.connectionError, app.lang.errorMessages.loginIncorrect);

   	        // Reset password value //
			$(self.el).find("button[type=submit]").button('reset');
			$('#passUser').val('');
    	});
	},



	/** Hide the last connection information if the user change
	*/
	hideLastConnection: function(){
		$('#lastConnection').fadeOut();
	},



	/** Display the password
	*/
	displayPassword: function(){
		$('#passUser').prop('type', 'text');
	},

	/** Hide the password
	*/
	hidePassword: function(){
		$('#passUser').prop('type', 'password');
		$('#passUser').focus();
	}

});