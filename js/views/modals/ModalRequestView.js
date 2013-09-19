/******************************************
* Requests Details View
*/
app.Views.ModalRequestView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/modalRequest',



	// The DOM events //
	events: function() {
		return _.defaults({
			'submit #formSaveRequest'            : 'saveRequest',
			
			'switch-change #switchCitizen'       : 'switchCitizen',
			'switch-change #switchPlaceEquipment': 'switchPlaceEquipment',
			
			'change #requestClaimerType'         : 'changeClaimerType',
			'change #requestClaimer'             : 'changeClaimer',
			'change #requestContact'             : 'changeContact',
			
			'click #menuSelectPlaceEquipement li': 'changeSelectPlaceEquipment',
			
			'change #requestDetailService'       : 'fillDropdownService',
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
			
			this.model = new app.Models.Request();
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
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang   : app.lang,
				request: self.model,
				loader : loader
			});

			self.modal.html(template);


			if(!loader){
				$('.make-switch').bootstrapSwitch();

				// Fill select ClaimersTypes //
				app.views.selectListClaimersTypesView = new app.Views.AdvancedSelectBoxView({el: $('#requestClaimerType'), collection: app.Collections.ClaimersTypes.prototype})
				app.views.selectListClaimersTypesView.render();

				// Request Claimer //
				app.views.selectListClaimersView = new app.Views.AdvancedSelectBoxView({el: $('#requestClaimer'), collection: app.Collections.Claimers.prototype});
				app.views.selectListClaimersView.render();

				// Request Contact //
				app.views.selectListClaimersContactsView = new app.Views.AdvancedSelectBoxView({el: $('#requestContact'), collection: app.Collections.ClaimersContacts.prototype});
				app.views.selectListClaimersContactsView.render();

				// Fill select Places/Equipments //
				app.views.selectListEquipmentsView = new app.Views.AdvancedSelectBoxView({el: $("#requestEquipment"), collection: app.Collections.Equipments.prototype})
				app.views.selectListEquipmentsView.render();

				app.views.selectListPlacesView = new app.Views.AdvancedSelectBoxView({el: $('#requestPlace'), collection: app.Collections.Places.prototype});
				app.views.selectListPlacesView.render();

				app.views.selectListServicesView = new app.Views.AdvancedSelectBoxView({el: $('#requestDetailService'), collection: app.Collections.ClaimersServices.prototype})
				app.views.selectListServicesView.render();
			}

			self.modal.modal('show');
		});

		return this;
    },


	
	/** Swith if the resquest is from a citizen or not
	*/
	switchCitizen: function(event, data){

		// From a citizen //
		if(data.value){
			$('.hide-citizen').fadeOut(function(){
				$('.hide-no-citizen').fadeIn();
				$('.readonly-no-citizen').prop('readonly', false);

			});
		}
		else{
			$('.hide-no-citizen').fadeOut(function(){
				$('.hide-citizen').fadeIn();
				$('.readonly-no-citizen').prop('readonly', true);
			});
		}
	},



	/** When the SelectBox ClaimerType change
	*/
	changeClaimerType: function(event){
		this.resetFormInput();

		// Reset the Claimers et Contact Box view //
		app.views.selectListClaimersView.reset();
		app.views.selectListClaimersContactsView.reset();


		var claimerTypeId = app.views.selectListClaimersTypesView.getSelectedItem();

		if(!_.isNumber(claimerTypeId)){
			app.views.selectListClaimersView.resetSearchParams();
		}
		else{

			var searchParam = {
				field    : 'type_id.id',
				operator : '=',
				value    : claimerTypeId
			}

			app.views.selectListClaimersView.setSearchParam(searchParam , true);
		}
	},



	/** When the SelectBox Claimer change
	*/
	changeClaimer: function(event){
		var self = this;
	
		// Reset the Claimers et Contact Box view //
		this.resetFormInput();
		app.views.selectListClaimersContactsView.reset();

		var claimerId = app.views.selectListClaimersView.getSelectedItem();

		if(!_.isNumber(claimerId)){
			app.views.selectListClaimersContactsView.resetSearchParams();
		}
		else{

			// Set the Contact //
			var searchParam = { field : 'partner_id.id', operator : '=', value : claimerId };
			app.views.selectListClaimersContactsView.setSearchParam(searchParam , true);

			
			// Fetch the organisation to know the Associated place and Service //
			this.organisation = new app.Models.Claimer({id: claimerId});
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
		this.resetFormInput();

		var contactId = app.views.selectListClaimersContactsView.getSelectedItem();
		this.contact = new app.Models.ClaimerContact({id: contactId});

		this.contact.fetch({ data : {fields : ['phone', 'email']} })
			.done(function(data){
				$('#requestContactPhone').val(data.phone);
				$('#requestContactEmail').val(data.email);
			});
	},



	/** Delete the value of the input form
	*/
	resetFormInput: function(){
		$('#requestContactPhone').val('');
		$('#requestContactEmail').val('');
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

		// Set the properties of the model //
		this.model.setName($('#requestName').val(), true);
		this.model.setSite(app.views.selectListPlacesView.getSelectedItem(), true);
		this.model.setService(app.views.selectListServicesView.getSelectedItem(), true);
		this.model.setDescription($('#requestDescription').val(), true);
		this.model.setPlaceDetails($('#requestPlacePrecision').val(), true);

		
		// On Place //
		if($('#switchPlaceEquipment').bootstrapSwitch('status')){
			this.model.setOnEquipment(false, true);
		}
		else{
			this.model.setOnEquipment(true, true);
			this.model.setEquipment(app.views.selectListEquipmentsView.getSelectedItem(), true);
		}

		// From Citizen //
		if($('#switchCitizen').bootstrapSwitch('status')){
			this.model.setFromCitizen(true, true);

			// Set the citizen //
			this.model.setCitizenName($('#requestContactName').val(), true);
			this.model.setCitizenPhone($('#requestContactPhone').val(), true);
			this.model.setCitizenEmail($('#requestContactEmail').val(), true);
		}
		else{
			this.model.setFromCitizen(false, true);
			// Set the contact //
			this.model.setClaimerType(app.views.selectListClaimersTypesView.getSelectedItem(), true);
			this.model.setClaimer(app.views.selectListClaimersView.getSelectedItem(), true);
			this.model.setClaimerContact(app.views.selectListClaimersContactsView.getSelectedItem(), true);
		}


		this.model.save()
			.done(function(data) {
				self.modal.modal('hide');

				// Create mode //
				if(self.model.isNew()) {
					self.model.setId(data);
					self.model.fetch({silent: true, data : {fields : app.Collections.Requests.prototype.fields} }).done(function(){
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


























	    
	/** Save the request
	*/
	saveRequerrqqqqqst: function (e) {

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
	    



});