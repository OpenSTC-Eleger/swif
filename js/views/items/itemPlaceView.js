/******************************************
* Place Modal View
*/
app.Views.ItemPlaceView = Backbone.View.extend({

	tagName: 'tr',

	className: 'row-item',

	templateHTML: 'items/itemPlace',


	// The DOM events //
	events: {
		'click '                   : 'modalSavePlace',
		'click a.modalDeletePlace' : 'modalDeletePlace'
	},



	/** View Initialization
	*/
	initialize : function() {

	},



	/** Display the view
	*/
	render : function() {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 
			var template = _.template(templateData, {
				lang  : app.lang,
				place : self.options.model
			});

			$(self.el).html(template);

			// Set the Tooltip //
			$('*[data-toggle="tooltip"]').tooltip();
		});

		return this;
	},



	/** Display Modal form to add/sav a new place
	*/
	modalSavePlace: function(e){  
		e.preventDefault();

		app.views.modalPlaceView = new app.Views.ModalPlaceView({
			el      : '#modalSavePlace',
			model   : this.options.model,
			elFocus : $(e.target).data('form-id')
		});
		app.views.modalPlaceView.render();

	},



	/** Modal to remove a place
	*/
	modalDeletePlace: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalDeleteView = new app.Views.ModalDeleteView({
			el    : '#modalDeletePlace',
			model : this.options.model
		});
		app.views.modalDeleteView.render();
	}


});