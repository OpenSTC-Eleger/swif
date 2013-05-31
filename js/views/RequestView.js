/******************************************
 * Requests Details View
 */
app.Views.RequestView = Backbone.View.extend({

		el : '#rowContainer',

		templateHTML: 'requestDetails',

		places: app.collections.places,

		claimersTypes: app.collections.claimersTypes,

		create: false,

		// The DOM events //
		events: {
			'submit #formRequest'			: 'saveRequest',

			'change #requestClaimerType'	: 'fillDropdownClaimerType',
			'change #requestClaimer'		: 'fillDropdownClaimer',
			'change #requestContactSelect'	: 'fillDropdownContact',
			'change #requestDetailService'	: 'fillDropdownService',
		},



		/** View Initialization
		*/
		initialize: function (model, create) {
		    this.model = model;
		    this.create = create;
	    },



		/** Display the view
		*/
		render: function () {

			// Change the page title depending on the create value //
			if(this.create){
				app.router.setPageTitle(app.lang.viewsTitles.newRequest);
			}
			else{
				app.router.setPageTitle(app.lang.viewsTitles.requestDetail + 'n° ' + this.model.id);
				console.debug(this.model);
			}

			// Change the active menu item //
			app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);


			var self = this;

			// Retrieve the template //
			$.get("templates/" + this.templateHTML + ".html", function(templateData){
				
					var template = _.template(templateData, {
						create: self.create,
						lang: app.lang,
						request: self.model.toJSON(),
						requestsState: app.Models.Request.state
					});
					
					$(self.el).html(template);



					//search no technical services
					var noTechnicalServices = _.filter(app.collections.claimersServices.models, function(service){
						return service.attributes.technical != true 
					});

					//remove no technical services
					app.collections.claimersServices.remove(noTechnicalServices);
					
					app.views.selectListServicesView = new app.Views.DropdownSelectListView({el: $('#requestDetailService'), collection: app.collections.claimersServices})
					app.views.selectListServicesView.clearAll();
					app.views.selectListServicesView.addEmptyFirst();
					app.views.selectListServicesView.addAll();
					

					// Fill select Places  //
					app.views.selectListPlacesView = new app.Views.DropdownSelectListView({el: $("#requestPlace"), collection: app.collections.places})
					app.views.selectListPlacesView.clearAll();
					app.views.selectListPlacesView.addEmptyFirst();
					app.views.selectListPlacesView.addAll();
	
					// Fill select ClaimersTypes //
					app.views.selectListClaimersTypesView = new app.Views.DropdownSelectListView({el: $('#requestClaimerType'), collection: app.collections.claimersTypes})
					app.views.selectListClaimersTypesView.clearAll();
					app.views.selectListClaimersTypesView.addEmptyFirst();
					app.views.selectListClaimersTypesView.addAll();
					
					app.views.selectListClaimersView = new app.Views.DropdownSelectListView({el: $('#requestClaimer'), collection: app.collections.claimers});
					app.views.selectListClaimersView.clearAll();
					app.views.selectListClaimersView.addEmptyFirst();
					app.views.selectListClaimersView.addAll();

					currentRequest = self.model.toJSON()
					if( currentRequest.partner_type ) {
						app.views.selectListClaimersTypesView.setSelectedItem( currentRequest.partner_type[0] );
						self.renderClaimer(app.views.selectListClaimersTypesView.getSelected(), true);
						if( currentRequest.service_id ) {
							self.renderTechnicalService(currentRequest.service_id[0]);
						}
						else
							self.renderTechnicalService(null);
						if( currentRequest.site1 )
							self.renderTechnicalSite(currentRequest.site1[0]);
						else
							self.renderTechnicalSite(null);
					}


					console.log('Contact of the user:');
					// Check if the user has a user claimer //

					console.log(app.collections.officers.get(app.models.user.getUID()));
					
					var officer = app.collections.officers.get(app.models.user.getUID());
					var officerJSON = officer.toJSON();
					if(!_.isEmpty(officerJSON.contact_id)){
						$('#requestClaimerType, #requestClaimer').prop('disabled', true);
						$('#requestClaimerBlock, #requestContactSelectBlock').show();
						
						// Get the claimer //
						var userClaimer = app.collections.claimers.get(officerJSON.contact_id[0].partner_id[0]);

						// Get the claimer Type //
						var userClaimerType = userClaimer.getClaimerType();

						// Set the claimer and the claimer Type in the select Box //
						app.views.selectListClaimersTypesView.setSelectedItem(userClaimerType[0]);
						app.views.selectListClaimersView.setSelectedItem(officerJSON.contact_id[0].partner_id[0]);
						self.renderContact( app.views.selectListClaimersView.getSelected() );
						app.views.selectListClaimersContactsView.setSelectedItem( officerJSON.contact_id[0].id );
						$('#requestContactSelect').removeProp('disabled');
						$('#requestContactInput, #requestContactPhone, #requestContactEmail').removeProp('readonly');						
						self.renderContactDetails(contact);						
						
						self.renderTechnicalService(userClaimer.toJSON().technical_service_id[0]);						
						self.renderTechnicalSite(userClaimer.toJSON().technical_site_id[0]);						
						self.renderContactDetails(officerJSON.contact_id[0])
					}

			});
	
			$(this.el).hide().fadeIn('slow'); 
			return this;
	    },
	    


		/** Save the request
		*/
	    saveRequest: function (e) {
		     
	    	e.preventDefault();
		    	     
		     partner_address_id = null;
		     contact_name = null;
		     contact_phone = null;
		     contact_email = null;
		     
		     input_partner_address_id = null;
		     if( app.views.selectListClaimersContactsView != null && app.views.selectListClaimersContactsView.getSelected()!=null )
		    	 input_partner_address_id = app.views.selectListClaimersContactsView.getSelected().toJSON().id;
//		     else {
//		    	 input_contact_name = this.$('#requestContactInput').val();
//		    	 input_contact_phone = this.$('#requestContactPhone').val()
//		    	 input_contact_email = this.$('#requestContactEmail').val();
//		     }
		     input_partner_type = null;
		     if ( app.views.selectListClaimersTypesView && app.views.selectListClaimersTypesView.getSelected()!= null )
		    	 input_partner_type =  app.views.selectListClaimersTypesView.getSelected().toJSON().id;
		    	
		     input_partner_id = null;
		     if ( app.views.selectListClaimersView && app.views.selectListClaimersView.getSelected()!=null )
		    	 input_partner_id = app.views.selectListClaimersView.getSelected().toJSON().id;
		     
		     input_service_id = null;
		     if ( app.views.selectListServicesView && app.views.selectListServicesView.getSelected()!=null )
		    	 input_service_id = app.views.selectListServicesView.getSelected().toJSON().id;
		     
		     var params = {
		    	 partner_type: input_partner_type,
		    	 email_text: app.Models.Request.state[0].traduction,
		    	 partner_id: input_partner_id,
		    	 partner_address: input_partner_address_id,
		    	 people_name: this.$('#requestContactInput').val(),
		    	 people_phone: this.$('#requestContactPhone').val(),
		    	 people_email: this.$('#requestContactEmail').val(),	
			     name: this.$('#requestName').val(),
			     description: this.$('#requestDescription').val(),
			     service_id: input_service_id,
			     site1: this.$('#requestPlace').val(),
			     site_details: this.$('#requestPlacePrecision').val(),
		     };

		    var self = this;
		     
		    this.model.save(params,{
				success: function (data) {
					console.log(data);
					if(data.error){
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else{

						self.model.set({id:data.result.result});
						//self.model.sendEmail(null);
						app.router.navigate('#' , true);
						console.log('Success SAVE REQUEST');
					}
				},
				error: function () {
					console.log('ERROR - Unable to save the Request - RequestView.js');
				},	     
			});
	    },


		
		renderClaimer: function(claimerType, firstInit) {
			// Reset Form //
			$('#requestContactSelect, #requestContactInput, #requestContactPhone, #requestContactEmail, #requestDetailService, #requestPlace').val('');
			
			if ( claimerType.attributes.claimers.length != 0) {
	
				$('#requestClaimerBlock, #requestContactSelectBlock').show();
				$('#requestContactInputBlock').hide();


				//var collection = this.getCollectionOrdered(claimerType.attributes.claimers);

				var collection = claimerType.attributes.claimers; 
				collection.comparator = function(model){
					return model.get('name');
				};
				
				app.views.selectListClaimersView = new app.Views.DropdownSelectListView({el: $('#requestClaimer'), collection: collection});
				app.views.selectListClaimersView.clearAll();
				app.views.selectListClaimersView.addEmptyFirst();
				app.views.selectListClaimersView.addAll();
				currentRequest = this.model.toJSON();


				if( currentRequest.partner_id && firstInit) {
					if( app.views.selectListClaimersView.hasId(currentRequest.partner_id[0]) ) {
						app.views.selectListClaimersView.setSelectedItem(currentRequest.partner_id[0]);
						this.renderContact( app.views.selectListClaimersView.getSelected() );
						$('#requestContactSelect').removeProp('disabled');
						$('#requestContactInput, #requestContactPhone, #requestContactEmail').removeProp('readonly');
					}
				}
				else {
					$('#requestContactSelect').prop('disabled', true);
					$('#requestContactInput, #requestContactPhone, #requestContactEmail').prop('readonly', true);
				}
			
			} else {
				
			
				$('#requestContactInputBlock').show();
				$('#requestContactSelectBlock').hide();

				$('#requestContactInput').removeProp('readonly');
				$('#requestContactPhone, #requestContactEmail').removeProp('readonly');
				
				$('#requestClaimerBlock').hide();
				if (app.views.selectListClaimersView) {
					app.views.selectListClaimersView.clearAll();
				}
				
				currentRequest.people_name==false?$('#requestContactInput').val(''):$('#requestContactInput').val(currentRequest.people_name);
				currentRequest.people_phone==false?$('#requestContactPhone').val(''):$('#requestContactPhone').val(currentRequest.people_phone);
				currentRequest.people_email==false?$('#requestContactEmail').val(''):$('#requestContactEmail').val(currentRequest.people_email);
			}
		},


		
		renderContact: function(claimer) {
	
	
			if(!app.collections.claimersServices){
				app.collections.claimersServices = new app.Collections.ClaimersServices();
			}
		
			if (claimer.attributes.service_id) {
				$('#requestContactServiceBlock').show();
				$('#requestContactService').attr('value', claimer.attributes.service_id[1] );
			} else {
				$('#requestContactServiceBlock').hide();
				$('#requestContactService').attr('value', '');
			}

			$('#requestContactPhone, #requestContactEmail').val('');
		
			app.views.selectListClaimersView.removeOne(0);
			$('#requestContactInputBlock').hide();
			$('#requestContactSelectBlock').show();

			$('#requestContactInput').prop('readonly', true);
			$('#requestContactSelect').removeProp('disabled');
			$('#requestContactPhone, #requestContactEmail').removeProp('readonly');
		
			
			//var collection = this.getCollectionOrdered(claimer.attributes.address);

			var collection = claimer.attributes.address; 
			collection.comparator = function(model){
				return model.get('name');
			};
			app.views.selectListClaimersContactsView = new app.Views.DropdownSelectListView(
					{el: $('#requestContactSelect'), collection: collection})
			app.views.selectListClaimersContactsView.clearAll();
			app.views.selectListClaimersContactsView.addEmptyFirst();
			app.views.selectListClaimersContactsView.addAll();
			contacts = claimer.attributes.address!=null?claimer.attributes.address.toJSON():null;
			if( contacts && contacts.length>0 ) {
				app.views.selectListClaimersContactsView.setSelectedItem( contacts[0].id );
				this.renderContactDetails(contacts[0]);
			}			
	
		},


		
		renderTechnicalSite: function(site) {
			if( site!=null )
				app.views.selectListPlacesView.setSelectedItem( site );			
		},


		
		renderTechnicalService: function ( service ) {
			if( service!= null ) {
				app.views.selectListServicesView.setSelectedItem( service );
				places = app.collections.places.models;
				
				// Keep only places belongs to service selected //
				keepedPlaces = _.filter(places, function(item){ 
					var placeJSON = item.toJSON();
					var placeServices = placeJSON.service_ids;	
					var placeServices = [];
					_.each( item.attributes.service_ids.models, function(s){
						placeServices.push( s.toJSON().id );
					});				
					return $.inArray(service, placeServices)!=-1
				});
				app.views.selectListPlacesView.collection = new app.Collections.Places(keepedPlaces);
				app.views.selectListPlacesView.clearAll();
				app.views.selectListPlacesView.addEmptyFirst();
				app.views.selectListPlacesView.addAll();
			}
		},
		


		renderContactDetails: function (contact) {
			$('#requestContactPhone').val('');
			$('#requestContactEmail').val('');
			if( contact ) {
				$('#requestContactPhone').val(contact.phone);
				$('#requestContactEmail').val(contact.email);
			}
		},



		/** Fill the dropdown select list claimer
		 */
		fillDropdownClaimerType: function(e){
			 e.preventDefault();
			 
			$('#requestContactPhone, #requestContactEmail').val('');

			app.views.selectListClaimersTypesView.removeOne(0);
			$('#requestContactService').attr('value', '');
			$('#requestContactServiceBlock').hide();

			if(!app.collections.claimers){
				app.collections.claimers = new app.Collections.Claimers();
			}

			claimerTypeModel = app.views.selectListClaimersTypesView.getSelected();
			this.renderClaimer(claimerTypeModel);

		 },



		fillDropdownClaimer: function(e){
			 e.preventDefault();
			 claimer = app.views.selectListClaimersView.getSelected();
			 this.renderContact(claimer);
			if (claimer.attributes.technical_service_id )
				 this.renderTechnicalService(claimer.attributes.technical_service_id[0]);
			if (claimer.attributes.technical_site_id )
				 this.renderTechnicalSite(claimer.attributes.technical_site_id[0]);

		},



		fillDropdownContact: function(e) {
			e.preventDefault();
			if( app.views.selectListClaimersContactsView.getSelected() != null ) {
				contact = app.views.selectListClaimersContactsView.getSelected().toJSON();
				this.renderContactDetails(contact);
			}
			else{
				this.renderContactDetails(null);
			}
		},
		 
		

		fillDropdownService: function(e){
			e.preventDefault();
			$('#requestPlace').val('');
			this.renderTechnicalService( _($(e.target).prop('value')).toNumber() )
		},

});

