/******************************************
 * Requests Details View
 */
app.Views.RequestDetailsView = Backbone.View.extend({

		el : '#rowContainer',
		
		templateHTML: 'requestDetails',
		
		places: app.collections.places,
		claimersTypes: app.collections.claimersTypes,
		
		create: false,
		
		// The DOM events //
		events: {
			'submit #formRequest'		: 'saveRequest',
			'click .delete'			: 'deleteRequest',
			'change #requestClaimerType'	: 'fillDropdownClaimerType',
			'change #requestClaimer'	: 'fillDropdownClaimer',
			'change #requestContactSelect'	: 'fillDropdownContact',
		},



		/** View Initialization
		 */
		initialize: function (model, create) {
		    this.model = model;
		    this.create = create;
		    this.render();
	    },



	    /** Display the view
	     */
	    render: function () {
			var self = this;
	
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
	
			self.collection = this.collection;
			// Retrieve the template // 
			$.get("templates/" + this.templateHTML + ".html", function(templateData){
					currentRequest = self.model.toJSON();
					var template = _.template(templateData, {lang: app.lang, request: currentRequest});
					$(self.el).html(template);		     
	
			
					$('#requestDateDeadline').datepicker();
	
					// Fill select ClaimersTypes //
					app.views.selectListClaimersTypesView = new app.Views.DropdownSelectListView({el: $("#requestClaimerType"), collection: app.collections.claimersTypes})
					app.views.selectListClaimersTypesView.clearAll();
					app.views.selectListClaimersTypesView.addEmptyFirst();
					app.views.selectListClaimersTypesView.addAll();
					if( currentRequest.partner_type ) {
						app.views.selectListClaimersTypesView.setSelectedItem( currentRequest.partner_type[0] );
						self.renderClaimer(app.views.selectListClaimersTypesView.getSelected());
						if( currentRequest.partner_id ) {
								app.views.selectListClaimersView.setSelectedItem( currentRequest.partner_id[0] );
								claimer = app.views.selectListClaimersView.getSelected();
								self.renderContact(claimer);
						}	
						if( currentRequest.site1 )
							self.renderTechnicalSite(currentRequest.site1[0]);
						if( currentRequest.service_id )
							self.renderTechnicalService(currentRequest.service_id[0]);						
					}
			});
	
			$(this.el).hide().fadeIn('slow');     
			return this;
	    },


		/** Save the request
		 */
	    saveRequest: function (e) {
		     e.preventDefault();

		     var self = this;
		     
		     var params = {
		    	 partner_type: app.views.selectListClaimersTypesView.getSelected().toJSON().id,
		    	 partner_id: app.views.selectListClaimersView.getSelected().toJSON().id,
		    	 partner_address: app.views.selectListClaimersContactsView.getSelected().toJSON().id,
			     name: this.$('#requestName').val(),
			     description: this.$('#requestDescription').val(),
			     date_deadline: this.$('#requestDateDeadline').val(),
			     service_id: app.views.selectListServicesView.getSelected().toJSON().id,
			     site1: this.$('#requestPlace').val(),
			     site_details: this.$('#requestPlacePrecision').val(),
		     };

		    this.model.save(params,{
				success: function (data) {
					console.log(data);
					if(data.error){
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else{
						//app.collections.requests.get(self.model.id) = self.model;
						//self.render();
						app.router.navigate('#demandes-dinterventions' , true);
						console.log('Success SAVE REQUEST');
					}
				},
				error: function () {
					console.log('ERROR - Unable to save the Request - RequestDetailsView.js');
				},	     
			},this.create);
	    },


		/** Delete the request
		 */
		deleteRequest: function() { 
		 	this.model.destroy({
		 		success: function () {
			//alert('Ask deleted successfully');
		 			window.history.back();
		 		},
		 		error: function () {
		 			console.log('ERROR - Unable to delete the Request - RequestDetailsView.js');
		 		},   
		 	});
			return false;
		},
		
		renderClaimer: function(claimerType) {
			if ( claimerType.attributes.claimers.length != 0) {
	
				$('#requestClaimerBlock').attr('style', 'display:inline');
				app.views.selectListClaimersView = new app.Views.DropdownSelectListView({el: $("#requestClaimer"), collection: claimerType.attributes.claimers});
				app.views.selectListClaimersView.clearAll();
				app.views.selectListClaimersView.addEmptyFirst();
				app.views.selectListClaimersView.addAll();
				
				$('#requestContactInputBlock').attr('style', 'display:none');
				$('#requestContactInput').attr('readonly', 'readonly');
				$('#requestContactPhone').attr('readonly', 'readonly');
				$('#requestContactEmail').attr('readonly', 'readonly');
				$('#requestContactInput').attr('value', '');
				$('#requestContactPhone').attr('value', '');
				$('#requestContactEmail').attr('value', '');
				$('#requestContactSelectBlock').attr('style', 'display:inline');
				$('#requestContactSelect').attr('disabled', 'disabled');
			
			} else {
			
				$('#requestContactInputBlock').attr('style', 'display:inline');
				$('#requestContactInput').removeAttr('readonly');
				$('#requestContactSelectBlock').attr('style', 'display:none');
				
				$('#requestContactPhone').removeAttr('readonly');
				$('#requestContactEmail').removeAttr('readonly');
				
				$('#requestClaimerBlock').attr('style', 'display:none');
				if (app.views.selectListClaimersView) {
					app.views.selectListClaimersView.clearAll();
				}
			}			
		},
		
		renderContact: function(claimer) {
	
	
			if(!app.collections.claimersServices){
				app.collections.claimersServices = new app.Collections.ClaimersServices();
			}
		
			if (claimer.attributes.service_id) {
				$('#requestContactServiceBlock').attr('style', 'display:inline');
				$('#requestContactService').attr('value', claimer.attributes.service_id[1] );
			} else {
				$('#requestContactServiceBlock').attr('style', 'display:none');
				$('#requestContactService').attr('value', '' );
			}

			$('#requestContactPhone').val('');
			$('#requestContactEmail').val('');
		
			app.views.selectListClaimersView.removeOne(0);
			$('#requestContactInputBlock').attr('style', 'display:none');
			$('#requestContactInput').attr('readonly', 'readonly');
			$('#requestContactSelectBlock').attr('style', 'display:inline');
			$('#requestContactSelect').removeAttr('disabled');
			$('#requestContactPhone').removeAttr('readonly');
			$('#requestContactEmail').removeAttr('readonly');
		
			
			
			app.views.selectListClaimersContactsView = new app.Views.DropdownSelectListView(
					{el: $("#requestContactSelect"), collection: claimer.attributes.address})
			app.views.selectListClaimersContactsView.clearAll();
			app.views.selectListClaimersContactsView.addEmptyFirst();
			app.views.selectListClaimersContactsView.addAll();
			contact = claimer.attributes.address.toJSON()[0];
			if( contact ) {
				app.views.selectListClaimersContactsView.setSelectedItem( contact.id );
			}
			
			this.renderContactDetails(contact);
	
		},
		
		renderTechnicalSite: function ( site ) {
	
			// Fill select Places  //
			app.views.selectListPlacesView = new app.Views.DropdownSelectListView({el: $("#requestPlace"), collection: app.collections.places})
			app.views.selectListPlacesView.clearAll();
			app.views.selectListPlacesView.addEmptyFirst();
			app.views.selectListPlacesView.addAll();
			app.views.selectListPlacesView.setSelectedItem( site );
			
		},
		
		renderTechnicalService: function ( service ) {
	
			app.views.selectListServicesView = new app.Views.DropdownSelectListView({el: $("#requestService"), collection: app.collections.claimersServices})
			app.views.selectListServicesView.clearAll();
			app.views.selectListServicesView.addEmptyFirst();
			app.views.selectListServicesView.addAll();
			app.views.selectListServicesView.setSelectedItem( service );

		},
		
		renderContactDetails: function (contact) {
			$('#requestContactPhone').val(contact.phone);
			$('#requestContactEmail').val(contact.email);
		},


		/** Fill the dropdown select list claimer
		 */
		fillDropdownClaimerType: function(){
			 
			$('#requestContactPhone').val('');
			$('#requestContactEmail').val('');

			app.views.selectListClaimersTypesView.removeOne(0);
			$('#requestContactService').attr('value', '' );
			$('#requestContactServiceBlock').attr('style', 'display:none');

			if(!app.collections.claimers){
				app.collections.claimers = new app.Collections.Claimers();
			}

			claimerTypeModel = app.views.selectListClaimersTypesView.getSelected();
			this.renderClaimer(claimerTypeModel);

		 },

		 fillDropdownClaimer: function(){
			 claimer = app.views.selectListClaimersView.getSelected();
			 this.renderContact(claimer);
			 this.renderTechnicalSite(claimer.attributes.technical_site_id[0]);
			 this.renderTechnicalService(claimer.attributes.technical_service_id[0]);
	     },

		 fillDropdownContact: function () {
	    	contact = app.views.selectListClaimersContactsView.getSelected().toJSON();
	    	this.renderContactDetails(contact);
		 }


});

