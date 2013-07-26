/******************************************
* Places List View
*/
app.Views.PlacesListView = app.Views.GenericListView.extend({

	templateHTML  : 'places',

	selectedPlace : '',
	

	// The DOM events //
	events: function(){
		return _.defaults({
			'click a.modalSavePlace' : 'modalCreatePlace',
		}, 
			app.Views.GenericListView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize: function () {
		this.collection.off();

		// When the model are add in the collection //
		this.listenTo(this.collection, 'add', this.add);	
	},



	/** When the model ara updated //
	*/
	add: function(model){

		console.log('Bind Add');
		console.log(model);

		var itemPlaceView  = new app.Views.ItemPlaceView({model: model});
		$('#rows-items').prepend(itemPlaceView.render().el);
		itemPlaceView.highlight();

		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.placeCreateOk);
		app.collections.places.cpt++;
		app.views.placesListView.partialRender();
	},



	/** Display the view
	*/
	render: function (type) {
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


			// Create item place view //
			_.each(app.collections.places.models, function(place, i){
				var itemPlaceView  = new app.Views.ItemPlaceView({model: place});
				$('#rows-items').append(itemPlaceView.render().el);
			});
		

			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page       : self.options.page,
				collection : app.collections.places
			})
			app.views.paginationView.render();


		});

		$(this.el).hide().fadeIn();

		return this;
	},


	/** Partial Render of the view
	*/
	partialRender: function (type) {
		app.views.paginationView.render();
		$('#bagdeNbPlaces').text(app.collections.places.cpt);
	},



	/** Modal form to create a new Place
	*/
	modalCreatePlace: function(e){
		e.preventDefault();
		
		app.views.modalPlaceView = new app.Views.ModalPlaceView({
			el    : '#modalSavePlace'
		});

	},

});