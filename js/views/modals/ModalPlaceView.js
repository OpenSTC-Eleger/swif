/******************************************
* Place Modal View
*/
app.Views.ModalPlaceView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/modalPlace',



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
			
			this.model = new app.Models.Place();
			this.render();
		}
		else{
			// Render with loader //
			this.render(true);
			this.model.fetch({silent: true, data : {fields : this.model.fields}}).done(function(){
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

			if(!loader){
				// Advance Select List View //
				app.views.advancedSelectBoxPlaceTypeView = new app.Views.AdvancedSelectBoxView({el: $("#placeType"), collection_url: app.Collections.PlaceTypes.prototype.url })
				app.views.advancedSelectBoxPlaceTypeView.render();

				app.views.advancedSelectBoxPlaceParentView = new app.Views.AdvancedSelectBoxView({el: $("#placeParentPlace"), collection_url: app.Collections.Places.prototype.url })
				app.views.advancedSelectBoxPlaceParentView.render();

				app.views.advancedSelectBoxPlaceServices = new app.Views.AdvancedSelectBoxView({el: $("#placeServices"), collection_url: app.Collections.ClaimersServices.prototype.url })
				app.views.advancedSelectBoxPlaceServices.render();
			}

			self.modal.modal('show');
		});

		return this;
	},



	/** Delete the model pass in the view
	*/
	savePlace: function(e){
		e.preventDefault();

		var self = this;

		// Set the button in loading State //
		$(this.el).find("button[type=submit]").button('loading');


		// Set the properties of the model //
		this.model.setName(this.$('#placeName').val(), true);
		this.model.setServices(app.views.advancedSelectBoxPlaceServices.getSelectedItems(), true);
		this.model.setType(app.views.advancedSelectBoxPlaceTypeView.getSelectedItem(), true);
		this.model.setParentPlace(app.views.advancedSelectBoxPlaceParentView.getSelectedItem(), true);
		this.model.setWidth(this.$('#placeWidth').val(), true);
		this.model.setLenght(this.$('#placeLenght').val(), true);
		this.model.setSurface(this.$('#placeArea').val(), true);


		this.model.save()
			.done(function(data) {
				self.modal.modal('hide');

				// Create mode //
				if(self.model.isNew()) {
					self.model.setId(data);
					self.model.fetch({silent: true, data : {fields : self.model.fields} }).done(function(){
						app.views.placesListView.collection.add(self.model);
					})
				// Update mode //
				} else {
					self.model.fetch({ data : {fields : self.model.fields} });
				}
			})
			.fail(function (e) {
				console.log(e);
			})
			.always(function () {
				$(self.el).find("button[type=submit]").button('reset');
			});
	},



	/** Calcul the area of the place
	*/
	calculPlaceArea: function (e) {
		$('#placeArea').val($('#placeWidth').val() * $('#placeLenght').val());
	}

});