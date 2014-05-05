/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'genericModalView',

	'officersCollection',
	'teamsCollection',
	'equipmentsCollection',
	'claimersCollection',

	'advancedSelectBoxView',
	'multiSelectBoxUsersView',

	'moment-timezone',
	'moment-timezone-data',
	'bsDatepicker-lang',
	'bsTimepicker',

], function(app, GenericModalView, OfficersCollection, TeamsCollection, EquipmentsCollection, ClaimersCollection, AdvancedSelectBoxView, MultiSelectBoxUsersView, moment){

	'use strict';

	/******************************************
	* Intervention Details View
	*/
	var ModalTaskDoneView = GenericModalView.extend({


		templateHTML: '/templates/modals/interventions/modalTaskDone.html',


		// The DOM events //
		events: function() {
			return _.defaults({
				'submit #formTaskDone'        : 'taskDone',
				'click .linkRefueling'        : 'accordionRefuelingInputs',

				'changeDate #startDate'       : 'startDateChange'
			},
			GenericModalView.prototype.events);

		},

		/** View Initialization
		 */
		initialize: function (params) {
			var self = this;

			this.options = params;

			this.modal = $(this.el);
			self.render();
		},



		/** Display the view
		 */
		render: function () {

			// Change the page title depending on the create value //
			app.router.setPageTitle(app.lang.viewsTitles.newTask);


			var self = this;
			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){

				var template = _.template(templateData, {lang: app.lang, task: self.model.toJSON(), inter: self.options.inter});

				self.modal.html(template);
				self.modal.modal('show');

				self.selectedTaskJSON = self.model.toJSON();

				$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: false, showInputs: false, modalBackdrop: false});
				$('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr', todayHighlight: true });

				$('#startDate').val(  moment().format('L') );
				$('#endDate').val( moment().format('L') );

				// Set Task Planned Hour //
				$('#startHour').timepicker('setTime', moment().format('LT') );
				$('#endHour').timepicker('setTime', moment().add('hour', self.selectedTaskJSON.planned_hours).format('LT') );

				//Display remainingTime if user clicked on "task unfinished"
				if(!self.options.taskDone){
					$('#remainingTimeSection').show();
				}
				else{
					$('#remainingTimeSection').hide();
				}

				// Filter Equipment and user/team by service on intervention's task //
				var hasService = (self.options.inter.toJSON().service_id && !_.isUndefined(self.options.inter.toJSON().service_id));

				// Create the view to select the user who have done the task //
				self.multiSelectBoxUsersView = new MultiSelectBoxUsersView({el: '.multiSelectUsers', serviceID: self.options.inter.getService('id')});
				self.multiSelectBoxUsersView.off().on('userType-change', function(){ self.serviceCostSection(); });

				self.selectVehicleView = new AdvancedSelectBoxView({ el:'#taskEquipmentDone', url: EquipmentsCollection.prototype.url });
				self.selectListEquipmentsView = new AdvancedSelectBoxView({ el:'#taskEquipmentListDone', url: EquipmentsCollection.prototype.url });

				self.selectVehicleView.setSearchParam({field:'categ_id.is_vehicle', operator:'=', value:'True'}, true);
				self.selectListEquipmentsView.setSearchParam({field:'categ_id.is_equipment', operator:'=', value:'True'}, true);
				self.selectVehicleView.setSearchParam({field:'internal_use', operator:'=', value:'True'});
				self.selectListEquipmentsView.setSearchParam({field:'internal_use', operator:'=', value:'True'});


				if(hasService){
					self.selectVehicleView.setSearchParam('|');
					self.selectVehicleView.setSearchParam({field:'service_ids',operator:'=?',value:'False'});
					self.selectVehicleView.setSearchParam({field:'service_ids.id',operator:'=',value:self.options.inter.toJSON().service_id[0]});

					self.selectListEquipmentsView.setSearchParam('|');
					self.selectListEquipmentsView.setSearchParam({field:'service_ids',operator:'=?',value:'False'});
					self.selectListEquipmentsView.setSearchParam({field:'service_ids.id',operator:'=',value:self.options.inter.toJSON().service_id[0]});
				}

				self.selectVehicleView.render();
				self.selectListEquipmentsView.render();

			});

			return this;
		},



		/** Save Task as Done (create another one if timeRemaining set)
		*/
		taskDone: function(e){
			e.preventDefault();
			var self = this;

			// Retrieve Start Date and Start Hour //
			var mNewDateStart =  moment( $('#startDate').val(),'DD-MM-YYYY')
									.add('hours', $('#startHour').val().split(':')[0] )
									.add('minutes', $('#startHour').val().split(':')[1] );

			// Retrieve Start Date and Start Hour //
			var mNewDateEnd =  moment( $('#endDate').val(),'DD-MM-YYYY')
									.add('hours', $('#endHour').val().split(':')[0] )
									.add('minutes', $('#endHour').val().split(':')[1] );


			var vehicule =  this.selectVehicleView.getSelectedItem();
			var equipments = this.selectListEquipmentsView.getSelectedItems();

			if(vehicule > 0 ){
				equipments.push( vehicule );
			}
			equipments = [[6,0,equipments]];

			var remaining_hours;
			if($('#remainingTimeSection').is(':visible')){
				var duration = $('#eventRemainingTime').val().split(':');
				var mDuration = moment.duration ( { hours:duration[0], minutes:duration[1] });
				remaining_hours = mDuration.asHours();
			}
			else{
				remaining_hours = 0;
			}

			var params = {
				date_start     : mNewDateStart.toDate(),
				date_end       : mNewDateEnd.toDate(),
				equipment_ids  : equipments,
				vehicule       : vehicule,
				km             : this.$('#equipmentKmDone').val(),
				oil_qtity      : this.$('#equipmentOilQtityDone').val().replace(',', '.'),
				oil_price      : this.$('#equipmentOilPriceDone').val().replace(',', '.'),
				report_hours   : mNewDateEnd.diff(mNewDateStart,'hours',true),
				remaining_hours: remaining_hours,
			};

			var res = self.multiSelectBoxUsersView.getUserType();
			if(res.type == TeamsCollection.prototype.key){
				params.user_id = false;
				params.partner_id = false;
				params.team_id = res.value;
			}
			else if(res.type == OfficersCollection.prototype.key){
				params.team_id = false;
				params.partner_id = false;
				params.user_id = res.value;
			}
			else if(res.type == ClaimersCollection.prototype.key){
				params.team_id = false;
				params.user_id = false;
				params.partner_id = res.value;
			}


			this.model.save(params, {silent: true, patch: true, wait: true})
				.done(function(){
					//if task is "unfinished", must retrieve the newly created task with remainingHours
					$.when(
						self.options.tasks.fetch({data: {filters:{0:{'field':'project_id.id', operator: '=', value: self.options.inter.toJSON().id} }}}),
						self.model.fetch())
					.done(function(){
						self.modal.modal('hide');
						self.options.inter.fetch();
					})
					.fail(function(e){
						console.log(e);
					});

				})
				.fail(function(e){
					console.log(e);
				});

		},



		/** Display or Hide Refueling Section (Inputs Km, Oil, Oil prize)
		*/
		accordionRefuelingInputs: function(e){
			e.preventDefault();


			// Toggle Slide Refueling section //
			$('.refueling-vehicle').stop().slideToggle();
		},



		/** Adjust end date field when start date change
		*/
		startDateChange: function(e){
			var sDate = $(e.currentTarget).datepicker('getDate');
			$('#endDate').datepicker('setStartDate', sDate);
			$('#endDate').datepicker('setDate', sDate);
		},


		/** Function trigger when the user type change
		* If the user type == provider the field service cost price appear
		*/
		serviceCostSection: function(){
			var t = this.multiSelectBoxUsersView.getUserType();

			if(t.type == ClaimersCollection.prototype.key){
				$('#serviceCostSection').stop().slideDown();
			}
			else{
				$('#serviceCostSection').stop().slideUp();
			}

		}

	});

	return ModalTaskDoneView;
});