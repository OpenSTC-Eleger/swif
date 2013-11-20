define([
	'app',
	'appHelpers',

	'equipmentsCollection',
	'equipmentModel',

	'genericListView',
	'paginationView',
	'itemEquipmentView',
	'modalEquipmentView'

], function(app, AppHelpers, EquipmentsCollection, EquipmentModel, GenericListView, PaginationView, ItemEquipmentView, ModalEquipmentView){

	'use strict';


	/******************************************
	* Equipments List View
	*/
	var EquipmentsListView = GenericListView.extend({
		
		templateHTML: 'lists/equipmentsList',
		

		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.modalAddEquipment'  : 'modalCreateEquipment',
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
			});
		},



		/** When the model ara created //
		*/
		add: function(model){

			var itemEquipmentView  = new ItemEquipmentView({ model: model });
			$('#row-items').prepend(itemEquipmentView.render().el);
			AppHelpers.highlight($(itemEquipmentView.el));
			
			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.equipmentCreateOk);
			this.partialRender();
		},


		
		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.equipmentsList);


			// Retrieve the template // 
			$.get("templates/" + this.templateHTML + ".html", function(templateData){
				var template = _.template(templateData, {
					lang        : app.lang,
					nbEquipments: self.collection.cpt
				});
				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render(self.options);

				
				//create ItemView for each equipment in the collection
				_.each(self.collection.models, function(equipment ,i){
					var itemEquipmentView  = new ItemEquipmentView({model: equipment});
					$('#row-items').append(itemEquipmentView.render().el);
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



		/** Partial Render of the view
		*/
		partialRender: function (type) {
			var self = this; 

			this.collection.count(this.fetchParams).done(function(){
				$('#badgeNbEquipments').html(self.collection.cpt);
				app.views.paginationView.render();
			});
		},



		/** Add a new equipment
		*/
		modalCreateEquipment: function(e){
			e.preventDefault();

			app.views.ModalEquipmentView = new ModalEquipmentView({
				el  : '#modalSaveEquipment'
			});
		},


		
		initCollection: function(){
			var self = this;

			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new EquipmentsCollection(); }
			
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
				this.fetchParams.data.filters = AppHelpers.calculSearch({search: this.options.search }, EquipmentModel.prototype.searchable_fields);
			}
			
			return $.when(self.collection.fetch(this.fetchParams))
				.fail(function(e){
					console.log(e);
				})
			
		}

	});

return EquipmentsListView;

});