/******************************************
* Pagination View
*/
app.Views.PaginationView = Backbone.View.extend({

	el           : '#pagination',
	
	templateHTML : 'pagination',

	currentRoute : null,


	// The DOM events //
	events: {
		'change #goToPage'		: 'goToPage'
	},



	/** View Initialization
	*/
	initialize: function() {
		this.currentRoute = Backbone.history.fragment;
	},



	/** Display the view
	*/
	render: function() {
		var self = this;

		// Retrieve the template //
		$.get('templates/' + this.templateHTML + '.html', function(templateData){
			var template = _.template(templateData, {
				lang   : app.lang,
				route  : _(self.currentRoute).strLeftBack('/page'),
				page   : self.options.page,
				nbPage : Math.ceil(self.collection.cpt / app.config.itemsPerPage)
			});

			self.$el.html(template);
		});

		return this;
	},



	/** Go to the page
	*/
	goToPage: function(e){
		var page = $(this.el).find('option:selected').val();


		// Navigate to the page - Check if we are on a page //
		if(_.str.include(_(this.currentRoute).strRightBack('/'), 'page')){
			navigateTo = _(this.currentRoute).strLeftBack('page')+'page'+page;
		}
		else{
			navigateTo = this.currentRoute+'/page'+page;
		}

		app.router.navigate(navigateTo, {trigger: true, replace: true});
	},

});