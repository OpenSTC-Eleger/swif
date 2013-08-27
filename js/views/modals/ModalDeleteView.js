/******************************************
* Modal Delete View
*/
app.Views.ModalDeleteView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/modalDelete',


	// The DOM events //
	events: function(){
		return _.defaults({
			'click .btnDelete' : 'deleteModel',
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {
		this.modal = $(this.el);


		// If the text for the modal wasn't set //
		if(_.isUndefined(this.options.modalTitle)){
			this.options.modalTitle = app.lang.viewsTitles.deleteElement;
		}
		if(_.isUndefined(this.options.modalConfirm)){
			this.options.modalConfirm = app.lang.warningMessages.confirmDeleteElement;
		}


		this.render();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 
			var template = _.template(templateData, {
				lang         : app.lang,
				modalTitle   : self.options.modalTitle,
				modalConfirm : self.options.modalConfirm,
				model        : self.model
			});

			self.modal.html(template);
			self.modal.modal('show');
		});

		return this;
	},



	/** Delete the model pass in the view
	*/
	deleteModel: function(e){
		var self = this;


		// Set the button in loading State //
		$(e.target).button('loading');

		// Delete the Model //
		this.model.destroy({wait: true})
		.done(function(data){
			self.modal.modal('hide');
		})
		.fail(function(){
			app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
		})
		.always(function(){
			// Reset the button state //
			$(e.target).button('reset');
		})

	}

});