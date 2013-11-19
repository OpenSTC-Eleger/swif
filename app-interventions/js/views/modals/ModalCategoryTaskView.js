define([
	'app',
	'appHelpers',

	'genericModalView',
	'advancedSelectBoxView',

	'categoriesTasksCollection',	
	'claimersServicesCollection',
	
	'categoryTaskModel',

	'bsSwitch'

], function(app, AppHelpers, GenericModalView, AdvancedSelectBoxView, CategoriesTasksCollection, ClaimersServicesCollection, CategoryTaskModel, bootstrapSwitch){


	'use strict';


	/******************************************
	* Category Task Modal View
	*/
	var modalCategoryTaskView = GenericModalView.extend({
	
	
		templateHTML : 'modals/modalCategoryTask',
	
	
	
		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formSaveCat'  : 'saveCat'
			}, 
				GenericModalView.prototype.events
			);
		},
	
	
	
		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
	
			this.modal = $(this.el);
	
			// Check if it's a create or an update //
			if(_.isUndefined(this.model)){
				this.model = new CategoryTaskModel();
			}
	
			this.render();
		},
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
	
			// Retrieve the template // 
			$.get(app.moduleUrl+"/templates/" + this.templateHTML + ".html", function(templateData){
	
				var template = _.template(templateData, {
					lang  : app.lang,
					cat   : self.model
				});
	
				self.modal.html(template);
	
				app.views.advancedSelectBoxCatParentView = new AdvancedSelectBoxView({el: $("#catParentCat"), collection: CategoriesTasksCollection.prototype })
				// Condition to prevent a Cat to be parent if itself //
				if(!self.model.isNew()){
					app.views.advancedSelectBoxCatParentView.setSearchParam({ field : 'id', operator : '!=', value : self.model.getId() }, true);
				}
				app.views.advancedSelectBoxCatParentView.render();
	
				app.views.advancedSelectBoxCatServices = new AdvancedSelectBoxView({el: $("#catServices"), collection: ClaimersServicesCollection.prototype })
				app.views.advancedSelectBoxCatServices.render();
	
				self.modal.modal('show');
			});
	
			return this;
		},
	
	
	
		/** Delete the model pass in the view
		*/
		saveCat: function(e){
			e.preventDefault();
	
			var self = this;
	
			// Set the button in loading State //
			$(this.el).find("button[type=submit]").button('loading');
	
	
			// Set the properties of the model //
			this.model.setName(this.$('#catName').val(), true);
			this.model.setCode(this.$('#catCode').val().toUpperCase(), true);
			this.model.setParentCat(app.views.advancedSelectBoxCatParentView.getSelectedItem(), true);
			this.model.setServices(app.views.advancedSelectBoxCatServices.getSelectedItems(), true);
	
	
	
			this.model.save()
				.done(function(data) {
					self.modal.modal('hide');
	
					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : CategoriesTasksCollection.prototype.fields} }).done(function(){
							app.views.categoriesTasksListView.collection.add(self.model);
						})
					// Update mode //
					} else {
						self.model.fetch({ data : {fields : self.model.fields} });
					}
				})
				.fail(function (e) {
					AppHelpers.printError(e);
				})
				.always(function () {
					$(self.el).find("button[type=submit]").button('reset');
				});
		},
	
	});
	
		
	return modalCategoryTaskView;

});