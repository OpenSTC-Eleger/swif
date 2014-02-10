define([
	'app',
	'appHelpers',

	'absentTypesCollection',
	'absentTypeModel',

	'genericListView',
	'paginationView',
	'itemAbsentTypeView',
	'modalAbsentTypeView'

], function(app, AppHelpers, AbsentTypesCollection, AbsentTypeModel, GenericListView, PaginationView ,ItemAbsentTypeView ,ModalAbsentTypeView ){

	'use strict';


	/******************************************
	* Absent Type View - Configuration
	*/
	var absentTypesListView = GenericListView.extend({
		
		templateHTML: '/templates/lists/absentTypesList.html',
		
	
		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.modalCreateAbsentType' : 'modalCreateAbsentType',
			}, 
				GenericListView.prototype.events
			);
		},
	
		
	
		/** View Initialization
		*/
		initialize: function (params) {
			this.options = params;
	
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
	
			var itemAbsentTypeView  = new ItemAbsentTypeView({ model: model });
			$('#rows-items').prepend(itemAbsentTypeView.render().el);
			AppHelpers.highlight($(itemAbsentTypeView.el));
	
			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.absentTypeCreateOk);
			this.partialRender();
		},
	
	
	
		/** Display the view
		*/
		render: function () {
			var self = this;
	
			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.absentTypesList);
	
	
	
			// Retrieve the template // 
			$.get(app.menus.openstc + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang         : app.lang,
					nbAbsentTypes: self.collection.cpt
				});
				
				$(self.el).html(template);
	
				// Call the render Generic View //
				GenericListView.prototype.render(self);
	
	
				// Create item category request view //
				_.each(self.collection.models, function(absentType, i){
					var itemAbsentTypeView  = new ItemAbsentTypeView({model: absentType});
					$('#rows-items').append(itemAbsentTypeView.render().el);
				});
	
	
				// Pagination view //
				app.views.paginationView = new PaginationView({ 
					page       : self.options.page.page,
					collection : self.collection
				})
	
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
			
			app.views.modalAbsentTypeView = new ModalAbsentTypeView({
				el  : '#modalSaveAbsentType'
			});
		},
	
	
	
		/** Collection Initialisation
		*/
	    initCollection: function(){
			var self = this;
	
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new AbsentTypesCollection(); }
	
	
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
				this.fetchParams.data.filters = AppHelpers.calculSearch({search: this.options.search }, AbsentTypeModel.prototype.searchable_fields);
			}
	
	
			return $.when(self.collection.fetch(this.fetchParams))
				.fail(function(e){
					console.log(e);
				})
	
		}
	
	});
	
		
	return absentTypesListView;

});