/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'placeModel',
	'placesCollection',
	'placeTypesCollection',
	'claimersServicesCollection',
	'claimersTypesCollection',

	'genericModalView',
	'advancedSelectBoxView',
	'bsSwitch'


], function(app, PlaceModel, PlacesCollection, PlaceTypesCollection, ClaimersServicesCollection, ClaimersTypesCollection, GenericModalView, AdvancedSelectBoxView){

	'use strict';


	/******************************************
	* Place Modal View
	*/
	var ModalPlaceView = GenericModalView.extend({


		templateHTML : 'templates/modals/modalPlace.html',



		// The DOM events //
		events: function(){
			return _.defaults({
				'change #placeWidth, #placeLength' : 'calculPlaceArea',
				'submit #formSavePlace'            : 'savePlace'
			},
				GenericModalView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			var self = this;

			this.modal = $(this.el);


			// Check if it's a create or an update //
			if(_.isUndefined(this.model)){

				this.model = new PlaceModel();
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
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang  : app.lang,
					place : self.model,
					loader: loader
				});


				self.modal.html(template);
				$('.make-switch').bootstrapSwitch();
				if(!loader){
					// Advance Select List View //
					app.views.advancedSelectBoxPlaceTypeView = new AdvancedSelectBoxView({el: $('#placeType'), url: PlaceTypesCollection.prototype.url });
					app.views.advancedSelectBoxPlaceTypeView.render();

					app.views.advancedSelectBoxPlaceParentView = new AdvancedSelectBoxView({el: $('#placeParentPlace'), url: PlacesCollection.prototype.url });
					if(!self.model.isNew()){
						app.views.advancedSelectBoxPlaceParentView.setSearchParam({ field: 'id', operator: '!=', value: self.model.getId() }, true);
					}
					app.views.advancedSelectBoxPlaceParentView.render();

					app.views.advancedSelectBoxPlaceServices = new AdvancedSelectBoxView({el: $('#placeServices'), url: ClaimersServicesCollection.prototype.url });
					app.views.advancedSelectBoxPlaceServices.render();

					app.views.advancedSelectBoxPlaceBookingServices = new AdvancedSelectBoxView({el: $('#placeBookingServices'), url: ClaimersServicesCollection.prototype.url });
					app.views.advancedSelectBoxPlaceBookingServices.render();

					app.views.advancedSelectBoxPlaceBookingClaimers = new AdvancedSelectBoxView({el: $('#placeBookingClaimers'), url: ClaimersTypesCollection.prototype.url });
					app.views.advancedSelectBoxPlaceBookingClaimers.render();
				}

				self.modal.modal('show');
			});

			return this;
		},



		/** Save the model pass in the view
		*/
		savePlace: function(e){
			e.preventDefault();

			var self = this;

			// Set the button in loading State //
			$(this.el).find('button[type=submit]').button('loading');


			var params = {
				name                     : this.$('#placeName').val(),
				service_ids              : [[6, 0, app.views.advancedSelectBoxPlaceServices.getSelectedItems()]],
				type                     : app.views.advancedSelectBoxPlaceTypeView.getSelectedItem(),
				site_parent_id           : app.views.advancedSelectBoxPlaceParentView.getSelectedItem(),
				width                    : this.$('#placeWidth').val(),
				length                   : this.$('#placeLength').val(),
				surface                  : this.$('#placeArea').val(),
				internal_booking         : this.$('#placeInternalBooking:checked').val() == '1',
				external_booking         : this.$('#placeExternalBooking:checked').val() == '1',
				service_bookable_ids     : [[6, 0, app.views.advancedSelectBoxPlaceBookingServices.getSelectedItems()]],
				partner_type_bookable_ids: [[6, 0, app.views.advancedSelectBoxPlaceBookingClaimers.getSelectedItems()]],
				color                    : this.$('#displayColor').val(),
				block_booking            : $('#placeBlockingBookable').bootstrapSwitch('state')
			};


			this.model.save(params, {patch: !this.model.isNew(), silent: true})
				.done(function(data) {
					self.modal.modal('hide');

					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : PlacesCollection.prototype.fields} }).done(function(){
							app.views.placesListView.collection.add(self.model);
						});
					// Update mode //
					} else {
						self.model.fetch({ data : {fields : self.model.fields} });
					}
				})
				.fail(function (e) {
					console.log(e);
				})
				.always(function () {
					$(self.el).find('button[type=submit]').button('reset');
				});
		},



		/** Calcul the area of the place
		*/
		calculPlaceArea: function() {
			$('#placeArea').val($('#placeWidth').val() * $('#placeLength').val());
		}

	});

	return ModalPlaceView;

});