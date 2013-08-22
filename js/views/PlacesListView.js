/******************************************
* Places List View
*/
app.Views.PlacesListView = app.Views.GenericListView.extend({

	templateHTML  : 'placesList',


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

		var self = this;

		this.initCollection().done(function(){

			// Unbind & bind the collection //
			self.collection.off();
			self.listenTo(self.collection, 'add', self.add);

			app.router.render(self);
		})
	},



	/** When the model ara created //
	*/
	add: function(model){

		var itemPlaceView  = new app.Views.ItemPlaceView({ model: model });
		$('#rows-items').prepend(itemPlaceView.render().el);
		itemPlaceView.highlight();

		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.placeCreateOk);
		this.partialRender();
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
				lang    : app.lang,
				nbPlaces: self.collection.cpt
			});

			$(self.el).html(template);

			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);


			// Create item place view //
			_.each(self.collection.models, function(place, i){
				var itemPlaceView  = new app.Views.ItemPlaceView({model: place});
				$('#rows-items').append(itemPlaceView.render().el);
			});


			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page       : self.options.page.page,
				collection : self.collection
			})
			app.views.paginationView.render();

		});

		$(this.el).hide().fadeIn();

		return this;
	},


	/** Partial Render of the view
	*/
	partialRender: function (type) {
		var self = this; 

		this.collection.count().done(function(){
			$('#bagdeNbPlaces').html(self.collection.cpt);
			app.views.paginationView.render();
		});
	},



	/** Modal form to create a new Place
	*/
	modalCreatePlace: function(e){
		e.preventDefault();
		
		app.views.modalPlaceView = new app.Views.ModalPlaceView({
			el  : '#modalSavePlace'
		});
	},



	initCollection: function(){
		var self = this;

		// Check if the collections is instantiate //
		if(_.isUndefined(this.collection)){ this.collection = new app.Collections.Places(); }


		// Check the parameters //
		if(_.isUndefined(this.options.sort)){
			this.options.sort = this.collection.default_sort;
		}
		else{
			this.options.sort = app.calculPageSort(this.options.sort);	
		}
		this.options.page = app.calculPageOffset(this.options.page);


		// Create Fetch params //
		var fetchParams = {
			silent : true,
			data   : {
				limit  : app.config.itemsPerPage,
				offset : this.options.page.offset,
				sort   : this.options.sort.by+' '+this.options.sort.order
			}
		};
		if(!_.isUndefined(this.options.search)){
			fetchParams.data.filters = app.calculSearch({search: this.options.search }, app.Models.Place.prototype.searchable_fields);
		}


		app.loader('display');
		return $.when(self.collection.fetch(fetchParams))
			.fail(function(e){
				console.log(e);
			})
			.always(function(){
				app.loader('hide');
			});

	}

});