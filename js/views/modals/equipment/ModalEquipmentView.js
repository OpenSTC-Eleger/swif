/******************************************
* Place Modal View
*/
app.Views.ModalEquipmentView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/modalEquipment',



	// The DOM events //
	events: function(){
		return _.defaults({
				'change #equipmentInternalUse' : 'fillEquipmentInternalUse',
				'submit #formSaveEquipment'		: 'saveEquipment',
				'change #equipmentCategory'			: 'fillEquipmentCategory'
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
			this.create = true;
			this.model = new app.Models.Equipment();
			this.render();
		}
		else{
			// Render with loader //
			this.render(true);
		}

	},
	
	/** Display the view
	*/
	render : function(loader) {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang  : app.lang,
				equipment : self.model.toJSON(),
				loader: loader,
				createMode: self.create
			});

			self.modal.html(template);
			self.selectEquipmentCategory = new app.Views.AdvancedSelectBoxView({el:'#equipmentCategory', collection: app.Collections.EquipmentsTypes.prototype});
			self.selectEquipmentCategory.render();
			
			self.selectEquipmentServicesInternalUse = new app.Views.AdvancedSelectBoxView({el:'#equipmentServicesInternalUse', collection: app.Collections.ClaimersServices.prototype});
			self.selectEquipmentServicesInternalUse.render();
			
			self.selectEquipmentMaintenanceServices = new app.Views.AdvancedSelectBoxView({el:'#equipmentMaintenanceServices', collection: app.Collections.ClaimersServices.prototype});
			self.selectEquipmentMaintenanceServices.render();
			if(!self.create){
				var modelJSON = self.model.toJSON();
				self.selectEquipmentCategory.setSelectedItem(modelJSON.categ_id);
				
				$('#equipmentInternalUse').prop('checked', modelJSON.internal_use);
				self.changeEquipmentInternalUse(modelJSON.internal_use);
				var service_names = [];
				_.each(modelJSON.service_names, function(service, i){
					service_names.push({id:service[0], name:service[1]});
				});
				var maintenance_service_names = []; 
				_.each(modelJSON.maintenance_service_names, function(service, i){
					maintenance_service_names.push({id:service[0], name:service[1]});
				});
				
				
				self.selectEquipmentServicesInternalUse.setSelectedItems(service_names);
				self.selectEquipmentMaintenanceServices.setSelectedItems(maintenance_service_names);
				if(modelJSON.categ_id){
					self.changeEquipmentCategory(modelJSON.categ_id[0]);
				}
			}

			self.modal.modal('show');
		});

		return this;
	},
	
	/**
	 * if equipment category refers to an equipment or a vehicle, adapt labels of km, energy_type and immat
	 */
	changeEquipmentCategory: function(categ_id){
		var equipmentCateg = new app.Models.EquipmentType();
		equipmentCateg.set('id', categ_id);
		equipmentCateg.fetch({silent:true}).done(function(){
			if(equipmentCateg.toJSON().is_equipment){
				$('#equipmentKmBlock').css({display:'none'});
				$('#equipmentEnergyLabel').html(app.lang.energy + ':');
				$('#equipmentImmatLabel').html(app.lang.serialNumber + ':');
			}
			else{
				$('#equipmentKmBlock').css({display:'block'});
				$('#equipmentEnergyLabel').html(app.lang.oil + ':');
				$('#equipmentImmatLabel').html(app.lang.immat + ':');

			}
		})
		.fail(function(e){
			console.log(e);
		});
	},
	
	fillEquipmentCategory: function(e){
		this.changeEquipmentCategory(this.selectEquipmentCategory.getSelectedItem());
	},
	
	changeEquipmentInternalUse: function(value){
		if(value){
			$('#labelForEquipmentServicesInternalUse').css('text-decoration','none');
			$('#equipmentServicesInternalUse').removeAttr('disabled');
		}
		else{
			$('#labelForEquipmentServicesInternalUse').css('text-decoration','line-through');
			this.selectEquipmentServicesInternalUse.reset();
			$('#equipmentServicesInternalUse').attr({disabled: 'disabled'});
		}
		this.selectEquipmentServicesInternalUse.render();
	},
	
	fillEquipmentInternalUse: function(e){
		this.changeEquipmentInternalUse($(e.target).is(':checked'));
	},
	
	saveEquipment: function(e){
		e.preventDefault();
		var self = this;
		
		params = {
				name: $('#equipmentName').val(),
				default_code: $('#equipmentCode').val(),
				categ_id: this.selectEquipmentCategory.getSelectedItem(),
				internal_use: $('#equipmentInternalUse').is(':checked'),
				service_ids: [[6,0,this.selectEquipmentServicesInternalUse.getSelectedItems()]],
				maintenance_service_ids: [[6,0,this.selectEquipmentMaintenanceServices.getSelectedItems()]],
				immat: $('#equipmentImmat').val(),
				marque: $('#equipmentMarque').val(),
				km: $('#equipmentKm').val(),
				energy_type: $('#equipmentEnergy').val(),
				year: $('#equipmentYear').val(),
				time: $('#equipmentTime').val(),
				length_amort: $('#equipmentLengthAmort').val(),
				purchase_price: $('#equipmentPurchasePrice').val(),
//				hour_price: $('#equipmentHourPrice').val(),
//				warranty: $('#equipmentWarranty').val(),
		}
		this.model.save(params,{patch:!this.create, silent:true, wait:true}).done(function(data){
			if(self.create){
				self.model.set('id', data, {silent:true});
				self.options.equipments.add(self.model);
			}
			else{
				self.model.fetch();
			}
			self.modal.modal('hide');
		})
		.fail(function(e){
			console.log(e);
		});
		
		
	},
	
});