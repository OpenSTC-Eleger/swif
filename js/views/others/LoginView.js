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

		// Execution user login function //
		this.model.login($('#loginUser').val(), $('#passUser').val());

		
		// Reset password value //
		$('#passUser').val('');
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