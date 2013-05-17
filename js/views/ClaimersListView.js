/******************************************
* Claimers List View
*/
app.Views.ClaimersListView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'claimers',

	numberListByPage: 25,

	selectedClaimer : '',
	selectedContact : '',


    // The DOM events //
    events: {
    	'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',
		
        'click a.modalSaveClaimer'  		: 'modalSaveClaimer',
		'submit #formSaveClaimer' 			: 'saveClaimer', 
		'click a.modalDeleteClaimer'  		: 'modalDeleteClaimer',
		'click button.btnDeleteClaimer'		: 'deleteClaimer',
		
		'click .modalSaveContact'               : 'modalSaveContact',
		'submit #formAddAddress'             	: 'saveAddress',
		'click a.modalDeleteContact'   			: 'modalDeleteContact',
        'click button.btnDeleteAddress'   		: 'deleteAddress',
			
		'click a.accordion-object'    			: 'tableAccordion',
		'change #claimerTechnicalService'		: 'fillDropdownTechnicalService',
		
		'change #createAssociatedAccount' 			: 'accordionAssociatedAccount'
    },



	/** View Initialization
	*/
	initialize: function () {

	},


	/** Display the view
	*/
    render: function () {
		var self = this;

		// Change the page title //
        app.router.setPageTitle(app.lang.viewsTitles.claimersList);


		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		var claimers = app.collections.claimers.models;
		var nbClaimers = _.size(claimers);

		var claimersSortedArray = _.sortBy(claimers, function(item){ 
			return item.attributes.name; 
		});


		var len = claimers.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				claimers: claimersSortedArray,
				officers: app.collections.officers,
				lang: app.lang,
				nbClaimers: nbClaimers,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});

			$(self.el).html(template);

			$('*[data-toggle="tooltip"]').tooltip();

			// Set the focus to the first input of the form //
			$('#modalSaveContact, #modalSaveClaimer').on('shown', function (e) {
				$(this).find('input, textarea').first().focus();
			})
		});


		$(this.el).hide().fadeIn('slow');
		
		return this;
    },
    


    /** Fonction collapse table row
    */
    tableAccordion: function(e){

        e.preventDefault();
        
        // Retrieve the intervention ID //
        var id = _($(e.target).attr('href')).strRightBack('_');

        this.selectedClaimer = id;


        var isExpend = $('#collapse_'+id).hasClass('expend');

        // Reset the default visibility //
        $('tr.expend').css({ display: 'none' }).removeClass('expend');
        $('tr.row-object').css({ opacity: '0.5'});
        $('tr.row-object > td').css({ backgroundColor: '#FFF'});
        
        // If the table row isn't already expend //       
        if(!isExpend){
            // Set the new visibility to the selected intervention //
            $('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
            $(e.target).parents('tr.row-object').css({ opacity: '1'});
            $(e.target).parents('tr.row-object').children('td').css({ backgroundColor: '#F5F5F5'});
        }
        else{
            $('tr.row-object').css({ opacity: '1'});
            $('tr.row-object > td').css({ backgroundColor: '#FFF'});
            $('tr.row-object:nth-child(4n+1) > td').css({ backgroundColor: '#F9F9F9'});
        }
           
    },
    
    
	getIdInDropDown: function(view) {
		if ( view && view.getSelected() )
			var item = view.getSelected().toJSON();
			if( item )
				return [ item.id, item.name ];
		else 
			return 0
	},



	getTarget:function(e) {    	
    	e.preventDefault();
	    // Retrieve the ID of the intervention //
		var link = $(e.target);
		this.pos =  _(link.parents('tr').attr('id')).strRightBack('_');
		
    },
	
	setModel: function(e) {
    	this.getTarget(e);
    	var self = this;
	    this.selectedClaimer = _.filter(app.collections.claimers.models, function(item){ return item.attributes.id == self.pos });
	    if( this.selectedClaimer.length>0 ) {
	    	this.model = this.selectedClaimer[0];
	    	this.selectedClaimerJson = this.model.toJSON();        
	    }
	    else {
	    	this.selectedClaimerJson = null;
	    }        
	},
	
	
	/** Add a new categorie
	*/
	modalSaveClaimer: function(e){       
	    this.setModel(e);

	    // Hack to remove "Administré" from the claimersTypes Collection //
	    var claimersTypes = app.collections.claimersTypes.reset(app.collections.claimersTypes.rest());

		app.views.selectListClaimerTypeView = new app.Views.DropdownSelectListView({el: $("#claimerType"), collection: claimersTypes})
		app.views.selectListClaimerTypeView.clearAll();
		app.views.selectListClaimerTypeView.addEmptyFirst();
		app.views.selectListClaimerTypeView.addAll();

		
		//search no technical services
		var technicalServices = _.filter(app.collections.claimersServices.models, function(service){
			return service.attributes.technical == true 
		});
		//remove no technical services
		var technicalServicesList = new app.Collections.ClaimersServices(technicalServices);
		
		app.views.selectListClaimerTechnicalServiceView = new app.Views.DropdownSelectListView({el: $("#claimerTechnicalService"), collection: technicalServicesList})
		app.views.selectListClaimerTechnicalServiceView.clearAll();
		app.views.selectListClaimerTechnicalServiceView.addEmptyFirst();
		app.views.selectListClaimerTechnicalServiceView.addAll();
		
		app.views.selectListClaimerTechnicalSiteView = new app.Views.DropdownSelectListView({el: $("#claimerTechnicalSite"), collection: app.collections.places})
		app.views.selectListClaimerTechnicalSiteView.clearAll();
		app.views.selectListClaimerTechnicalSiteView.addEmptyFirst();
		app.views.selectListClaimerTechnicalSiteView.addAll();
		
	    
	    $('#claimerName').val('');
	    if( this.selectedClaimerJson ) {
			$('#claimerName').val(this.selectedClaimerJson.name);
			if( this.selectedClaimerJson.type_id )
				app.views.selectListClaimerTypeView.setSelectedItem( this.selectedClaimerJson.type_id[0] );	
			if( this.selectedClaimerJson.technical_service_id )
				app.views.selectListClaimerTechnicalServiceView.setSelectedItem( this.selectedClaimerJson.technical_service_id[0] );	
			if( this.selectedClaimerJson.technical_site_id )
				app.views.selectListClaimerTechnicalSiteView.setSelectedItem( this.selectedClaimerJson.technical_site_id[0] );	
			
	    }       
	
	},
	
	
	/** Display information to the Modal for delete claimer
	*/
	modalDeleteClaimer: function(e){

	    // Retrieve the ID of the Claimer //
		this.setModel(e);

		console.log(this.selectedClaimerJson);
	
	    $('#infoModalDeleteClaimer p').html(this.selectedClaimerJson.name);
	    $('#infoModalDeleteClaimer small').html(this.selectedClaimerJson.type_id[1]);
	},
	


    /** Display the form to add a new contact
	*/
    modalSaveContact: function(e){
		this.getTarget(e);

    	var link = $(e.target);

    	// Reset the form //
    	$('#modalSaveContact input').val('');
    	$('#createAssociatedAccount, #partnerLogin').prop('disabled', false);
    	$('#createAssociatedAccount').prop('checked', false);


    	// Check if it's a creation or not //
    	if(link.data('action') == 'update'){

			this.getTarget(e);
	    	this.selectedAddress = app.collections.claimersContacts.get(this.pos);
		    this.selectedAddressJSON = this.selectedAddress.toJSON();

		    // Set Informations in the form //
		    $('#addressName').val(this.selectedAddressJSON.name);
		    $('#addressEmail').val(this.selectedAddressJSON.email);
		    $('#addressFunction').val(this.selectedAddressJSON.function);
		    if(this.selectedAddressJSON.phone != false){
		    	$('#addressPhone').val(this.selectedAddressJSON.phone);
		    }
		    
		    if(this.selectedAddressJSON.mobile != false){
		    	$('#addressMobile').val(this.selectedAddressJSON.mobile);
		    }

			if(this.selectedAddressJSON.addressStreet != false){
				$('#addressStreet').val(this.selectedAddressJSON.street);
			}
			if(this.selectedAddressJSON.addressCity != false){
				$('#addressCity').val(this.selectedAddressJSON.city);
			}
			if(this.selectedAddressJSON.addressZip != false){
				$('#addressZip').val(this.selectedAddressJSON.zip);
			}


		    // Check if the user have an account in OpenERP //
		    if(this.selectedAddressJSON.user_id != false){
		    	$('#createAssociatedAccount').prop('checked', true); $('#createAssociatedAccount, #partnerLogin').prop('disabled', true);
		    	$('fieldset.associated-account').show();

		    	var off = app.collections.officers.get(this.selectedAddressJSON.user_id[0]);
		    	$('#partnerLogin').val(off.getLogin());
		    }
		    else{
				$('fieldset.associated-account').hide();
				$('#createAssociatedAccount, #partnerLogin').prop('disabled', false);
		    }

		    $('fieldset.associated-adress').show();
    	}
    	else{
    		// Reset the form //
    		$('fieldset.associated-account').hide();
    	}

	},



    /** Set informations to the Modal for delete contact
    */
	modalDeleteContact: function(e){
    	this.getTarget(e);
	    this.selectedAddress = app.collections.claimersContacts.get(this.pos);
		this.selectedAddressJSON = this.selectedAddress.toJSON();
		console.log(this.selectedAddressJSON);
		$('#infoModalDeleteContact').children('p').html(this.selectedAddressJSON.name);
		$('#infoModalDeleteContact').children('small').html(_.capitalize(this.selectedAddressJSON.function));
	},



	/** Save the Address
	*/
    saveAddress: function(e){
		e.preventDefault();
		
		if( $('#createAssociatedAccount').is(':checked') ){

			
			if($('#partnerLogin').val() == '' || $('#partnerPassword').val() == ''){

				app.notify('', 'error', 
					app.lang.errorMessages.unablePerformAction, 
					app.lang.validationMessages.claimers.accountIncorrect);
					return;
			}
     	}


		this.params = {
			partner_id: this.selectedClaimer,
			name: this.$('#addressName').val(),
			login: this.$('#partnerLogin').val(),
			password: this.$('#partnerPassword').val(),
			function: this.$('#addressFunction').val(),
			phone: this.$('#addressPhone').val(),
			email: this.$('#addressEmail').val(),
			mobile: this.$('#addressMobile').val(),
			street: this.$('#addressStreet').val(),
			city: this.$('#addressCity').val(),
			zip: this.$('#addressZip').val(),
		};

		console.log(this.params);
	     
		var self = this;
		this.modelId = this.selectedAddressJSON == null ? 0 : this.selectedAddressJSON.id;


	    app.Models.ClaimerContact.prototype.save(
	    	this.params,
	    	this.modelId, {
			success: function(data){
				console.log(data);
				if(data.error && data.error.data){
					app.notify('', 'error', data.error.data.fault_code);
				}
				else{
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
					$('#modalSaveContact').modal('hide');
				}				
			},
			error: function(e){
				alert('Impossible de créer ou mettre à jour le contact');
			}
		});
	     
		
   },
   
    /** Delete Address
    */
    deleteAddress: function(e){
		var self = this;
		this.selectedAddress.delete({
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.claimersContacts.remove(self.selectedAddress);
					var claimer = app.collections.claimers.get(self.selectedAddressJSON.livesIn.id);					
					claimer.attributes.address.remove(self.selectedAddressJSON.id);
					app.collections.claimers.add(claimer);
					$('#modalDeleteContact').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.addressDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer le contact");
			}

		});

    },	
	
	
	
	/** Save  place
	*/
	saveClaimer: function(e) {		     
		e.preventDefault();
	
	     
	     
	     var type_id = this.getIdInDropDown(app.views.selectListClaimerTypeView);
	     var technical_service_id = this.getIdInDropDown(app.views.selectListClaimerTechnicalServiceView);
	     var technical_site_id = this.getIdInDropDown(app.views.selectListClaimerTechnicalSiteView);
	     
	     this.params = {	
		     name: this.$('#claimerName').val(),
		     type_id: type_id,	     
		     technical_service_id: technical_service_id,
		     technical_site_id: technical_site_id,
	     };
	     
	       
	    this.params.type_id =  type_id[0];
	    this.params.technical_service_id =  technical_service_id[0];
	    this.params.technical_site_id =  technical_site_id[0];
	    this.modelId = this.selectedClaimerJson==null?0: this.selectedClaimerJson.id;
	    var self = this;
	    app.Models.Claimer.prototype.save(
	    	this.params, 
	    	this.modelId,
	    	{
				success: function(data){
					console.log(data);
					if(data.error){
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else{
						if( self.modelId==0 )
							self.model = new app.Models.Claimer({id: data.result.result}); 
						self.params.type_id =  self.getIdInDropDown(app.views.selectListClaimerTypeView);
					    self.params.technical_service_id =  self.getIdInDropDown(app.views.selectListClaimerTechnicalServiceView);
					    self.params.technical_site_id =  self.getIdInDropDown(app.views.selectListClaimerTechnicalSiteView);
						self.model.update(self.params);
						app.collections.claimers.add(self.model);
						$('#modalSaveClaimer').modal('hide');
						app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.placeDeleteOk);
						self.render();
					}				
				},
				error: function(e){
					alert("Impossible de mettre à jour le demandeur");
				}
	    });
	},
	
	
	/** Delete the selected claimer
	*/
	deleteClaimer: function(e){
		e.preventDefault();
		
	   	var self = this;
		this.model.delete({
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.claimers.remove(self.model);
					$('#modalDeleteClaimer').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.claimerDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer le demandeur");
			}
	
		});
	},
	
	fillDropdownTechnicalService: function(e){
		 e.preventDefault();
		 $('#claimerTechnicalSite').val('');
		 this.renderTechnicalService( _($(e.target).prop('value')).toNumber() )
	},
	
	renderTechnicalService: function ( service ) {
		if( service!= null ) {
			app.views.selectListClaimerTechnicalServiceView.setSelectedItem( service );
			places = app.collections.places.models;
			var placesFiltered = _.filter(places, function(item){ 
				var placeJSON = item.toJSON();
				var placeServices = placeJSON.service_ids;	
				var placeServices = [];
				_.each( item.attributes.service_ids.models, function(s){
					placeServices.push( s.toJSON().id );
				});				
				return $.inArray(service, placeServices)!=-1
	        });
			app.views.selectListClaimerTechnicalSiteView.collection = new app.Collections.Places(placesFiltered);
			app.views.selectListClaimerTechnicalSiteView.clearAll();
			app.views.selectListClaimerTechnicalSiteView.addEmptyFirst();
			app.views.selectListClaimerTechnicalSiteView.addAll();
			
		}
	},
	
	

	/** Display or Hide Create associated Task Section
	*/
	accordionAssociatedAccount: function(event){
		event.preventDefault();

		// Toggle Slide Create associated task section //
		$('fieldset.associated-account').stop().slideToggle(function(){
			if($(this).is(":hidden")){
				$('#partnerLogin, #partnerPassword').prop('required', false);
				$('#partnerLogin, #partnerPassword').val('');
			}
			else{
				$('#partnerLogin, #partnerPassword').prop('required', true);
			}
		});
	},

	

	preventDefault: function(event){
		event.preventDefault();
	},

});