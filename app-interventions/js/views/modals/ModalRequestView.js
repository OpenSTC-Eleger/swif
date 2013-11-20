define([
	'app',

	'genericModalView',
	'advancedSelectBoxView',

	'requestsCollection',
	'claimersCollection',
	'claimersContactsCollection',
	'equipmentsCollection',
	'placesCollection',
	'claimersServicesCollection',

	'requestModel',
	'claimerContactModel',
	'claimerModel',

	'bsSwitch'

], function(app, GenericModalView, AdvancedSelectBoxView, RequestsCollection, ClaimersCollection, ClaimersContactsCollection, EquipmentsCollection, PlacesCollection, ClaimersServicesCollection, RequestModel, ClaimerContactModel, ClaimerModel, bootstrapSwitch){

	'use strict';


	/******************************************
	* Requests Details View
	*/
	var ModalRequestView = GenericModalView.extend({


		templateHTML : 'modals/modalRequest',



		// The DOM events //
		events: function() {
			return _.defaults({
				'submit #formSaveRequest'            : 'saveRequest',
				
				'switch-change #switchCitizen'       : 'switchCitizen',
				'switch-change #switchPlaceEquipment': 'switchPlaceEquipment',
				
				'change #requestClaimer'             : 'changeClaimer',
				'change #requestContact'             : 'changeContact',
				
				'click #menuSelectPlaceEquipement li': 'changeSelectPlaceEquipment',
				
				'change #requestDetailService'       : 'fillDropdownService',
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
				
				this.model = new RequestModel();
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
		render: function(loader) {

			var self = this;

			// Retrieve the template //
			$.get(app.moduleUrl+"/templates/" + this.templateHTML + ".html", function(templateData){


				var template = _.template(templateData, {
					lang        : app.lang,
					request     : self.model,
					RequestModel: RequestModel,
					loader      : loader
				});

				self.modal.html(template);


				if(!loader){
					$('.make-switch').bootstrapSwitch();

					// Request Claimer //
					app.views.selectListClaimersView = new AdvancedSelectBoxView({el: $('#requestClaimer'), collection: ClaimersCollection.prototype});
					app.views.selectListClaimersView.render();

					// Request Contact //
					app.views.selectListClaimersContactsView = new AdvancedSelectBoxView({el: $('#requestContact'), collection: ClaimersContactsCollection.prototype});
					app.views.selectListClaimersContactsView.render();

					// Fill select Places/Equipments //
					app.views.selectListEquipmentsView = new AdvancedSelectBoxView({el: $("#requestEquipment"), collection: EquipmentsCollection.prototype})
					app.views.selectListEquipmentsView.render();

					app.views.selectListPlacesView = new AdvancedSelectBoxView({el: $('#requestPlace'), collection: PlacesCollection.prototype});
					app.views.selectListPlacesView.render();

					app.views.selectListServicesView = new AdvancedSelectBoxView({el: $('#requestDetailService'), collection: ClaimersServicesCollection.prototype})
					app.views.selectListServicesView.render();

					
					// Set Information about the contact if needed //
					if(!self.model.isNew()){
						if(!self.model.fromCitizen()){
							self.setContactInformation(app.views.selectListClaimersContactsView.getSelectedItem()).done(function(data){
								$('#claimerFunction span').html(data.function);
								$('#claimerPhone span').html(data.phone);
								$('#claimerEmail span').html(data.email);
							})
						}
					}
				}

				self.modal.modal('show');
			});

			return this;
	    },


		
		/** Swith if the resquest is from a citizen or not
		*/
		switchCitizen: function(event, data){

			// Always Fade The claimer Details //
			$('#claimerDetails').fadeOut();

			// From a citizen //
			if(data.value){
				$('.hide-citizen').fadeOut(function(){
					$('.hide-no-citizen').fadeIn();

					app.views.selectListClaimersView.reset();
					app.views.selectListClaimersContactsView.reset();

					$('#requestContactName').focus();
				});
			}
			else{
				$('.hide-no-citizen').fadeOut(function(){
				
					// Reset the form input //
					$('#requestContactName, #requestContactPhone, #requestContactEmail').val('');

					$('.hide-citizen').fadeIn();
				});
			}
		},



		/** When the SelectBox Claimer change
		*/
		changeClaimer: function(reset){
			var self = this;

			// Reset the Claimers et Contact Box view //
			if(reset){
				app.views.selectListClaimersContactsView.reset();
			}

			var claimerId = app.views.selectListClaimersView.getSelectedItem();

			if(!_.isNumber(claimerId)){
				app.views.selectListClaimersContactsView.resetSearchParams();
			}
			else{

				// Set the Contact //
				var searchParam = { field : 'partner_id.id', operator : '=', value : claimerId };
				app.views.selectListClaimersContactsView.setSearchParam(searchParam , true);

				
				// Fetch the organisation to know the Associated place and Service //
				this.organisation = new ClaimerModel({id: claimerId});
				this.organisation.fetch({ data : {fields : ['technical_service_id', 'technical_site_id']} })
					.done(function(data){

						// Set the Associated place of the Claimer //
						if(self.organisation.getTechnicalService()){
							app.views.selectListServicesView.setSelectedItem([self.organisation.getTechnicalService('id'), self.organisation.getTechnicalService()]);
						}

						// Set the Associated Service of the Claimer //
						if(self.organisation.getTechnicalSite()){
							app.views.selectListPlacesView.setSelectedItem([self.organisation.getTechnicalSite('id'), self.organisation.getTechnicalSite()]);
						}
					});
			}
		},



		/** When the SelectBox Contact change
		*/
		changeContact: function(event){
			var self = this;

			var contactId = app.views.selectListClaimersContactsView.getSelectedItem();


			if(!_.isNumber(contactId)){
				$('#claimerDetails').fadeOut();
			}
			else{

				this.setContactInformation(contactId)
					.done(function(data){

						// Set Information about the claimer //
						$('#claimerFunction span').html(data.function);
						$('#claimerPhone span').html(data.phone);
						$('#claimerEmail span').html(data.email);
						app.views.selectListClaimersView.setSelectedItem(data.partner_id);
						self.changeClaimer(false);

						$('#claimerDetails').fadeIn();
					});
			}
		},


		setContactInformation: function(contactId){

			this.contact = new ClaimerContactModel({id: contactId});
			return this.contact.fetch({ data : {fields : ['phone', 'email', 'function', 'partner_id']} });
		},



		/** Swith if the resquest is on a Place or Equipment
		*/
		switchPlaceEquipment: function(event, data){

			// From a citizen //
			if(data.value){
				$('.hide-no-place').fadeOut();
			}
			else{
				$('.hide-no-place').fadeIn();
			}
		},



		/** Save the new request
		*/
		saveRequest: function(e){
			e.preventDefault();

			var self = this;

			// Set the button in loading State //
			$(this.el).find("button[type=submit]").button('loading');


			var params = {
				name        : $('#requestName').val(),
				site1       : app.views.selectListPlacesView.getSelectedItem(),
				service_id  :app.views.selectListServicesView.getSelectedItem(),
				description : $('#requestDescription').val(),
				site_details: $('#requestPlacePrecision').val(),
			};


			// On Place //
			if($('#switchPlaceEquipment').bootstrapSwitch('status')){
				//this.model.setOnEquipment(false, true);
				params.has_equipment = false;
			}
			else{
				/*this.model.setOnEquipment(true, true);
				this.model.setEquipment(app.views.selectListEquipmentsView.getSelectedItem(), true);*/
				params.has_equipment = true;
				params.equipment_id = app.views.selectListEquipmentsView.getSelectedItem();
			}

			// From Citizen //
			if($('#switchCitizen').bootstrapSwitch('status')){
				//this.model.setFromCitizen(true, true);
				params.is_citizen   = true;
				params.people_name  = $('#requestContactName').val();
				params.people_phone = $('#requestContactPhone').val();
				params.people_email = $('#requestContactEmail').val();

				// Set the citizen //
				/*this.model.setCitizenName($('#requestContactName').val(), true);
				this.model.setCitizenPhone($('#requestContactPhone').val(), true);
				this.model.setCitizenEmail($('#requestContactEmail').val(), true);*/
			}
			else{
				//this.model.setFromCitizen(false, true);
				params.is_citizen      = false;
				params.partner_id      = app.views.selectListClaimersView.getSelectedItem();
				params.partner_address = app.views.selectListClaimersContactsView.getSelectedItem();

				// Set the contact //
				/*this.model.setClaimer(app.views.selectListClaimersView.getSelectedItem(), true);
				this.model.setClaimerContact(app.views.selectListClaimersContactsView.getSelectedItem(), true);*/
			}


			this.model.save(params, {patch : true, silent : true})
				.done(function(data) {
					self.modal.modal('hide');

					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : RequestsCollection.prototype.fields} }).done(function(){
							app.views.requestsListView.collection.add(self.model);
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



	});

return ModalRequestView;

});