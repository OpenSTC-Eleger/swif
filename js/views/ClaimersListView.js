/******************************************
* Claimers List View
*/
app.Views.ClaimersListView = app.Views.GenericListView.extend({

	el : '#rowContainer',

	templateHTML: 'claimers',

	selectedClaimer : '',
	selectedContact : '',


    // The DOM events //
    events: function(){
		return _.defaults({
				'click a.modalNewClaimer' : 'modalNewClaimer'
			},
			app.Views.GenericListView.prototype.events
		);
	},

//
//	{
//    	'click li.active'				: 'preventDefault',
//		'click li.disabled'				: 'preventDefault',
//
//
//		'submit #formSaveClaimer' 			: 'saveClaimer',
//		'click a.modalDeleteClaimer'  		: 'modalDeleteClaimer',
//		'click button.btnDeleteClaimer'		: 'deleteClaimer',
//
//		'click .modalSaveContact'               : 'modalSaveContact',
//		'submit #formAddAddress'             	: 'saveAddress',
//		'click a.modalDeleteContact'   			: 'modalDeleteContact',
//        'click button.btnDeleteAddress'   		: 'deleteAddress',
//
//		'change #claimerTechnicalService'		: 'fillDropdownTechnicalService',
//
//		'change #createAssociatedAccount' 			: 'accordionAssociatedAccount'
//    },
//


	/** View Initialization
	*/
	initialize: function () {
		var self = this;
		this.initCollection().done(function () {
			self.collection.off();
			self.listenTo(self.collection, 'add', self.add);

			app.router.render(self);
		})
	},


	initCollection: function () {
		if(_.isUndefined(this.collection)){ this.collection = new app.Collections.Claimers(); }

		if(_.isUndefined(this.options.sort)){
			this.options.sort = this.collection.default_sort;
		}
		else{
			this.options.sort = app.calculPageSort(this.options.sort);
		}
		this.options.page = app.calculPageOffset(this.options.page);


		// Create Fetch params //
		var fetchParams = {
			silent : true,
			data   : {
				limit  : app.config.itemsPerPage,
				offset : this.options.page.offset,
				sort   : this.options.sort.by+' '+this.options.sort.order
			}
		};
		if(!_.isUndefined(this.options.search)){
			fetchParams.data.filters = app.calculSearch({search: this.options.search }, app.Models.Claimer.prototype.searchable_fields);
		}


		app.loader('display');
		return $.when(this.collection.fetch(fetchParams))
			.fail(function(e){
				console.log(e);
			})
			.always(function(){
				app.loader('hide');
			});

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

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function (templateData) {
			var template = _.template(templateData, {
				lang      : app.lang,
				nbClaimers: self.collection.cpt,
			});

			$(self.el).html(template);
			app.Views.GenericListView.prototype.render(self.options);


			$('*[data-toggle="tooltip"]').tooltip();

			_.each(self.collection.models, function (claimer, i) {
				var simpleView = new app.Views.ClaimerView({model: claimer})
				var detailedView = new app.Views.ClaimerDetailsView({model: claimer})
				$('#claimersList').append( simpleView.render().el );
				$('#claimersList').append(detailedView.render().el);
				simpleView.detailedView = detailedView;
			});

			// Set the focus to the first input of the form //
			$('#modalSaveContact, #modalSaveClaimer').on('shown', function (e) {
				$(this).find('input, textarea').first().focus();
			})

			app.views.paginationView = new app.Views.PaginationView({
				page       : self.options.page.page,
				collection : self.collection
			})
			app.views.paginationView.render();

		});

		$(this.el).hide().fadeIn('slow');

		return this;
	},


	add: function(model){
		var claimerView  = new app.Views.ClaimerView({ model: model });
		$('#claimersList').prepend(claimerView.render().el);
		claimerView.highlight();

		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.placeCreateOk);
		this.partialRender();
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


	modalNewClaimer: function(e){
		e.preventDefault();
		app.views.modalClaimerView = new app.Views.ModalsClaimerEdit({
			el  : '#modalEditClaimer'
		});
	},

	
	
	/** Display information to the Modal for delete claimer
	*/
	modalDeleteClaimer: function(e){

	    // Retrieve the ID of the Claimer //
		this.setModel(e);

		//console.log(this.selectedClaimerJson);
	
	    $('#infoModalDeleteClaimer p').html(this.selectedClaimerJson.name);
	    $('#infoModalDeleteClaimer small').html(this.selectedClaimerJson.type_id[1]);
	},
	


    /** Display the form to add a new contact
	*/
    modalSaveContact: function(e){
		this.selectedAddressJSON = null;
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
		//console.log(this.selectedAddressJSON);
		$('#infoModalDeleteContact').children('p').html(this.selectedAddressJSON.name);
		$('#infoModalDeleteContact').children('small').html(_.capitalize(this.selectedAddressJSON.function));
	},



	/** Save the Address
	*/
    saveAddress: function(e){
		e.preventDefault();
		
		this.params = {};
		
		if( $('#createAssociatedAccount').is(':checked') ){

			
			if($('#partnerLogin').val() == '' || $('#partnerPassword').val() == ''){


				app.notify('', 'error', 
					app.lang.errorMessages.unablePerformAction, 
					app.lang.validationMessages.claimers.accountIncorrect);
					return;
			}
			else{
				this.params.login = this.$('#partnerLogin').val();
				this.params.password = this.$('#partnerPassword').val();
			}
     	}


		this.params.partner_id= this.selectedClaimer;
		this.params.name= this.$('#addressName').val();
		this.params.function= this.$('#addressFunction').val();
		this.params.phone= this.$('#addressPhone').val();
		this.params.email= this.$('#addressEmail').val();
		this.params.mobile= this.$('#addressMobile').val();
		this.params.street= this.$('#addressStreet').val();
		this.params.city= this.$('#addressCity').val();
		this.params.zip= this.$('#addressZip').val();
	

     
		var self = this;
		this.modelId = this.selectedAddressJSON == null ? 0 : this.selectedAddressJSON.id;


	    app.Models.ClaimerContact.prototype.save(
	    	this.params,
	    	this.modelId, {
			success: function(data){
				//console.log(data);
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
				console.error(e);
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
	
	

	
	/** Delete the selected claimer
	*/
	deleteClaimer: function(e){
		e.preventDefault();
		
	   	var self = this;
		this.model.delete({
			success: function(data){
				//console.log(data);
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
				console.error(e);
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