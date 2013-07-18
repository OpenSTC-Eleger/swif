/******************************************
* Places List View
*/
app.Views.PlacesListView = app.Views.GenericListView.extend({

	el            : '#rowContainer',
	
	templateHTML  : 'places',
	
	selectedPlace : '',
	

	// The DOM events //
	events: function(){
		return _.defaults({
			'click a.modalDeletePlace'                 : 'modalDeletePlace',
			'click a.modalSavePlace'                   : 'modalSavePlace',
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
				places: app.collections.places,
				nbPlaces: app.collections.places.cpt,
			});

			$(self.el).html(template);

			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);



			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page   : self.options.page,
				nbPage : Math.ceil(app.collections.places.cpt / app.config.itemsPerPage) 
			})
			app.views.paginationView.render();


		});

		$(this.el).hide().fadeIn('slow');

		return this;
	},



	setModel: function(e) {
	
		this.model = null;
		this.selectedPlaceJson = null;
		
		e.preventDefault();
		var link = $(e.target);
		var id =  _(link.parents('tr').attr('id')).strRightBack('_');
		this.selectedPlace = _.filter(app.collections.places.models, function(item){ return item.attributes.id == id });
		if( this.selectedPlace.length>0 ) {
			this.model = this.selectedPlace[0];
			this.selectedPlaceJson = this.model.toJSON();        
		}
	},



	/** Add a new categorie
	*/
	modalSavePlace: function(e){  
		
		e.preventDefault();

		var link = $(e.target);
		var id =  _(link.parents('tr').attr('id')).strRightBack('_');

		var model = app.collections.places.get(id);


		app.views.modalPlaceView = new app.Views.ModalPlaceView({
			el    : '#modalSavePlace',
			model : model
		});
		app.views.modalPlaceView.render();

	},



	/** Display information in the Modal view
	*/
	modalDeletePlace: function(e){

		e.preventDefault();

		var link = $(e.target);
		var id =  _(link.parents('tr').attr('id')).strRightBack('_');

		var model = app.collections.places.get(id);


		app.views.modalDeleteView = new app.Views.ModalDeleteView({
			el    : '#modalDeletePlace',
			model : model
		});
		app.views.modalDeleteView.render();
	}

});