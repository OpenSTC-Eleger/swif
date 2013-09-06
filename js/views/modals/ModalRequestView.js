/******************************************
 * Requests Details View
 */
app.Views.ModalRequestView = app.Views.GenericModalView.extend({

		templateHTML: 'modals/modalRequest',

		// The DOM events //
		events: function() {
			return _.defaults({
				'submit #formRequest'			: 'saveRequest',
		
				'change #requestClaimerType'	: 'fillDropdownClaimerType',
				'change #requestClaimer'		: 'fillDropdownClaimer',
				'change #requestContactSelect'	: 'fillDropdownContact',
				'change #requestDetailService'	: 'fillDropdownService',
				'click a.linkSelectPlaceEquipment': 'changeSelectPlaceEquipment',
			},
			app.Views.GenericModalView.prototype.events);
			
		},


		/** View Initialization
		*/
		initialize: function () {
			this.create = false;
			if(_.isUndefined(this.model)){
		    	this.model = new app.Models.Request();
		    	this.create = true;
		    }
			this.modal = $(this.el);
			this.render();
	    },



		/** Display the view
		*/
		render: function () {

			// Change the page title depending on the create value //
			if(this.create){
				app.router.setPageTitle(app.lang.viewsTitles.newRequest);
			}
			else{
				app.router.setPageTitle(app.lang.viewsTitles.requestDetail + 'n° ' + this.model.toJSON().id);
				console.log(this.model);
			}

			// Change the active menu item //
			app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

			var self = this;

			// Retrieve the template //
			$.get("templates/" + this.templateHTML + ".html", function(templateData){
				
					var template = _.template(templateData, {
						lang: app.lang,
						request: self.model.toJSON()
					});
					
					self.modal.html(template);
					self.modal.modal('show');
					
					self.selectListServicesView = new app.Views.AdvancedSelectBoxView({el: $('#requestDetailService'), collection: app.Collections.ClaimersServices.prototype})
					self.selectListServicesView.render();
					
					// Fill select Places/Equipments //
					self.selectListPlacesEquipmentsView = new app.Views.AdvancedSelectBoxView({el: $("#requestPlaceEquipment"), collection: app.Collections.Places.prototype})
					self.selectListPlacesEquipmentsView.render();
					
					self.selectListPlaceView = new app.Views.AdvancedSelectBoxView({el:'#requestPlaceIfEquipment', collection: app.Collections.Places.prototype});
					self.selectListPlaceView.render(); 
					
					// Fill select ClaimersTypes //
					self.selectListClaimersTypesView = new app.Views.AdvancedSelectBoxView({el: $('#requestClaimerType'), collection: app.Collections.ClaimersTypes.prototype})
					self.selectListClaimersTypesView.render();
					
					self.selectListClaimersView = new app.Views.AdvancedSelectBoxView({el: $('#requestClaimer'), collection: app.Collections.Claimers.prototype});
					self.selectListClaimersView.render();
					
					self.selectListClaimersContactsView = new app.Views.AdvancedSelectBoxView({el: $('#requestContactSelect'), collection: app.Collections.ClaimersContacts.prototype});
					self.selectListClaimersContactsView.render();
					
					self.resetBoxes();
					
//					if( !self.create ) {
//						currentRequest = self.model.toJSON();
//						self.selectListClaimersTypesView.setSelectedItem( currentRequest.partner_type[0] );
//						self.renderClaimer(self.selectListClaimersTypesView.getSelected(), true);
//						if( currentRequest.service_id ) {
//							self.renderTechnicalService(currentRequest.service_id[0]);
//						}
//						else
//							self.renderTechnicalService(null);
//						if( currentRequest.site1 )
//							self.renderTechnicalSite(currentRequest.site1[0]);
//						else
//							self.renderTechnicalSite(null);
//					}


					// Check if the user has a user claimer //
					
//					var officer = app.models.user;
//					var officerJSON = officer.toJSON();
//					if(!_.isEmpty(officerJSON.contact_id)){
//						$('#requestClaimerType, #requestClaimer').prop('disabled', true);
//						$('#requestClaimerBlock, #requestContactSelectBlock').show();
//
//						// Get the claimer //
//						var userClaimer = app.collections.claimers.get(officerJSON.contact_id[0].partner_id[0]);
//
//						// Get the claimer Type //
//						var userClaimerType = userClaimer.getClaimerType();
//
//						// Set the claimer and the claimer Type in the select Box //
//						self.selectListClaimersTypesView.setSelectedItem(userClaimerType[0]);
//						self.selectListClaimersView.setSelectedItem(officerJSON.contact_id[0].partner_id[0]);
//						self.renderContact( self.selectListClaimersView.getSelected(), null );
//						self.selectListClaimersContactsView.setSelectedItem( officerJSON.contact_id[0].id );
//						$('#requestContactSelect').prop('disabled', false);
//						$('#requestContactInput, #requestContactPhone, #requestContactEmail').prop('readonly', false);
//						self.renderContactDetails(contact);
//						
//						self.renderTechnicalService(userClaimer.toJSON().technical_service_id[0]);
//						self.renderTechnicalSite(userClaimer.toJSON().technical_site_id[0]);
//						self.renderContactDetails(officerJSON.contact_id[0])
//					}

			});
	
			$(this.el).hide().fadeIn('slow'); 
			return this;
	    },
	    


		/** Save the request
		*/
	    saveRequest: function (e) {
		     
	    	e.preventDefault();
	    	var self = this;
		     partner_address_id = null;
		     contact_name = null;
		     contact_phone = null;
		     contact_email = null;
		     
		     input_partner_address_id = null;
		     if( self.selectListClaimersContactsView != null && self.selectListClaimersContactsView.getSelected()!=null )
		    	 input_partner_address_id = self.selectListClaimersContactsView.getSelected().toJSON().id;
//		     else {
//		    	 input_contact_name = this.$('#requestContactInput').val();
//		    	 input_contact_phone = this.$('#requestContactPhone').val()
//		    	 input_contact_email = this.$('#requestContactEmail').val();
//		     }
		     input_partner_type = null;
		     if ( self.selectListClaimersTypesView && self.selectListClaimersTypesView.getSelected()!= null )
		    	 input_partner_type =  self.selectListClaimersTypesView.getSelected().toJSON().id;
		    	
		     input_partner_id = null;
		     if ( self.selectListClaimersView && self.selectListClaimersView.getSelected()!=null )
		    	 input_partner_id = self.selectListClaimersView.getSelected().toJSON().id;
		     
		     input_service_id = null;
		     if ( self.selectListServicesView && self.selectListServicesView.getSelected()!=null )
		    	 input_service_id = self.selectListServicesView.getSelected().toJSON().id;
		     
		     var params = {
		    	 partner_type: input_partner_type,
		    	 email_text: app.Models.Request.status.wait.translation,
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

						//self.model.set({id:data.result.result});
						app.router.navigate(app.routes.requestsInterventions.baseUrl, true);
						console.log('Success SAVE REQUEST');
					}
				},
				error: function () {
					console.log('ERROR - Unable to save the Request - RequestView.js');
				},	     
			});
	    },

	    //when clicking on site or equipment select filter, update selectBox collection if data-item change
	    changeSelectPlaceEquipment: function(e){
	    	e.preventDefault();
	    	var link = $(e.target);
	    	var item = '';
	    	if(link.is('a')){item = link.data('item')}
	    	else{item = link.parent('a').data('item')}
	    	
	    	var itemSelectedBefore = $('#btnSelectPlaceEquipment').data('item');
	    	//if user wants to change type of collection, we update selectBox, else, do nothing
	    	if(item != itemSelectedBefore){
	    		//if user wants to switch to equipment, we display place selectBox too, else, we hide it
	    		this.displaySiteIfEquipment(item != 'place');
	    		//get parameters of the select2 to keep trace of its state
	    		var collection = null;
	    		var searchParams = this.selectListPlacesEquipmentsView.searchParams;
	    		var el = this.selectListPlacesEquipmentsView.el;
	    		if(item == 'place'){
	    			$('#requestPlaceEquipment').attr('data-placeholder',app.lang.actions.selectAPlaceShort);
	    			collection = app.Collections.Places.prototype;
	    			$('#btnSelectPlaceEquipment').data('item', 'place');
	    			$('#btnSelectPlaceEquipment').find('.iconItem').removeClass('icon-wrench');
	    			$('#btnSelectPlaceEquipment').find('.iconItem').addClass('icon-map-marker');
	    		}
	    		else{
	    			$('#requestPlaceEquipment').attr('data-placeholder',app.lang.actions.selectAnEquipmentShort);
	    			collection = app.Collections.Equipments.prototype;	    			
	    			$('#btnSelectPlaceEquipment').data('item', 'equipment');
	    			$('#btnSelectPlaceEquipment').find('.iconItem').removeClass('icon-map-marker');
	    			$('#btnSelectPlaceEquipment').find('.iconItem').addClass('icon-wrench');
	    		}
	    		this.selectListPlacesEquipmentsView.reset();
	    		this.selectListPlacesEquipmentsView = new app.Views.AdvancedSelectBoxView({el:el, collection:collection});
    			this.selectListPlacesEquipmentsView.resetSearchParams();
    			_.each(searchParams,function(filter,i){
    				this.selectListPlacesEquipmentsView.setSearchParam(filter);
    			});
    			this.selectListPlacesEquipmentsView.render();
	    	}
	    },
	    
	    
	    /**
	     * used to initialize boxes or to reset them to their init state
	     */
	    resetBoxes: function(){
	    	//reset claimer service infos
			$('#requestContactService').attr('value', '');
			$('#requestContactService').prop('readonly', true);
			$('#requestContactServiceBlock').hide();
			
			//reset claimer contact infos
			$('#requestContactInput, #requestContactPhone, #requestContactEmail').prop('readonly', true);
			$('#requestContactInputBlock').css({display:'inline-block'});
			$('#requestContactInput, #requestContactPhone, #requestContactEmail').val('');
			
			//reset claimer infos
			this.selectListClaimersView.reset();
			this.selectListClaimersContactsView.reset();
			$('#requestContactSelectBlock').css({display:'none'});
			$('#requestClaimerBlock').css({display:'none'});
			
			//reset placeIfEquipment
			this.selectListPlaceView.reset();
			this.selectListPlaceView.resetSearchParams();
			$('#requestPlaceIfEquipmentBlock').css({display: 'none'});
	    },
	    
	    /**
	     * used to remove readonly attribute to claimer infos text inputs
	     */
	    unlockClaimerInfos: function(){
			$('#requestContactInput, #requestContactPhone, #requestContactEmail').prop('readonly', false);
	    },
	    
	    displaySiteIfEquipment: function(display){
	    	if(display){
	    		this.selectListPlaceView.reset();
	    		$('#requestPlaceIfEquipmentBlock').css({display:'block'});
	    	}
	    	else{
	    		$('#requestPlaceIfEquipmentBlock').css({display:'none'});
	    	}
	    },
	    
	    /**
	     * used to display or not claimer selectBox (according to 'display' bool parameter)
	     * if display: display claimerContact selectBox too and hide text input
	     * else: display claimerContact text input and hide selectBox
	     */
	    displayClaimerSelect: function(display){

	    	if(display){
	    		$('#requestClaimerBlock').show();
	    		$('#requestContactSelectBlock').show();
	    		$('#requestContactInputBlock').val('');
	    		$('#requestContactInputBlock').hide();
	    	}
	    	else{
	    		this.selectListClaimersContactsView.reset();
	    		$('#requestContactSelectBlock').hide();
	    		this.selectListClaimersView.reset();
	    		$('#requestClaimerBlock').hide();
	    		$('#requestContactInputBlock').show();
	    	}
	    },
	    
	    /**
	     * used to display or not claimer service infos (accordng to 'display' parameter)
	     * if display: filter patrimony with esrvice_id
	     * else: remove service_id filter from patrimony list (assuming that it's the only one filter)
	     */
	    displayClaimerServiceSelect: function(display){
	    	if(display){
	    		$('#requestContactServiceBlock').show();
	    		$('#requestContactService').show();
	    		//@TODO: apply filter to patrimonyList
	    	}
	    	else{
	    		$('#requestContactServiceBlock').val('');
	    		$('#requestContactServiceBlock').hide();
	    		$('#requestContactService').val('');
	    		$('#requestContactService').hide();
	    	}
	    },
	    
		/** Fill the dropdown select list claimer
		 * if partner type is reset by user, put boxes to their initial state
		 * else, remove readonly attribute from claimer infos (name, mail, phone)
		 * and if partner type has claimers associated, 
		 * display selectBox for claimers and claimersContact instead of text input
		 */
		fillDropdownClaimerType: function(e){
			e.preventDefault();
			var self = this;
			var value = this.selectListClaimersTypesView.getSelectedItem();
			if(value != '' && value > 0){
				var claimerType = new app.Models.ClaimerType();
				claimerType.setId(value);
				claimerType.fetch().done(function(){
					var claimerTypeJSON = claimerType.toJSON();
					self.displayClaimerSelect(claimerTypeJSON.claimers.length > 0);
			    	self.selectListClaimersView.reset();
			    	self.fillDropdownClaimer(e);
					
					self.selectListClaimersView.setSearchParam({fields:'type_id.id',operator:'=', value:value},true);
				});
				this.unlockClaimerInfos();

			}
			else{
				this.resetBoxes();
			}
		 },

		/**
		 * if partner is filled by user: filter contact selectBox with partner_id 
		 * 		and if partner has service_id: display it in readonly selectBox and filter patrimony selectBox
		 * else: remove filters from contact selectBox and patrimony selectBox  and hide service_id selectBox infos
		 */
		fillDropdownClaimer: function(e){
			 e.preventDefault();
			 var self = this;
			  var value = this.selectListClaimersView.getSelectedItem();
			 if(value != '' && value > 0){
				 var claimer = new app.Models.Claimer();
				 claimer.setId(value);
				 claimer.fetch({data:{fields:['name','address','service_id']}}).done(function(){
					var claimerJSON = claimer.toJSON();
					 //if partner has addresses, display first one in contact list
					 if(claimerJSON.address.length > 0){
						 var address = new app.Models.ClaimerContact();
						 address.set('id',claimerJSON.address[0]);
						 address.fetch({data:{fields:['name']}}).done(function(){
							 self.selectListClaimersContactsView.setSelectedItem([address.toJSON().id, address.toJSON().name]);
							 self.fillDropdownContact(e);
						 });
						 
					 }
					 //if partner has service_id, display it in box and apply filter on patirmonyList
					 if(claimerJSON.service_id){
						 self.displayClaimerServiceSelect(true);
						 $('#requestContactService').val(claimerJSON.service_id[1]);
					 }
					 else{
						 self.displayClaimerServiceSelect(false);
					 }
				 });
				 self.selectListClaimersContactsView.setSearchParam({field:'partner_id.id',operator:'=',value:value},true)
			 }
			 else{
				 this.displayClaimerServiceSelect(false);
				 this.selectListClaimersContactsView.reset();
				 this.fillDropdownContact(e);
			 }
		},

		/**
		 * if user reset contact value: reset the claimer infos
		 * else: bubble claimer contact infos to text inputs
		 */
		fillDropdownContact: function(e) {
			e.preventDefault();
			value = this.selectListClaimersContactsView.getSelectedItem();
			if(value != '' && value > 0){
				var address = new app.Models.ClaimerContact();
				address.set('id',value);
				address.fetch({data:{fields:['name','phone','email']}}).done(function(){
					$('#requestContactPhone').val(address.toJSON().phone.toString());
					$('#requestContactEmail').val(address.toJSON().email);
				});
			}
			else{
				$('#requestContactInput, #requestContactPhone, #requestContactEmail').val('');
			}
		},
		 
		fillDropdownService: function(e){
			e.preventDefault();
			$('#requestPlace').val('');
			this.renderTechnicalService( _($(e.target).prop('value')).toNumber() )
		},

});