/******************************************
* Officers List View
*/
app.Views.OfficersListView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'officers',
	
	numberListByPage: 25,

	selectedOfficer: '',


	// The DOM events //
	events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',

		'click a.modalDeleteOfficer'  	: 'modalDeleteOfficer',
		'click a.modalSaveOfficer'  	: 'modalSaveOfficer',

		'submit #formSaveOfficer' 		: 'saveOfficer',
		'click button.btnDeleteOfficer' : 'deleteOfficer'
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
        app.router.setPageTitle(app.lang.viewsTitles.officersList);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');



		var officers = app.collections.officers;
		var len = officers.length;

//		var officersSortedArray = _.sortBy(officers, function(item){ 
//			return item.attributes.name.toUpperCase(); 
//		});
		

		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);




		// Set the STC groupe name for the officer //
		_.each(officers.models, function(officer){
			
			var self = this;
			self.officer = officer;
			self.officerJSON = officer.toJSON();

			_.each(app.collections.groups.models, function(group){

				var groupJSON = group.toJSON();

				if($.inArray(groupJSON.id, self.officerJSON.groups_id)!=-1){	
					self.officer.setGroupSTCName(groupJSON.name);
				}
			});

		});

		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				officers: officers.toJSON(),
				nbOfficers: len,
				lang: app.lang,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});

			$(self.el).html(template);
			
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

			// Tooltip //
			$('*[rel="tooltip"]').tooltip({placement: "right"});


			// Fill select Foreman  //
			app.views.selectListGroupsView = new app.Views.DropdownSelectListView({el: $("#officerGroup"), collection: app.collections.groups})
			app.views.selectListGroupsView.clearAll();
			app.views.selectListGroupsView.addEmptyFirst();
			app.views.selectListGroupsView.addAll();
		});

		$(this.el).hide().fadeIn('slow');

		return this;
	},



	getIdInDropDown: function(view) {
    	if ( view && view.getSelected() )
    		var item = view.getSelected().toJSON();
    		if( item )
    			return [ item.id, item.name ];
    	else 
    		return 0
    },
    


	/** Display user services 
	*/
    displayServices: function(e){
		e.preventDefault();
	
		// Retrieve the ID of the intervention //
		var link = $(e.target);
		var id = _(link.parents('tr').attr('id')).strRightBack('_');
		
		// Clear the list of the user //
		$('#officerServices li, #servicesList li').remove();
	
		var officerServices = new Array();
		if( id ) {
			this.selectedOfficer = _.filter(app.collections.officers.models, function(item){ return item.attributes.id == id });
			var selectedOfficerJson = this.selectedOfficer[0].toJSON();	
			
			// Display the services of the team //
			_.each(selectedOfficerJson.service_ids, function (service, i){
				$('#officerServices').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
				officerServices[i] = service.id;
			});
		};
		
	    //search no technical services
		var noTechnicalServices = _.filter(app.collections.claimersServices.models, function(service){
			return service.attributes.technical != true 
		});
		//remove no technical services
		app.collections.claimersServices.remove(noTechnicalServices);
		app.collections.claimersServices.toJSON()
	
		// Display the remain services //
		_.filter(app.collections.claimersServices.toJSON(), function (service, i){ 
			if(!_.contains(officerServices, service.id)){
				$('#servicesList').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
			}
		});
	
		var nbRemainServices = $('#servicesList li').length;
		$('#badgeNbServices').html(nbRemainServices);
		
	},



	setModel: function(e) {
		e.preventDefault();
		this.displayServices(e);
		var link = $(e.target);
		
		var id =  _(link.parents('tr').attr('id')).strRightBack('_');
		this.selectedOfficer = _.filter(app.collections.officers.models, function(item){ return item.attributes.id == id });

		if( this.selectedOfficer.length > 0 ) {

			this.model = this.selectedOfficer[0];
			this.selectedOfficerJson = this.model.toJSON();

			$('#modalSaveOfficer h3').html(_.capitalize(app.lang.actions.updateOfficer));
		}
		else {
			this.selectedOfficerJson = null;
			
			$('#modalSaveOfficer h3').html(_.capitalize(app.lang.actions.addOfficer));
		}

		console.debug(this.model);
	},



	/** Modal create/update officer
	*/
	modalSaveOfficer: function(e){
		this.setModel(e);
		
		// Reset the value to null //
		$('#officerName, #officerFirstname, #officerEmail, #officerLogin, #officerPassword').val('');
		app.views.selectListGroupsView.setSelectedItem(0);
		app.views.selectListGroupsView.clearAll();
		app.views.selectListGroupsView.addEmptyFirst();
		app.views.selectListGroupsView.addAll();
		

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
			
			var self = this;
			var stc_groups = app.collections.groups;
			_.each( stc_groups.models, function(group){	
				var groupJSON = group.toJSON();
				if($.inArray(groupJSON.id, self.selectedOfficerJson.groups_id)!=-1){	
					app.views.selectListGroupsView.setSelectedItem( groupJSON.id );
				}
			});
		}
		else{
			// Add the required attribute for the password because it's a creation //
			$('#officerPassword').attr('required', 'required');
		}
	},



	/** Display information in the Modal view delete officer
	*/
	modalDeleteOfficer: function(e){

		// Retrieve the ID of the officer //
		this.setModel(e);

		$('#infoModalDeleteOfficer p').html(this.selectedOfficerJson.firstname +' '+ this.selectedOfficerJson.name);
		$('#infoModalDeleteOfficer small').html(_.capitalize(app.lang.lastConnection) +"	 "+ moment(this.selectedOfficerJson.date, 'YYYY-MM-DD HH:mm:ss').format('LLL'));
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
				service_ids: [[6, 0, this.services]],
			};
		}

		     
		var self = this;
		this.modelId = this.selectedOfficerJson==null?0: this.selectedOfficerJson.id;

	    app.Models.Officer.prototype.save(
	    	this.params,
	    	this.modelId, {
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					if( self.modelId==0 ){
						self.model = new app.Models.Officer({id: data.result.result});
					}
					self.params.groups_id = self.getIdInDropDown(app.views.selectListGroupsView);	
					self.params.service_ids = self.services;
					self.model.update(self.params);
					
					app.collections.officers.add(self.model);

					$('#modalSaveOfficer').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.officerSaveOk);
					self.render();
				}				
			},
			error: function(e){
				alert('Impossible de créer ou mettre à jour l\'équipe');
			}
		});
	},



	/** Delete the selected officer
	*/
	deleteOfficer: function(e){
		e.preventDefault();
    	
		var self = this;
		this.model.delete({
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.officers.remove(self.model);

					$('#modalDeleteOfficer').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.officerDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer l'agent");
			}

		});
	},



	preventDefault: function(event){
    	event.preventDefault();
	 },

});