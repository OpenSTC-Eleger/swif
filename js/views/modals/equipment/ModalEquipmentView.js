/******************************************
* Place Modal View
*/
app.Views.ModalEquipmentView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/modalEquipment',



	// The DOM events //
	events: function(){
		return _.defaults({
			'submit #formSaveEquipment'   : 'saveEquipment',
			'change #equipmentInternalUse': 'fillEquipmentInternalUse',
			'change #equipmentCategory'   : 'fillEquipmentCategory'
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

			this.model = new app.Models.Equipment();
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
	render : function(loader) {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang     : app.lang,
				equipment: self.model,
				loader   : loader
			});

			self.modal.html(template);


			if(!loader){
				self.selectEquipmentCategory = new app.Views.AdvancedSelectBoxView({el:'#equipmentCategory', collection: app.Collections.EquipmentsTypes.prototype});
				self.selectEquipmentCategory.render();

				self.selectEquipmentServicesInternalUse = new app.Views.AdvancedSelectBoxView({el:'#equipmentServicesInternalUse', collection: app.Collections.ClaimersServices.prototype});
				self.selectEquipmentServicesInternalUse.render();

				self.selectEquipmentMaintenanceServices = new app.Views.AdvancedSelectBoxView({el:'#equipmentMaintenanceServices', collection: app.Collections.ClaimersServices.prototype});
				self.selectEquipmentMaintenanceServices.render();
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
	



	/** Save the model pass in the view
	*/
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
				self.model.fetch().done(function(){
					self.options.equipments.add(self.model);
				});
			}
			else{
				self.model.fetch();
			}
			self.modal.modal('hide');
		})
		.fail(function(e){
			console.log(e);
		});
		
	}
	
});