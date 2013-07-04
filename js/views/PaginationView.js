/******************************************
* Pagination View
*/
app.Views.PaginationView = Backbone.View.extend({

	el           : '#pagination',
	
	templateHTML : 'pagination',


	// The DOM events //
	events: {
		'change #goToPage'		: 'goToPage'
	},



	/** View Initialization
	*/
	initialize: function () {

	},



	/** Display the view
	*/
	render: function() {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang   : app.lang,
				route  : self.options.route,
				page   : self.options.page,
				nbPage : self.options.nbPage
			});
			
			$(self.el).html(template);
		});

		return this;
	},



	/** Go to the page
	*/
	goToPage: function(e){
		var page = $('#goToPage option:selected').val();
		
		app.router.navigate(this.options.route+'/page'+page, {trigger: true, replace: true});
	},

});