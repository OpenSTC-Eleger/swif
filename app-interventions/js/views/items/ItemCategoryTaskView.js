define([
	'app',
	'appHelpers',

	'categoryTaskModel',
	'modalCategoryTaskView',
	'modalDeleteView'


], function(app, AppHelpers, CategoryTaskModel, ModalCategoryTaskView, ModalDeleteView){

	'use strict';


	/******************************************
	* Row Category Task View
	*/
	var itemCategoryTaskView = Backbone.View.extend({

		tagName      : 'tr',

		className    : 'row-item',

		templateHTML : '/templates/items/itemCategoryTask.html',


		// The DOM events //
		events: {
			'click'                  : 'modalUpdateCat',
			'click a.modalDeleteCat' : 'modalDeleteCat'
		},



		/** View Initialization
		*/
		initialize : function() {
			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);

			// When the model are destroy //
			this.listenTo(this.model,'destroy', this.destroy);
		},



		/** When the model is updated //
		*/
		change: function(){

			this.render();
			AppHelpers.highlight($(this.el));
			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.catUpdateOk);
		},



		/** When the model is destroy //
		*/
		destroy: function(e){
			var self = this;

			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
				app.views.categoriesTasksListView.partialRender();
			});

			app.notify('', 'success', app.lang.infoMessages.information, e.getName()+' : '+app.lang.infoMessages.catDeleteOk);
		},



		/** Display the view
		*/
		render : function() {
			var self = this;

			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang : app.lang,
					cat  : self.model
				});

				$(self.el).html(template);

				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();
			});

			return this;
		},



		/** Display Modal form to add/sav a new Category
		*/
		modalUpdateCat: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalCategoryTaskView = new ModalCategoryTaskView({
				el      : '#modalSaveCat',
				model   : this.model,
				elFocus : $(e.target).data('form-id')
			});
		},



		/** Modal to remove a Category
		*/
		modalDeleteCat: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalDeleteView = new ModalDeleteView({
				el           : '#modalDeleteCat',
				model        : this.model,
				modalTitle   : app.lang.viewsTitles.deleteCategory,
				modalConfirm : app.lang.warningMessages.confirmDeleteCategory
			});
		},

	});


	return itemCategoryTaskView;

});