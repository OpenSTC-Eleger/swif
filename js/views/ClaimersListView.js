/******************************************
* Claimers List View
*/
app.Views.ClaimersListView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'claimers',

	numberListByPage: 25,

	selectedClaimer : '',


    // The DOM events //
    events: {
    	'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',
		
        'click a.modalSaveClaimer'  		: 'modalSaveClaimer',
		'submit #formSaveClaimer' 			: "saveClaimer", 
		'click a.modalDeleteClaimer'  		: 'modalDeleteClaimer',
		'click button.btnDeleteClaimer'		: 'deleteClaimer',
		
		'click .btn.addAddress'                	: 'modalAddAddress',
		'click button.saveAddress'             	: 'saveAddress',
		'click a.modalDeleteAddress'   			: 'modalDeleteAddress',
        'click button.btnDeleteAddress'   		: 'deleteAddress',
			
		'click a.accordion-object'    			: 'tableAccordion',
		'change #claimerTechnicalService'		: 'fillDropdownTechnicalService',
		
		'change #createAssociatedAccount' 			: 'accordionAssociatedAccount',
		'change #associatedAdress' 					: 'accordionAssociatedAdress',
			
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
				lang: app.lang,
				nbClaimers: nbClaimers,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});

			$(self.el).html(template);

			$('*[data-toggle="tooltip"]').tooltip();
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
	    
		app.views.selectListClaimerTypeView = new app.Views.DropdownSelectListView({el: $("#claimerType"), collection: app.collections.claimersTypes})
		app.views.selectListClaimerTypeView.clearAll();
		app.views.selectListClaimerTypeView.addEmptyFirst();
		app.views.selectListClaimerTypeView.addAll();

		app.views.selectListClaimerServiceView = new app.Views.DropdownSelectListView({el: $("#claimerService"), collection: app.collections.claimersServices})
		app.views.selectListClaimerServiceView.clearAll();
		app.views.selectListClaimerServiceView.addEmptyFirst();
		app.views.selectListClaimerServiceView.addAll();
		
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
			if( this.selectedClaimerJson.service_id )
				app.views.selectListClaimerServiceView.setSelectedItem( this.selectedClaimerJson.service_id[0] );	
			if( this.selectedClaimerJson.technical_service_id )
				app.views.selectListClaimerTechnicalServiceView.setSelectedItem( this.selectedClaimerJson.technical_service_id[0] );	
			if( this.selectedClaimerJson.technical_site_id )
				app.views.selectListClaimerTechnicalSiteView.setSelectedItem( this.selectedClaimerJson.technical_site_id[0] );	
			
	    }       
	
	},
	
	
	/** Display information in the Modal view
	*/
	modalDeleteClaimer: function(e){
	    
	    // Retrieve the ID of the Claimer //
		this.setModel(e);
	
	    $('#infoModalDeleteClaimer p').html(this.selectedClaimerJson.name);
	    $('#infoModalDeleteClaimer small').html(this.selectedClaimerJson.code);
	},
	
    /** Display the form to add a new address
    	    */
    modalAddAddress: function(e){
    	this.getTarget(e);   	
        $('#modalAddAddress').modal();
    },
	
	modalDeleteAddress: function(e){
    	this.getTarget(e);
	    this.selectedAddress = app.collections.claimersContacts.get(this.pos);
		this.selectedAddressJSON = this.selectedAddress.toJSON();
		$('#infoModalDeleteAddress').children('p').html(this.selectedAddressJSON.name);
		$('#infoModalDeleteAddress').children('small').html(this.selectedAddressJSON.phone);	    
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
	         partner_id: this.pos,
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
		var self = this;
		this.modelId = this.selectedAddressJson==null?0: this.selectedAddressJson.id;

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
					$('#modalAddAddress').modal('hide');
				}				
			},
			error: function(e){
				alert('Impossible de créer ou mettre à jour l\'équipe');
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
					$('#modalDeleteAddress').modal('hide');
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
	     var service_id = this.getIdInDropDown(app.views.selectListClaimerServiceView);
	     var technical_service_id = this.getIdInDropDown(app.views.selectListClaimerTechnicalServiceView);
	     var technical_site_id = this.getIdInDropDown(app.views.selectListClaimerTechnicalSiteView);
	     
	     this.params = {	
		     name: this.$('#claimerName').val(),
		     type_id: type_id,
		     service_id: service_id,		     
		     technical_service_id: technical_service_id,
		     technical_site_id: technical_site_id,
	     };
	     
	       
	    this.params.type_id =  type_id[0];
	    this.params.service_id =  service_id[0];
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
					    self.params.service_id =  self.getIdInDropDown(app.views.selectListClaimerServiceView);
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
		$('fieldset.associated-account').stop().slideToggle();
	},
	
	accordionAssociatedAdress: function(event){
		event.preventDefault();
	
		// Toggle Slide Create associated task section //
		$('fieldset.associated-adress').stop().slideToggle(function(){
			$('#modalAddAddress div.modal-body').animate({scrollTop: $('#modalAddAddress div.modal-body').height()}, 400);
		});
	},
	
	preventDefault: function(event){
		event.preventDefault();
	},

});