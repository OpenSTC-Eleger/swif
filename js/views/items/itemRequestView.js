/******************************************
* Row Request View
*/
app.Views.ItemRequestView = Backbone.View.extend({

	tagName     : 'tr',

	className   : function(){

		var classRow = '';

		if(this.model.getState() == app.Models.Request.status.wait.key && app.models.user.isManager()) {
			classRow = app.Models.Request.status.wait.color + ' bolder';
		}
		else if(this.model.getState() == app.Models.Request.status.confirm.key && app.models.user.isDST()){
			classRow = app.Models.Request.status.confirm.color + ' bolder';
		}

		return classRow;
	},

	templateHTML : 'items/itemRequest',


	// The DOM events //
	events       : {
		'click .buttonValidRequest'				: 'setInfoModal',
		'click .buttonRefusedRequest'			: 'setInfoModal',
		'click .buttonConfirmRequest'			: 'setInfoModal'
	},



	/** View Initialization
	*/
	initialize : function() {
		this.model.off();

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);
	},



	/** When the model ara updated //
	*/
	change: function(e){

		this.render();
		this.highlight();
		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.placeUpdateOk);
	},



	/** Display the view
	*/
	render : function() {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 
			var template = _.template(templateData, {
				lang    : app.lang,
				request : self.model
			});

			$(self.el).html(template);

			// Set the Tooltip / Popover //
			$('*[data-toggle="tooltip"]').tooltip();
			$('*[data-toggle="popover"]').popover({trigger: 'hover'});

		});

		return this;
	},



	/** Display Modal form to add/sav a new place
	*/
	modalCreatePlace: function(e){  
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
			model      : this.model,
			collection : app.collections.places
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