/******************************************
* Equipments List View
*/
app.Views.EquipmentsListView = app.Views.GenericListView.extend({


	
	templateHTML: 'equipments',
	

	// The DOM events //
	events: function(){
		return _.defaults({
			'click li.active'							: 'preventDefault',
			'click li.disabled'							: 'preventDefault',
			'click ul.sortable li'						: 'preventDefault',

			'click a.modalAddEquipment'  				: 'modalSaveEquipment',


			'submit #formSaveEquipment' 				: 'saveEquipment', 
			'click button.btnDeleteEquipment' 			: 'deleteEquipment',

			'click #equipmentCatChoose button:not(.disabled)'			: 'accordionAddEquipmentForm'
		}, 
			app.Views.GenericListView.prototype.events
		);
	},

	/** View Initialization
	*/
	initialize: function () {
		var self = this;
		console.log('Equipments List view Initialize');
		this.initCollections().done(function(){
			app.router.render(self);
			// Unbind & bind the collection //
			self.collections.equipments.off();
			self.listenTo(self.collections.equipments, 'add',self.add);
		});
	},



	/** Display the view
	*/
	render: function () {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.equipmentsList);


		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang: app.lang,
				nbEquipments: self.collections.equipments.length
			});
			$(self.el).html(template);
			//create ItemView for each equipment in the collection
			_.each(self.collections.equipments.models, function(item ,i){
				var itemView = new app.Views.ItemEquipmentView({model:item});
				$('#row-items').append(itemView.render().el);
			});
			
			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);
			
			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page       : self.options.page.page,
				collection : self.collections.equipments
			});
			app.views.paginationView.render();
			
			$('*[data-toggle="tooltip"]').tooltip();
			
			$('#equipmentServices, #servicesList').sortable({
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



	getIdInDropDown: function(view) {
		if ( view && view.getSelected() )
			var item = view.getSelected().toJSON();
			if( item )
				return [ item.id, item.name ];
		else 
			return 0
	},



	setModel: function(e) {
		e.preventDefault();
		this.displayEquipmentInfos(e);
		var link = $(e.target);
		var id =  _(link.parents('tr').attr('id')).strRightBack('_');
		this.selected = _.filter(app.collections.equipments.models, function(item){ return item.attributes.id == id });
		if( this.selected.length>0 ) {
			this.model = this.selected[0];
			this.selectedJson = this.model.toJSON();  
		}
		else {
			this.selectedJson = null;
		}
	},
	

	
	/** Display category services
	*/
	displayEquipmentInfos: function(e){
		e.preventDefault();

		// Retrieve the ID of the intervention //
		var link = $(e.target);
		var id = _(link.parents('tr').attr('id')).strRightBack('_');
		
		// Clear the list of the user //
		$('#equipmentServices li, #servicesList li').remove();

		var equipmentServices = new Array();
		if( id ) {
			this.selectedEquipment = _.filter(app.collections.equipments.models, function(item){ return item.attributes.id == id });
			var selectedEquipmentJson = this.selectedEquipment[0].toJSON();	
			
			// Display the services of the team //
			_.each(selectedEquipmentJson.service_ids, function (service, i){
				$('#equipmentServices').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
				equipmentServices[i] = service.id;
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
			if(!_.contains(equipmentServices, service.id)){
				$('#servicesList').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
			}
		});

		var nbRemainServices = $('#servicesList li').length;
		$('#badgeNbServices').html(nbRemainServices);
		
	},


	/** Add a new equipment
	*/
	modalSaveEquipment: function(e){
		e.preventDefault();
		new app.Views.ModalEquipmentView({el:'#modalSaveEquipment'});

//		this.setModel(e);	
//		
//		app.views.selectListServicesView = new app.Views.DropdownSelectListView({el: $("#equipmentService"), collection: app.collections.claimersServices})
//		app.views.selectListServicesView.clearAll();
//		app.views.selectListServicesView.addEmptyFirst();
//		app.views.selectListServicesView.addAll();		
//		
//		
//		// Reset Form element //
//		$('#formSaveEquipment input').val('');
//		$('#equipmentCV, #equipmentTime, #equipmentKm').val(0);
//		$('#equipmentYear').val( moment().year() );
//		$('#equipmentCatChoose button').removeClass('active btn-primary');
//	
//
//		// If update set the correct information //
//		if( this.selectedJson ) {
//			if( this.selectedJson.service )
//				app.views.selectListServicesView.setSelectedItem( this.selectedJson.service[0] );
//
//			$('#equipmentName').val(this.selectedJson.name);
//			$('#equipmentImmat').val(this.selectedJson.immat);
//			$('#equipmentMarque').val(this.selectedJson.marque);
//			$('#equipmentUsage').val(this.selectedJson.usage);
//			$('#equipmentType').val(this.selectedJson.type);
//			$('#equipmentCV').val(this.selectedJson.cv);
//			$('#equipmentYear').val(this.selectedJson.year);
//			$('#equipmentTime').val(this.selectedJson.time);
//			$('#equipmentKm').val(this.selectedJson.km);
//
//			if(this.selectedJson.technical_vehicle == true || this.selectedJson.commercial_vehicle == true){
//				$('#aboutEquipmentSection').hide();
//				$('#aboutVehicleSection').show();
//			}
//			else{
//				$('#aboutEquipmentSection').show();
//				$('#aboutVehicleSection').hide();
//			}
//
//			// Disable all buttons if its an update //
//			$('#equipmentCatChoose button').addClass('disabled');
//
//			this.selectedJson.technical_vehicle ? $('#technicalVehicleEquipment').addClass('active btn-primary') : '';
//			this.selectedJson.commercial_vehicle ? $('#commercialVehicleEquipment').addClass('active btn-primary'): '';
//			this.selectedJson.small_material ? $('#smallMaterialEquipment').addClass('active btn-primary'): '';
//			this.selectedJson.fat_material ? $('#fatMaterialEquipment').addClass('active btn-primary'): '';
//
//		}
//		else{
//			$('#equipmentCatChoose button:first-child').addClass('active btn-primary');
//			$('#equipmentCatChoose button').removeClass('disabled');
//		}       
	},



	/** Display information in the Modal view
	*/
	modalDeleteEquipment: function(e){
		
		// Retrieve the ID of the categorie //
		this.setModel(e);

		$('#infoModalDeleteEquipment p').html(this.selectedJson.name);
		$('#infoModalDeleteEquipment small').html(this.selectedJson.marque);
	},
	
	

	/** Save Claimer Type
	*/
	saveEquipment: function(e) {		     
		e.preventDefault();	 
		
		input_service_id = null;
		selectView = app.views.selectListServicesView
		if ( selectView &&  selectView.getSelected() )
		   input_service_id = app.views.selectListServicesView.getSelected().toJSON().id;
		
		this.services = _.map($("#equipmentServices").sortable('toArray'), function(service){ return _(_(service).strRightBack('_')).toNumber(); });     
		 
		this.params = {	
			name 				: this.$('#equipmentName').val(),
			service				: input_service_id, //#Service owner
			service_ids			: [[6, 0, this.services]], //Service authorized for use equipment
			usage 				: this.$('#equipmentUsage').val(),
			marque 				: this.$('#equipmentMarque').val(),
			type 				: this.$('#equipmentType').val(),
			immat 				: this.$('#equipmentImmat').val(),
			cv 					: this.$('#equipmentCV').val(),
			year 				: this.$('#equipmentYear').val(),
			time 				: this.$('#equipmentTime').val(),
			km 					: this.$('#equipmentKm').val(),
			technical_vehicle 	:this.$('#technicalVehicleEquipment').hasClass('active'),
			commercial_vehicle 	:this.$('#commercialVehicleEquipment').hasClass('active'),
			small_material 		:this.$('#smallMaterialEquipment').hasClass('active'),
			fat_material 		:this.$('#fatMaterialEquipment').hasClass('active'),    
		 };
		 
		this.modelId = this.selectedJson==null?0: this.selectedJson.id;
		var self = this;
		
		app.Models.Equipment.prototype.save(
			this.params, 
			this.modelId, {
				success: function(data){
					console.log(data);
					if(data.error){
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else{
						if( self.modelId==0 )
							self.model = new app.Models.Equipment({id: data.result.result}); 

						self.params.service_ids = self.services;
						self.params.service = self.getIdInDropDown(app.views.selectListServicesView);
						self.model.update(self.params);
						app.collections.equipments.add(self.model);
						$('#modalSaveEquipment').modal('hide');
						app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.equipmentCreateOk);
						self.render();
					}
				},
				error: function(e){
					alert('Impossible de mettre à jour le site');
				}
		});
	},



	/** Delete the selected claimer type
	*/
	deleteEquipment: function(e){
		e.preventDefault();
		
		var self = this;
		this.model.delete({
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.equipments.remove(self.model);
					$('#modalDeleteEquipment').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.equipmentDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer l'équipment");
			}

		});
	},



	/**	Make visible or hide section in the for
	*/	
	accordionAddEquipmentForm: function(e){
		var button = $(e.target);

		$('#equipmentCatChoose button').removeClass('btn-primary');
		button.addClass('btn-primary');

		// If button has Class Vehicle //
		if(button.hasClass('vehicule')){
			$('#aboutEquipmentSection').slideUp();
			$('#aboutVehicleSection').slideDown();
		}
		else{
			$('#aboutVehicleSection').slideUp();
			$('#aboutEquipmentSection').slideDown();
		}
	},



	preventDefault: function(event){
		event.preventDefault();
	},
	
	initCollections: function(){
		if(_.isUndefined(this.collections)){this.collections = {};}
		if(_.isUndefined(this.collections.equipments)){this.collections.equipments = new app.Collections.Equipments();}
		else{this.collections.equipments.reset();}
		
		// Check the parameters //
		if(_.isUndefined(this.options.sort)){
			this.options.sort = this.collections.equipments.default_sort;
		}
		else{
			this.options.sort = app.Helpers.Main.calculPageSort(this.options.sort);	
		}
		this.options.page = app.Helpers.Main.calculPageOffset(this.options.page);


		// Create Fetch params //
		this.fetchParams = {
			silent : true,
			data   : {
				limit  : app.config.itemsPerPage,
				offset : this.options.page.offset,
				sort   : this.options.sort.by+' '+this.options.sort.order
			}
		};
		if(!_.isUndefined(this.options.search)){
			this.fetchParams.data.filters = app.Helpers.Main.calculSearch({search: this.options.search }, app.Models.Place.prototype.searchable_fields);
		}
		
		return $.when(this.collections.equipments.fetch(this.fetchParams))
		.fail(function(e){
			console.log(e)
		});
		
	},

});