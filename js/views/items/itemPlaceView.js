/******************************************
* Row Place View
*/
app.Views.ItemPlaceView = Backbone.View.extend({

	tagName: 'tr',

	className: 'row-item',

	templateHTML: 'items/itemPlace',


	// The DOM events //
	events: {
		'click '                   : 'modalUpdatePlace',
		'click a.modalDeletePlace' : 'modalDeletePlace'
	},



	/** View Initialization
	*/
	initialize : function() {
		this.model.off();

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);

		// When the model are removed //
		this.listenTo(this.model,'destroy', this.destroy);
	},



	/** When the model ara updated //
	*/
	change: function(e){

		this.render();
		this.highlight();
		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.placeUpdateOk);
	},



	/** When the model ara removed //
	*/
	destroy: function(e){
		var self = this;

		this.highlight().done(function(){
			self.remove();
		});

		app.notify('', 'success', app.lang.infoMessages.information, e.getCompleteName()+' : '+app.lang.infoMessages.placeDeleteOk);
		app.views.placesListView.collection.cpt--;
		app.views.placesListView.partialRender();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang  : app.lang,
				place : self.model
			});

			$(self.el).html(template);

			// Set the Tooltip //
			$('*[data-toggle="tooltip"]').tooltip();
		});

		return this;
	},



	/** Display Modal form to add/sav a new place
	*/
	modalUpdatePlace: function(e){  
		e.preventDefault(); e.stopPropagation();

		app.views.modalPlaceView = new app.Views.ModalPlaceView({
			el      : '#modalSavePlace',
			model   : this.model,
			elFocus : $(e.target).data('form-id')
		});
	},



	/** Modal to remove a place
	*/
	modalDeletePlace: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalDeleteView = new app.Views.ModalDeleteView({
			el         : '#modalDeletePlace',
			model      : this.model
		});
	},


	/** Highlight the row item
	*/
	highlight: function(){
		var self = this;

		$(this.el).addClass('highlight');

		var deferred = $.Deferred();

		// Once the CSS3 animation are end the class are removed //
		$(this.el).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
			function(e) {
			$(self.el).removeClass('highlight');
			deferred.resolve();
		});

		return deferred;
	}


});