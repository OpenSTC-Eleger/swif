/******************************************
* About View
*/
app.Views.ModalDeleteView = Backbone.View.extend({


	templateHTML: 'modals/modalDelete',

	modal : null,

	
	// The DOM events //
	events: {
		'click .btnDelete' : 'deleteModel',
		
		'show'             : 'show',
		
		'hide'             : 'hide',
	},



	/** View Initialization
	*/
	initialize : function() {
		this.modal = $(this.el);
	},



	/** Display the view
	*/
	render : function() {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 
			var template = _.template(templateData, {
				lang  : app.lang,
				model : self.options.model
			});

			self.modal.html(template);
			self.modal.modal('show');
		});

		return this;
	},



	/** Trigger when the modal is show
	*/
	show: function(){
		this.delegateEvents(this.events);
	},



	/** Trigger when the modal is hide
	*/
	hide: function(){
		this.undelegateEvents(this.events);
	},



	/** Delete the model pass in the view
	*/
	deleteModel: function(e){
		var self = this;

		this.model.delete({
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					self.modal.modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.placeDeleteOk);
					Backbone.history.loadUrl(Backbone.history.fragment);
				}
			},
			error: function(e){
				alert("Impossible de contacter le serveur");
			}

		});
	}

});