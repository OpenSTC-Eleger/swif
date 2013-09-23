/******************************************
* Row Intervention View
*/
app.Views.ItemEquipmentView = Backbone.View.extend({

	tagName     : 'tr',

	className   : 'row-item',

	templateHTML : 'items/itemEquipment',
	


	// The DOM events //
	events       : {
		'click a.modalDeleteEquipment'  : 'modalDeleteEquipment',
		'click a.modalSaveEquipment'  	: 'modalSaveEquipment',
	},



	/** View Initialization
	*/
	initialize : function() {
		this.model.off();
		
		// When the model are updated  or deleted //
		this.listenTo(this.model, 'change', this.change);
		this.listenTo(this.model, 'destroy', this.destroy);
	},



	/** When the model ara updated //
	*/
	change: function(model){
		this.render();
		app.Helpers.Main.highlight($(this.el));
		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.equipmentUpdateOk);

	},



	destroy: function(model){
		var self = this;

		app.Helpers.Main.highlight($(this.el)).done(function(){
			self.remove();
			app.views.equipmentsListView.partialRender();

		});

		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.equipmentDeleteOk);
	},



	/** Display the view
	*/
	render : function() {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang  : app.lang,
				equipment : self.model
			});

			$(self.el).html(template);

			// Set the Tooltip //
			$('*[data-toggle="tooltip"]').tooltip();
		});

		return this;
	},



	/** Modal to update an Equipment
	*/
	modalSaveEquipment: function(e){
		new app.Views.ModalEquipmentView({
			model     : this.model,
			el        :'#modalSaveEquipment',

		});
	},



	/** Modal to remove an Equipment
	*/
	modalDeleteEquipment: function(e){
		new app.Views.ModalDeleteView({
			el          :'#modalDeleteEquipment',
			model       :this.model,
			modalTitle  : app.lang.viewsTitles.deletePlace,
			modalConfirm: app.lang.warningMessages.confirmDeletePlace
		});
	},
	
});