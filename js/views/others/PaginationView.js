define([
	'app',

], function(app){


	/******************************************
	* Pagination View
	*/
	var PaginationView = Backbone.View.extend({

		el              : '#pagination',
		
		templateHTML    : 'pagination',

		currentRoute    : null,

		itemsPerPage    : 0,

		size            : '',

		displayGoToPage : true,


		// The DOM events //
		events: {
			'change #goToPage'		: 'goToPage'
		},



		/** View Initialization
		*/
		initialize: function(options) {

			this.currentRoute = Backbone.history.fragment;

			this.page = options.page;

			// Display Go To Page //
			if(!_.isUndefined(options.displayGoToPage)){
				this.displayGoToPage = this.displayGoToPage;
			}

			// Size //
			if(!_.isUndefined(options.size)){
				this.size = options.size;
			}


			// Item per Page //
			if(!_.isUndefined(options.itemsPerPage)){
				this.itemsPerPage = options.itemsPerPage;
			}
			else{
				this.itemsPerPage = app.config.itemsPerPage;
			}

			this.render();
		},



		/** Display the view
		*/
		render: function() {
			var self = this;

			// Retrieve the template //
			$.get('templates/' + this.templateHTML + '.html', function(templateData){
				var template = _.template(templateData, {
					lang    : app.lang,
					route   : _(self.currentRoute).strLeftBack('/page'),
					page    : self.page,
					nbPage  : Math.ceil(self.collection.cpt / self.itemsPerPage),
					goToPage: self.displayGoToPage,
					size    : self.size
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
		}

	});

return PaginationView;

});