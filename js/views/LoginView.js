/******************************************
* Login View
*/
app.Views.LoginView = Backbone.View.extend({


	el: '#rowContainer',

	templateHTML: 'login',

	
	// The DOM events //
	events: {
		'submit #formConnection'    :    'login',
		'keypress #loginUser'       :    'hideLastConnection'
	},



	/** View Initialization
	*/
	initialize: function(user) {
		console.log('Login view Initialize');
	},



	/** Display the view
	*/
	render: function() {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.login);

		// Retrieve the Login template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang: app.lang, 
				user: self.model
			});

			$(self.el).html(template);

			// Set the focus to the login input //
			$('#loginUser').focus();
		});



		$(this.el).hide().fadeIn('slow');
		return this;
	},



	/** Login Function
	*/
	login: function(e){
		e.preventDefault();

		// Retrieve data from the form //
		var login = $('#loginUser').val();
		var pass = $('#passUser').val();


		// Execution user login function //
		this.model.login(login, pass);

		$('#passUser').val('');
	},



	/** Hide the last connection information if the user change
	*/
	hideLastConnection: function(){
		var infoLastConnection = $('#lastConnection');
		if(infoLastConnection.length != 0){
			infoLastConnection.fadeOut();
		}
	},


 
});