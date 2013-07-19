/******************************************
* Place Modal View
*/
app.Views.ModalPlaceView = app.Views.GenericModalView.extend({


	templateHTML: 'modals/modalPlace',

	modal : null,


	// The DOM events //
	events: function(){
		return _.defaults({
			'change #placeWidth, #placeLenght' : 'calculPlaceArea',
			'submit #formSavePlace'            : 'savePlaceModel'
		}, 
			app.Views.GenericModalView.prototype.events
		);
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
				place : self.options.model
			});

			self.modal.html(template);


			// Advance Select List View //
			app.views.advancedSelectBoxPlaceTypeView = new app.Views.AdvancedSelectBoxView({el: $("#placeType"), model: app.Models.PlaceType.prototype.model_name })
			app.views.advancedSelectBoxPlaceTypeView.render();

			app.views.advancedSelectBoxPlaceParentView = new app.Views.AdvancedSelectBoxView({el: $("#placeParentPlace"), model: app.Models.Place.prototype.model_name })
			app.views.advancedSelectBoxPlaceParentView.render();

			app.views.advancedSelectBoxPlaceServices = new app.Views.AdvancedSelectBoxView({el: $("#placeServices"), model: app.Models.ClaimerService.prototype.model_name })
			app.views.advancedSelectBoxPlaceServices.render();


			self.modal.modal('show');
		});

		return this;
	},



	/** Trigger when the modal is shown
	*/
	shown: function(){

		// Set the focus to the first input of the form if elFocus is undefined //
		if(_.isUndefined(this.options.elFocus)){
			this.modal.find('input, textarea').first().focus();
		}
		else{
			if($('#'+this.options.elFocus).hasClass('select2')){
				$('#'+this.options.elFocus).select2('open');	
			}
			else{
				this.modal.find('#'+this.options.elFocus).focus();	
			}
		}
	},



	/** Delete the model pass in the view
	*/
	savePlaceModel: function(e){
		e.preventDefault();

		var self = this;

		var params = {	
			name: this.$('#placeName').val(),
			service_ids: [[6, 0, app.views.advancedSelectBoxPlaceServices.getSelectedItems()]],
			type: app.views.advancedSelectBoxPlaceTypeView.getSelectedItem(),
			site_parent_id: app.views.advancedSelectBoxPlaceParentView.getSelectedItem(),
			width: this.$('#placeWidth').val(),
			lenght: this.$('#placeLenght').val(),
			surface: this.$('#placeArea').val(),
		};

		// If it's a create pass 0 as ID //
		if(_.isUndefined(this.options.model)){ var id = 0; }
		else{ var id = this.options.model.getId(); }

		
		app.Models.Place.prototype.save(
			params,
			id, {
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					self.modal.modal('hide');
					app.notify('', 'success', app.lang.infoMessages.information, app.lang.infoMessages.placeSaveOk);
					Backbone.history.loadUrl(Backbone.history.fragment);
				}
			},
			error: function () {
				alert("Impossible de contacter le serveur");
			},	
		});

	},



	/** Calcul the area of the place
	*/
	calculPlaceArea: function (e) {
		$('#placeArea').val($('#placeWidth').val() * $('#placeLenght').val());
	}

});