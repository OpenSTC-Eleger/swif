/******************************************
* Claimers Type List View
*/
app.Views.ClaimersTypesListView = app.Views.GenericListView.extend({

	templateHTML: 'claimersTypesList',
	

	// The DOM events //
	events: function(){
		return _.defaults({
			'click a.modalCreateClaimerType' : 'modalCreateClaimerType',
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

		var itemClaimerTypeView  = new app.Views.ItemClaimerTypeView({ model: model });
		$('#rows-items').prepend(itemClaimerTypeView.render().el);
		app.Helpers.Main.highlight($(itemClaimerTypeView.el));

		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.claimerTypeCreateOk);
		this.partialRender();
	},



	/** Display the view
	*/
	render: function () {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.claimersTypesList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);


		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang           : app.lang,
				nbClaimersTypes: self.collection.cpt
			});
			
			$(self.el).html(template);

			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);


			// Create item category request view //
			_.each(self.collection.models, function(claimerType, i){
				var itemClaimerTypeView  = new app.Views.ItemClaimerTypeView({model: claimerType});
				$('#rows-items').append(itemClaimerTypeView.render().el);
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
			$('#badgeNbClaimerTypes').html(self.collection.cpt);
			app.views.paginationView.render();
		});
	},



	/** Modal form to create a new Cat
	*/
	modalCreateClaimerType: function(e){
		e.preventDefault();
		
		app.views.modalClaimerTypeView = new app.Views.ModalClaimerTypeView({
			el  : '#modalSaveClaimerType'
		});
	},



	/** Collection Initialisation
	*/
    initCollection: function(){
		var self = this;

		// Check if the collections is instantiate //
		if(_.isUndefined(this.collection)){ this.collection = new app.Collections.ClaimersTypes(); }


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
			this.fetchParams.data.filters = app.Helpers.Main.calculSearch({search: this.options.search }, app.Models.ClaimerType.prototype.searchable_fields);
		}


		return $.when(self.collection.fetch(this.fetchParams))
			.fail(function(e){
				console.log(e);
			})

	}

});