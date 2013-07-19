/******************************************
* Places List View
*/
app.Views.PlacesListView = app.Views.GenericListView.extend({

	templateHTML  : 'places',

	selectedPlace : '',
	

	// The DOM events //
	events: function(){
		return _.defaults({
			'click a.modalSavePlace'                   : 'modalAddPlace',
		}, 
			app.Views.GenericListView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize: function () {

	},


	/** Display the view
	*/
	render: function () {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.placesList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang: app.lang,
				nbPlaces: app.collections.places.cpt
			});

			$(self.el).html(template);

			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);



			// Create  //
			_.each(app.collections.places.models, function(place, i){

				
				app.views.lol = new app.Views.ItemPlaceView({model: place});

				$('#rows-items').append(app.views.lol.render().el);
			});


			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page   : self.options.page,
				nbPage : Math.ceil(app.collections.places.cpt / app.config.itemsPerPage) 
			})
			app.views.paginationView.render();


		});

		$(this.el).hide().fadeIn();

		return this;
	},



	/** Add a new categorie
	*/
	modalAddPlace: function(e){
		e.preventDefault();
		
		app.views.modalPlaceView = new app.Views.ModalPlaceView({
			el    : '#modalSavePlace'
		});

		app.views.modalPlaceView.render();

	},

});