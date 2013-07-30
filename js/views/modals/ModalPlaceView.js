/******************************************
* Place Modal View
*/
app.Views.ModalPlaceView = app.Views.GenericModalView.extend({


	templateHTML: 'modals/modalPlace',

	modal : null,

	createMode : false,


	// The DOM events //
	events: function(){
		return _.defaults({
			'change #placeWidth, #placeLenght' : 'calculPlaceArea',
			'submit #formSavePlace'            : 'savePlace'
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {
		var self = this;

		this.modal = $(this.el);

		
		// Check if it's a create or an update //
		if(_.isUndefined(this.model)){
			this.createMode = true;
			this.render();
		}
		else{
			// Render with loader //
			this.render(true);
			this.model.fetch({silent: true}).done(function(){
				self.render();
			});
		}

	},



	/** Display the view
	*/
	render : function(loader) {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 
			var template = _.template(templateData, {
				lang  : app.lang,
				place : self.model,
				loader: loader
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
	savePlace: function(e){
		e.preventDefault();

	
		var self = this;

		// Set the button in loading State //
		$(this.el).find("button[type=submit]").button('loading');


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
		if(this.createMode){ var id = 0; }
		else{ var id = this.model.getId(); }

		
		app.Models.Place.prototype.save(
			params,
			id, {
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					self.modal.modal('hide');

					// Create Place //
					if(self.createMode){
						var newPlace = new app.Models.Place({ id: data.result.result });

						// Fetch the new model //
						newPlace.fetch().done(function(){
							app.views.placesListView.collection.add(newPlace);
						})
					}
					// Update Place //
					else{
						self.model.fetch();
					}
				}
			},
			complete: function(){
				// Reset the button state //
				$(self.el).find("button[type=submit]").button('reset');
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