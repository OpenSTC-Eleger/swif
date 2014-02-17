define([
	'app',
	'appHelpers',

	'officerModel',
	'officersCollection',

	'genericListView',
	'itemUserView',
	'paginationView'

], function(app, AppHelpers, OfficerModel, OfficersCollection, GenericListView, ItemUserView, PaginationView){

	'use strict';


	/******************************************
	* Users List View
	*/
	var UsersListView = GenericListView.extend({

		templateHTML  : 'lists/usersList.html',



		/** View Initialization
		*/
		initialize: function(params) {
			this.options = params;

			var self = this;

			this.initCollection().done(function(){

				app.router.render(self);
			});
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.usersList);


			// Retrieve the template //
			$.get('templates/' + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang    : app.lang,
					nbUsers : self.collection.cpt
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render(self);


				// Create item user view //
				_.each(self.collection.models, function(place){
					var itemUserView  = new ItemUserView({model: place});
					$('#rows-items').append(itemUserView.render().el);
				});


				// Pagination view //
				app.views.paginationView = new PaginationView({
					page       : self.options.page.page,
					collection : self.collection
				});

			});

			$(this.el).hide().fadeIn();

			return this;
		},



		/** Collection Initialisation
		*/
		initCollection: function(){
			var self = this;

			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new OfficersCollection(); }


			// Check the parameters //
			if(_.isUndefined(this.options.sort)){
				this.options.sort = this.collection.default_sort;
			}
			else{
				this.options.sort = AppHelpers.calculPageSort(this.options.sort);
			}
			this.options.page = AppHelpers.calculPageOffset(this.options.page);



			// Create Fetch params //
			this.fetchParams = {
				silent : true,
				data   : {
					limit  : app.config.itemsPerPage,
					offset : this.options.page.offset,
					sort   : this.options.sort.by+' '+this.options.sort.order
				}
			};
			if(!_.isUndefined(this.options.search)){
				this.fetchParams.data.filters = AppHelpers.calculSearch({search: this.options.search }, OfficerModel.prototype.searchable_fields);
			}


			return $.when(self.collection.fetch(this.fetchParams))
				.fail(function(e){
					console.log(e);
				});
		}

	});

	return UsersListView;

});