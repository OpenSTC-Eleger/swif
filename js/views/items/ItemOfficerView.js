/******************************************
* Row Officer View
*/
app.Views.ItemOfficerView = Backbone.View.extend({

	tagName      : 'tr',

	className    : 'row-item',

	templateHTML : 'items/itemOfficer',


	// The DOM events //
	events: {
		'click a.modalUpdateOfficer' : 'modalUpdateOfficer',
		'click a.modalDeleteOfficer' : 'modalDeleteOfficer'
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
	change: function(e){

		this.render();
		app.Helpers.Main.highlight($(this.el));
		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.officerUpdateOk);
	},



	/** When the model is destroy //
	*/
	destroy: function(e){
		var self = this;

		app.Helpers.Main.highlight($(this.el)).done(function(){
			self.remove();
		});

		app.notify('', 'success', app.lang.infoMessages.information, e.getCompleteName()+' : '+app.lang.infoMessages.officerDeleteOk);
		
	},



	/** Display the view
	*/
	render : function() {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang    : app.lang,
				officer : self.model
			});

			$(self.el).html(template);

			// Set the Tooltip //
			$('*[data-toggle="tooltip"]').tooltip();
		});

		return this;
	},



	/** Display Modal form to add/sav a new officer
	*/
	modalUpdateOfficer: function(e){  
		e.preventDefault(); e.stopPropagation();

		app.views.modalOfficerView = new app.Views.ModalOfficerView({
			el      : '#modalSaveOfficer',
			model   : this.model,
			elFocus : $(e.target).data('form-id')
		});
	},



	/** Modal to remove an officer
	*/
	modalDeleteOfficer: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalDeleteView = new app.Views.ModalDeleteView({
			el           : '#modalDeleteOfficer',
			model        : this.model,
			modalTitle   : app.lang.viewsTitles.deleteOfficer,
			modalConfirm : app.lang.warningMessages.confirmDeleteOfficer
		});
	}

});