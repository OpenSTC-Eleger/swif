/******************************************
* Absent Type View - Configuration
*/
app.Views.AbsentTypesListView = app.Views.GenericListView.extend({
	
	templateHTML: 'absentTypesList',
	

	// The DOM events //
	events: function(){
		return _.defaults({
			'click a.modalCreateAbsentType' : 'modalCreateAbsentType',
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

		var itemAbsentTypeView  = new app.Views.ItemAbsentTypeView({ model: model });
		$('#rows-items').prepend(itemAbsentTypeView.render().el);
		app.Helpers.Main.highlight($(itemAbsentTypeView.el));

		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.absentTypeCreateOk);
		this.partialRender();
	},



	/** Display the view
	*/
	render: function () {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.absentTypesList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');

		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang         : app.lang,
				nbAbsentTypes: self.collection.cpt
			});
			
			$(self.el).html(template);

			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);


			// Create item category request view //
			_.each(self.collection.models, function(absentType, i){
				var itemAbsentTypeView  = new app.Views.ItemAbsentTypeView({model: absentType});
				$('#rows-items').append(itemAbsentTypeView.render().el);
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

		this.collection.count(this.fetchParams).done(function(){
			$('#badgeNbAbsentTypes').html(self.collection.cpt);
			app.views.paginationView.render();
		});
	},



	/** Modal form to create a new Cat
	*/
	modalCreateAbsentType: function(e){
		e.preventDefault();
		
		app.views.modalAbsentTypeView = new app.Views.ModalAbsentTypeView({
			el  : '#modalSaveAbsentType'
		});
	},



	/** Collection Initialisation
	*/
    initCollection: function(){
		var self = this;

		// Check if the collections is instantiate //
		if(_.isUndefined(this.collection)){ this.collection = new app.Collections.AbsentTypes(); }


		// Check the parameters //
		if(_.isUndefined(this.options.sort)){
			this.options.sort = this.collection.default_sort;
		}
		else{
			this.options.sort = app.Helpers.Main.calculPageSort(this.options.sort);	
		}
		this.options.page = app.Helpers.Main.calculPageOffset(this.options.page);


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
			this.fetchParams.data.filters = app.Helpers.Main.calculSearch({search: this.options.search }, app.Models.AbsentType.prototype.searchable_fields);
		}


		return $.when(self.collection.fetch(this.fetchParams))
			.fail(function(e){
				console.log(e);
			})

	}

});