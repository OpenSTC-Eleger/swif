/******************************************
* Services List View
*/
app.Views.ServicesListView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'services',
	
	numberListByPage: 25,

	selectedService : '',


    // The DOM events  //
    events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',
		'click ul.sortable li'			: 'preventDefault',
		'click a.accordion-object'    	: 'tableAccordion',
		'change #officerService'		: 'fillDropdownService',
		
//		'click .btn.addService'  		: 'modalSaveService',
//		'click a.modalSaveService'  	: 'modalSaveService',
//		'submit #formAddService' 		: "saveService", 
		
		'click a.modalDeleteService'  	: 'modalDeleteSevice',
		'click button.btnDeleteService' : 'deleteService',
		
		'click .btn.addOfficer'  		: 'modalSaveOfficer',
		'click a.modalSaveOfficer'  	: 'modalSaveOfficer',		
		'submit #formSaveOfficer' 		: 'saveOfficer',
		
		'click a.modalDeleteOfficer'  	: 'modalDeleteOfficer',
		'click button.btnDeleteOfficer' : 'deleteOfficer'
    },

	

	/** View Initialization
	*/
    initialize: function () {
		
    },


	/** Display the view
	*/
    render: function () {
		
		// Change the page title //
        app.router.setPageTitle(app.lang.viewsTitles.servicesList);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var services = app.collections.claimersServices;
		var nbServices = _.size(services);

		var len = services.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		var technicalServicesArray = _.filter(app.collections.claimersServices.models, function(service){
			return service.attributes.technical == true 
		});
		var noTechnicalServicesArray = _.filter(app.collections.claimersServices.models, function(service){
			return service.attributes.technical != true 
		});	
		
		this.technicalServices = new app.Collections.ClaimersServices(technicalServicesArray);
		this.noTechnicalServices = new app.Collections.ClaimersServices(noTechnicalServicesArray);
	
		var self = this;
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				services: services.toJSON(),
				lang: app.lang,
				nbServices: nbServices,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});

			$(self.el).html(template);
			
			
			// Fill select Foreman  //
			app.views.selectListGroupsView = new app.Views.DropdownSelectListView({el: $("#officerGroup"), collection: app.collections.stcGroups})
			app.views.selectListGroupsView.clearAll();
			app.views.selectListGroupsView.addEmptyFirst();
			app.views.selectListGroupsView.addAll();
			
			app.views.selectListOfficerServiceView = new app.Views.DropdownSelectListView({el: $("#officerService"), collection: app.collections.claimersServices})
			app.views.selectListOfficerServiceView.clearAll();
			app.views.selectListOfficerServiceView.addEmptyFirst();
			app.views.selectListOfficerServiceView.addAll();
			
			$('#officerServices, #servicesList').sortable({
				connectWith: 'ul.sortableServicesList',
				dropOnEmpty: true,
				forcePlaceholderSize: true,
				forceHelperSize: true,
				placeholder: 'sortablePlaceHold',
				containment: '.servicesDroppableArea',
				cursor: 'move',
				opacity: '.8',
				revert: 300,
				receive: function(event, ui){
				}
			});	
		});

		$(this.el).hide().fadeIn('slow');
		
        return this;
    },  

    
    /*******************************************Display UI And Dispatch Events***********************************************/
    
    

    preventDefault: function(event){
    	event.preventDefault();
    },

    
	/** Display user services 
		*/
    displayServices: function(e){
		e.preventDefault();
	
		// Retrieve the ID of the intervention //
		var link = $(e.target);
		var id = _(link.parents('tr').attr('id')).strLeftBack('_');
		
		// Clear the list of the user //
		$('#officerServices li, #servicesList li').remove();
	
		var officerServices = new Array();
		if( id && parseInt(id)>0 ) {
			this.selectedOfficer = _.filter(app.collections.officers.models, function(item){ return item.attributes.id == id });
			var selectedOfficerJson = this.selectedOfficer[0].toJSON();	
			
			// Display the services of the team //
			_.each(selectedOfficerJson.service_ids, function (service, i){
				$('#officerServices').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
				officerServices[i] = service.id;
			});
		};
		
	    //search no technical services
//		var noTechnicalServices = _.filter(app.collections.claimersServices.models, function(service){
//			return service.attributes.technical != true 
//		});
//		//remove no technical services
//		app.collections.claimersServices.remove(noTechnicalServices);
//		app.collections.claimersServices.toJSON()
	
		// Display the remain services //
		_.filter(this.technicalServices.toJSON(), function (service, i){ 
			if(!_.contains(officerServices, service.id)){
				$('#servicesList').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
			}
		});
	
		var nbRemainServices = $('#servicesList li').length;
		$('#badgeNbServices').html(nbRemainServices);
		
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

  
    /**
    * Get input id fill in drop down input
    */
    getIdInDropDown: function(view) {
    	if ( view && view.getSelected() )
    		var item = view.getSelected().toJSON();
    		if( item )
    			return [ item.id, item.name ];
    	else 
    		return 0
    },
    
    renderTechnicalService: function ( service ) {
		if( service!= null ) {
			this.selectedServiceJson.id = service;
		}
	},
    
	fillDropdownService: function(e){
		e.preventDefault();
		this.renderTechnicalService( _($(e.target).prop('value')).toNumber() )
	},


 	
	
    /** Display information in the Modal view
    */
    modalDeleteSevice: function(e){
        
        // Retrieve the ID of the service //
        var link = $(e.target);

        var id = _(link.parents('tr').attr('id')).strRightBack('service_');
        
        this.selectedService = _.filter(app.collections.claimersServices.models, function(item){ return item.attributes.id == id });
        var selectedServiceJson = this.selectedService[0].toJSON();

        $('#infoModalDeleteService p').html(selectedServiceJson.name);
        $('#infoModalDeleteService small').html(selectedServiceJson.code);
    },


    /** Delete the selected service
    */
    deleteService: function(e){
		var self = this;
		this.selectedService[0].destroy({
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.claimersServices.remove(self.selectedService[0]);
					$('#modalDeleteService').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.serviceDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer le service");
			}

		});
    },
    
    /*******************************************Officer action***********************************************/

    /**
     * Set current officer model
     */
	setOfficerModel: function(e) {
    	this.selectedOfficer = null;
    	this.selectedOfficerJson = null;
    	this.selectedService = null;
    	this.selectedServiceJson = null;
	
		e.preventDefault();		
		var link = $(e.target);
		
		var id =  _(link.parents('tr').attr('id')).strRightBack('_');
		this.selectedService = _.filter(app.collections.claimersServices.models, function(item){ return item.attributes.id == id });
	
		id = "";
		id =  _(link.parents('tr').attr('id')).strLeftBack('_');
		this.selectedOfficer = _.filter(app.collections.officers.models, function(item){ return item.attributes.id == id });

		if( this.selectedService.length > 0 ) {	
			this.selectedService = this.selectedService[0];
			this.selectedServiceJson = this.selectedService.toJSON();			
		}

		if( this.selectedOfficer.length > 0 ) {
	
			this.selectedOfficer = this.selectedOfficer[0];
			this.selectedOfficerJson = this.selectedOfficer.toJSON();			
	
			$('#modalSaveOfficer h3').html(_.capitalize(app.lang.actions.updateOfficer));
		}
		else {
			this.selectedOfficerJson = null;
			
			$('#modalSaveOfficer h3').html(_.capitalize(app.lang.actions.addOfficer));
		}
		
		this.displayServices(e);
	
		//console.debug(this.selectedOfficer);
	},
	
	
	
	/** Modal create/update officer
	*/
	modalSaveOfficer: function(e){
		this.setOfficerModel(e);
		this.displayServices(e);
		
		// Reset the value to null //
		$('#officerName, #officerFirstname, #officerEmail, #officerLogin, #officerPassword').val('');
		app.views.selectListGroupsView.setSelectedItem(0);
		app.views.selectListGroupsView.clearAll();
		app.views.selectListGroupsView.addEmptyFirst();
		app.views.selectListGroupsView.addAll();
		
		
		if ( this.selectedServiceJson.technical ) {
			app.views.selectListOfficerServiceView = new app.Views.DropdownSelectListView({el: $("#officerService"), collection: this.technicalServices})
			app.views.selectListOfficerServiceView.clearAll();
			app.views.selectListOfficerServiceView.addEmptyFirst();
			app.views.selectListOfficerServiceView.addAll();
			$('#officerService').removeAttr("disabled");			
		}
		else { 
			app.views.selectListOfficerServiceView = new app.Views.DropdownSelectListView({el: $("#officerService"), collection: this.noTechnicalServices})
			app.views.selectListOfficerServiceView.clearAll();
			app.views.selectListOfficerServiceView.addEmptyFirst();
			app.views.selectListOfficerServiceView.addAll();
			$('#officerService').attr("disabled","disabled");			
		}
			

		// Update //
		if( this.selectedOfficerJson ) {
			$('#officerName').val(this.selectedOfficerJson.name);
			$('#officerFirstname').val(this.selectedOfficerJson.firstname);
	
			if(this.selectedOfficerJson.user_email == false){
				$('#officerEmail').val('');
			}
			else{
				$('#officerEmail').val(this.selectedOfficerJson.user_email);
			}
			$('#officerLogin').val(this.selectedOfficerJson.login);
	
			// Disable the required attribute for the password because it's an update 	//
			$('#officerPassword').removeAttr('required');
			
			if( this.selectedOfficerJson.service_id ) {
				app.views.selectListOfficerServiceView.setSelectedItem( this.selectedOfficerJson.service_id[0] );	
			}
			
			var self = this;
			var stc_groups = app.collections.stcGroups;
			_.each( stc_groups.models, function(group){	
				var groupJSON = group.toJSON();
				_.each(self.selectedOfficerJson.groups_id, function(officerGroup){
					if( groupJSON.id==officerGroup.id  )
						app.views.selectListGroupsView.setSelectedItem( groupJSON.id );
				})

			});
		}
		else{
			// Add the required attribute for the password because it's a creation //
			$('#officerPassword').attr('required', 'required');
			app.views.selectListOfficerServiceView.setSelectedItem( this.selectedServiceJson.id );
		}
		
		 $('#modalSaveOfficer').modal();
	},
	
			
	
	/** Save Officer
	*/
	saveOfficer: function(e) {
		e.preventDefault();
	
		var group_id = this.getIdInDropDown(app.views.selectListGroupsView);
		this.services = _.map($("#officerServices").sortable('toArray'), function(service){ return _(_(service).strRightBack('_')).toNumber(); }); 
		
		if( this.$('#officerPassword').val() != '' ){
			this.params = {
				name: this.$('#officerName').val().toUpperCase(),
				firstname: this.$('#officerFirstname').val(),
				user_email: this.$('#officerEmail').val(),
				login: this.$('#officerLogin').val(),
				new_password: this.$('#officerPassword').val(),
				groups_id:[[6, 0, [group_id[0]]]],
				//isManager: group_id[0]==19? true: false,
				service_id: this.selectedServiceJson.id,
				service_ids: [[6, 0, this.services]],
			};
		}
		else{
			this.params = {
				name: this.$('#officerName').val()	.toUpperCase(),
				firstname: this.$('#officerFirstname').val(),
				user_email: this.$('#officerEmail').val(),
				login: this.$('#officerLogin').val(),
				groups_id:[[6, 0, [group_id[0]]]],
				//isManager: group_id[0]==19? true: false,
				service_id: this.selectedServiceJson.id,
				service_ids: [[6, 0, this.services]],
			};
		}
	
		     
		var self = this;
		this.modelId = this.selectedOfficerJson==null?0: this.selectedOfficerJson.id;
	
	    app.Models.Officer.prototype.save(
	    	this.params,
	    	this.modelId, {
			success: function(data){
				
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
					
	
					$('#modalSaveOfficer').modal('hide');
				}				
			},
			error: function(e){
				alert('Impossible de créer ou mettre à jour l\'équipe');
			}
		});
	},
	
	
	
	/** Display information in the Modal view delete officer
	*/
	modalDeleteOfficer: function(e){
	
		// Retrieve the ID of the officer //
		this.setOfficerModel(e);
	
		$('#infoModalDeleteOfficer p').html(this.selectedOfficerJson.firstname +' '+ this.selectedOfficerJson.name);
		$('#infoModalDeleteOfficer small').html(_.capitalize(app.lang.lastConnection) +"	 "+ moment(this.selectedOfficerJson.date, 'YYYY-MM-DD HH:mm:ss').format('LLL'));
	},
	
	
	/** Delete the selected officer
	*/
	deleteOfficer: function(e){
		e.preventDefault();
		var self = this;
		this.selectedOfficer[0].delete({
			success: function(data){
				
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
					
//					app.collections.officers.remove(self.model);
//	
					$('#modalDeleteOfficer').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.officerDeleteOk);
//					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer l'agent");
			}
	
		});
	},



});