define([
	'app',
	'appHelpers',

	'equipmentModel',
	'equipmentsCollection',
	'equipmentTypeModel',
	'equipmentsTypesCollection',
	'claimersServicesCollection',
	'claimersTypesCollection',
	
	'genericModalView',
	'advancedSelectBoxView',
	'bsDatepicker-lang'
	

], function(app, AppHelpers, EquipmentModel, EquipmentsCollection, EquipmentTypeModel, EquipmentsTypesCollection, ClaimersServicesCollection, ClaimersTypesCollection, GenericModalView, AdvancedSelectBoxView, datepicker){

	'use strict';


	/******************************************
	* Equipment Modal View
	*/
	var ModalEquipmentView = GenericModalView.extend({


		templateHTML : 'modals/modalEquipment',



		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formSaveEquipment'   : 'saveEquipment',
				'change #equipmentInternalUse': 'fillEquipmentInternalUse',
				'change #equipmentCategory'   : 'fillEquipmentCategory'
			}, 
				GenericModalView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			var self = this;

			this.modal = $(this.el);


			// Check if it's a create or an update //
			if(_.isUndefined(this.model)){

				this.model = new EquipmentModel();
				this.render();
			}
			else{
				// Render with loader //
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
				
				$('.make-switch').bootstrapSwitch();
				
				if(!loader){
					self.selectEquipmentCategory = new AdvancedSelectBoxView({el:'#equipmentCategory', collection: EquipmentsTypesCollection.prototype});
					self.selectEquipmentCategory.setSearchParam('|',true);
					self.selectEquipmentCategory.setSearchParam({field:'is_vehicle',operator:'=',value:true});
					self.selectEquipmentCategory.setSearchParam({field:'is_equipment',operator:'=',value:true});
					self.selectEquipmentCategory.render();

					self.selectEquipmentServicesInternalUse = new AdvancedSelectBoxView({el:'#equipmentServicesInternalUse', collection: ClaimersServicesCollection.prototype});
					self.selectEquipmentServicesInternalUse.resetSearchParams();
					self.selectEquipmentServicesInternalUse.render();
					//initialize value of internal_use and views updates linked with
					if(!_.isNull(self.model)){
						self.changeEquipmentInternalUse(self.model.getInternalUse());
					}
					
					self.selectEquipmentMaintenanceServices = new AdvancedSelectBoxView({el:'#equipmentMaintenanceServices', collection: ClaimersServicesCollection.prototype});
					self.selectEquipmentMaintenanceServices.render();
					
					self.selectEquipmentBookingServices = new AdvancedSelectBoxView({el: $("#equipmentBookingServices"), collection: ClaimersServicesCollection.prototype });
					self.selectEquipmentBookingServices.render();
					
					self.selectClaimersBookingServices = new AdvancedSelectBoxView({el: $("#equipmentBookingClaimers"), collection: ClaimersTypesCollection.prototype });
					self.selectClaimersBookingServices.render();
					
					// Enable the datePicker //
					$('input.datepicker').datepicker({ format: 'dd/mm/yyyy', weekStart: 1, autoclose: true, language: 'fr'});
				}

                console.log(app.menus);
                if (_.isUndefined(app.menus['openresa'])) {
                    $('#bookingTab').hide();
                }
				self.modal.modal('show');

			});

			return this;
		},
		


		/**
		 * if equipment category refers to an equipment or a vehicle, adapt labels of km, energy_type and immat
		 */
		changeEquipmentCategory: function(categ_id){
			var equipmentCateg = new EquipmentTypeModel();
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
			function formatDate(frDate){
				if(frDate != false && frDate != ''){
					return moment(frDate.replace('/','-'),'DD-MM-YYYY').format('YYYY-MM-DD');
				}
				else{
					return false;
				}
			}
			
			var params = {
					name: $('#equipmentName').val(),
					default_code: $('#equipmentCode').val(),
					categ_id: this.selectEquipmentCategory.getSelectedItem(),
					internal_use: $('#equipmentInternalUse').is(':checked'),
					service_ids: [[6,0,this.selectEquipmentServicesInternalUse.getSelectedItems()]],
					maintenance_service_ids: [[6,0,this.selectEquipmentMaintenanceServices.getSelectedItems()]],
					immat: $('#equipmentImmat').val(),
					marque: $('#equipmentMarque').val(),
					km: parseInt($('#equipmentKm').val().replace(' ','')),
					energy_type: $('#equipmentEnergy').val(),
	//				year: $('#equipmentYear').val(),
					built_date: formatDate($('#equipmentBuiltDate').val()),
					time: $('#equipmentTime').val(),
					length_amort: $('#equipmentLengthAmort').val(),
					purchase_date: formatDate($('#equipmentPurchaseDate').val()),
					purchase_price: $('#equipmentPurchasePrice').val(),
					hour_price: $('#equipmentHourPrice').val(),
					warranty_date: formatDate($('#equipmentWarranty').val()),
					internal_booking: $('#equipmentInternalBooking:checked').val() == "1",
					external_booking: $('#equipmentExternalBooking:checked').val() == "1",
					service_bookable_ids: [[6,0, this.selectEquipmentBookingServices.getSelectedItems() ]],
					partner_type_bookable_ids: [[6,0, this.selectClaimersBookingServices.getSelectedItems() ]],
					color: $('#displayColor').val(),
					block_booking: $('#equipmentBlockingBookable').bootstrapSwitch('state')

			}
			var stockQty = parseInt($('#equipmentQtyAvailable').val());

			this.model.save(params, {patch:!this.model.isNew(), silent:true,wait:true})
				.done(function(data) {
					self.modal.modal('hide');

					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : EquipmentsCollection.prototype.fields} }).done(function(){
							app.views.equipmentsListView.collection.add(self.model);
						})
					// Update mode //
					} else {
						self.model.fetch({ data : {fields : self.model.fields} });
					}
					if(stockQty != self.model.getAvailableQty()){
						self.model.updateAvailableQty(stockQty);
					}
					
				})
				.fail(function (e) {
					AppHelpers.printError(e);
				})
				.always(function () {
					$(self.el).find("button[type=submit]").button('reset');
				});
			
		}

	});

return ModalEquipmentView;

});