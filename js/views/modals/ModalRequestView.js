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
//				'click #modalTabs a'			: 'displayTab'
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
				if(!self.create){
					var currentRequest = self.model.toJSON();
					
					//fill partner_type value and launch 'onchange' treatment
					self.selectListClaimersTypesView.setSelectedItem(currentRequest.partner_type);
					self.setDropdownClaimerType(currentRequest.partner_type[0]).done(function(){
						//fill partner value and launch 'onchange' treatment
						var deferred = $.Deferred();
						if(currentRequest.partner_id != false){
							self.selectListClaimersView.setSelectedItem(currentRequest.partner_id);
							deferred = self.setDropdownClaimer(currentRequest.partner_id[0]);
						}
						else{
							deferred.resolve();
						}
						deferred.done(function(){
							//fill contact value and launch 'onchange' treatment
							if(currentRequest.partner_address != false){
								self.selectListClaimersContactsView.setSelectedItem(currentRequest.partner_address);
								self.fillDropdownContact(null);
							}
							//if no contact is stored in db, means that there is a people_name
							else{
								$('#requestContactInput').val(currentRequest.people_name);
							}
											
							//fill service_id
							self.selectListServicesView.setSelectedItem(currentRequest.service_id);
							
							//fill the place/equipment select2 and dropdown button according to has_equipment
							if(currentRequest.has_equipment){
								self.setSelectPlaceEquipment('equipment');
								self.selectListPlaceView.setSelectedItem(currentRequest.site1);
								self.selectListPlacesEquipmentsView.setSelectedItem(currentRequest.equipment_id);
							}
							else{
								self.setSelectPlaceEquipment('place');
								self.selectListPlacesEquipmentsView.setSelectedItem(currentRequest.site1);
							}
						});
					});
				}
			});
	
			$(this.el).hide().fadeIn('slow'); 
			return this;
	    },

//	    displayTab: function(e){
//	    	e.preventDefault();
//	    	console.log($(e.target));
//	    	$(e.target).tab('show');
//	    },
	    
		/** Save the request
		*/
	    saveRequest: function (e) {
	    	//private function used to check data: if no value, return false
		    function evalField(fieldValue){
		    	if(fieldValue == '' || _.isUndefined(fieldValue) || fieldValue == null){
		    		return false;
		    	}
		    	return fieldValue;
		    }
		    
	    	e.preventDefault();
	    	var self = this;

		    var params = {
		    	 partner_type: evalField(this.selectListClaimersTypesView.getSelectedItem()),
		    	 email_text: app.Models.Request.status.wait.translation,
		    	 partner_id: evalField(this.selectListClaimersView.getSelectedItem()),
		    	 partner_address: evalField(this.selectListClaimersContactsView.getSelectedItem()),
		    	 people_name: this.$('#requestContactInput').val(),
		    	 people_phone: this.$('#requestContactPhone').val(),
		    	 people_email: this.$('#requestContactEmail').val(),	
			     name: this.$('#requestName').val(),
			     description: this.$('#requestDescription').val(),
			     service_id: evalField(this.selectListServicesView.getSelectedItem()),
			     site_details: this.$('#requestPlacePrecision').val(),
		    };
		    
		    //adapt data mapping if intervention according that intervention belongs to a place or an equipment
		    if($('#btnSelectPlaceEquipment').data('item') == 'place'){
		    	params.site1 = evalField(this.selectListPlacesEquipmentsView.getSelectedItem());
		    	params.has_equipment = false;
	    	}
	    	else{
	    		params.site1 = evalField(this.selectListPlaceView.getSelectedItem()); 
	    		params.equipment_id = evalField(this.selectListPlacesEquipmentsView.getSelectedItem());
	    		params.has_equipment = true;
	    	}
	    	
		    var self = this;
		     
		    this.model.save(params, {patch:!self.create, silent: true, wait:true}).done(function (data) {
	    		if(self.create){
					self.model.set('id', data, {silent:true});
				}
	    		//get all data of the current model (newly created or updated) and apply changes on the collection
	    		//we 'merge' the model on the collection if it's an update, else it's a basic 'add'
	    		self.model.fetch().done(function(){
	    			self.modal.modal('hide');
	    			self.options.requests.add(self.model, {merge: !self.create});
	    		});
				console.log('Success SAVE REQUEST');
			})
			.fail(function (e) {
				app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				console.log(e);
			});
	    },

	    //when clicking on site or equipment select filter, update selectBox collection if data-item change
	    setSelectPlaceEquipment: function(item){
	    	var itemSelectedBefore = $('#btnSelectPlaceEquipment').data('item');
	    	//if user wants to change type of collection, we update selectBox, else, do nothing
	    	if(item != itemSelectedBefore){
	    		//if user wants to switch to equipment, we display place selectBox too, else, we hide it
	    		this.displaySiteIfEquipment(item != 'place');
	    		//get parameters of the select2 to keep trace of its state
	    		var collection = null;
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
	    		this.selectListPlacesEquipmentsView = new app.Views.AdvancedSelectBoxView({el:el, collection:collection});
    			this.setParamOnSitesEquipments(null);
    			this.selectListPlacesEquipmentsView.render();
	    	}
	    },
	    
	    changeSelectPlaceEquipment: function(e){
	    	if(e != null){
	    		e.preventDefault();
	    	}
	    	var link = $(e.target);
	    	var item = '';
	    	if(link.is('a')){item = link.data('item')}
	    	else{item = link.parent('a').data('item')}
	    	this.setSelectPlaceEquipment(item);
	    },
	    
	    
	    /**
	     * used to initialize boxes or to reset them to their init state
	     */
	    resetBoxes: function(){
	    	//reset claimer service infos
			$('#requestContactService').attr('value', '');
			$('#requestContactService').data('id', '');
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
	    		$('#requestClaimer').prop('required','required');
	    		$('#requestContactSelectBlock').show();
	    		$('#requestContactSelectBlock').prop('required','required');
	    		$('#requestContactInputBlock').val('');
	    		$('#requestContactInputBlock').hide();
	    	}
	    	else{
	    		this.selectListClaimersContactsView.reset();
	    		$('#requestContactSelectBlock').hide();
	    		$('#requestContactSelectBlock').removeAttr('required');
	    		this.selectListClaimersView.reset();
	    		$('#requestClaimerBlock').hide();
	    		$('#requestClaimer').removeAttr('required');
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
	    		$('#requestContactService').data('id','');
	    	}
	    },
	    
	    /**
	     * Used to update filter of 'places/equipments' select2, reset value and last filters
	     */
	    setParamOnSitesEquipments: function(service_id){
	    	if(service_id == null){
	    		service_id = $('#requestContactService').data('id');
	    	}
	    	this.selectListPlacesEquipmentsView.reset();
	    	this.selectListPlacesEquipmentsView.resetSearchParams();
	    	if(service_id != '' && service_id){
	    		this.selectListPlacesEquipmentsView.setSearchParam({field:'service_ids.id', operator:'=', value:service_id});
	    	}
	    	//if it's an equipment, check too if boolean 'internal_user' is True
	    	if($("#btnSelectPlaceEquipment").data('item') == 'equipment'){
	    		this.selectListPlacesEquipmentsView.setSearchParam({field:'internal_use', operator:'=', value:true});
	    	}
	    },
	    
		/** Fill the dropdown select list claimer
		 * if partner type is reset by user, put boxes to their initial state
		 * else, remove readonly attribute from claimer infos (name, mail, phone)
		 * and if partner type has claimers associated, 
		 * display selectBox for claimers and claimersContact instead of text input
		 */
	    
	    setDropdownClaimerType: function(value){
	    	var self = this;
	    	var deferred = $.Deferred();
			if(value != '' && value > 0){
				var claimerType = new app.Models.ClaimerType();
				claimerType.setId(value);
				claimerType.fetch().done(function(){
					var claimerTypeJSON = claimerType.toJSON();
					self.displayClaimerSelect(claimerTypeJSON.claimers.length > 0);
			    	self.selectListClaimersView.reset();
			    	self.setDropdownClaimer(0);
			    	deferred.resolve();
				});
				this.selectListClaimersView.setSearchParam({fields:'type_id.id',operator:'=', value:value},true);
				
				this.unlockClaimerInfos();

			}
			else{
				this.resetBoxes();
				deferred.resolve();
			}
			return deferred;
	    },
	    
		fillDropdownClaimerType: function(e){
			if(e!=null){
				e.preventDefault();
			}
			var self = this;
			var value = this.selectListClaimersTypesView.getSelectedItem();
			this.setDropdownClaimerType(value);

		 },

		/**
		 * if partner is filled by user: filter contact selectBox with partner_id 
		 * 		and if partner has service_id: display it in readonly selectBox and filter patrimony selectBox
		 * else: remove filters from contact selectBox and patrimony selectBox  and hide service_id selectBox infos
		 */
		 setDropdownClaimer: function(value){
			 var self = this;
			 var deferred = $.Deferred();
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
							self.setDropdownContact(address.toJSON().id);
							deferred.resolve();
						});
						 
					}
					else{
						deferred.resolve();
					}
					 //if partner has service_id, display it in box and apply filter on patirmonyList
					if(claimerJSON.service_id){
						self.displayClaimerServiceSelect(true);
						$('#requestContactService').val(claimerJSON.service_id[1]);
						$('#requestContactService').data('id', claimerJSON.service_id[0]);
						
						self.setParamOnSitesEquipments(claimerJSON.service_id[0]);
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
				 this.setDropdownContact(0);
				 deferred.resolve();
			 }
			 return deferred;

		 },
		 
		fillDropdownClaimer: function(e){
			if(e!=null){
				e.preventDefault();
			}
			var self = this;
			var value = this.selectListClaimersView.getSelectedItem();
			this.setDropdownClaimer(value);
		},

		/**
		 * if user reset contact value: reset the claimer infos
		 * else: bubble claimer contact infos to text inputs
		 */
		setDropdownContact: function(value){
			var self = this;
			var deferred = $.Deferred();
			if(value != '' && value > 0){
				var address = new app.Models.ClaimerContact();
				address.set('id',value);
				address.fetch({data:{fields:['name','phone','email']}}).done(function(){
					$('#requestContactPhone').val(address.toJSON().phone.toString());
					$('#requestContactEmail').val(address.toJSON().email);
					deferred.resolve();
				});
			}
			else{
				$('#requestContactInput, #requestContactPhone, #requestContactEmail').val('');
				deferred.resolve();
			}
			return deferred;
		},
		
		fillDropdownContact: function(e) {
			if(e!=null){
				e.preventDefault();
			}
			value = this.selectListClaimersContactsView.getSelectedItem();
			this.setDropdownContact(value);
		},
});