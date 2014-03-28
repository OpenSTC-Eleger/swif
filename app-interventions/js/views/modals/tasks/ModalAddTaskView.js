/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'genericModalView',
	'advancedSelectBoxView',
	'multiSelectBoxUsersView',

	'tasksCollection',
	'taskModel',
	'categoriesTasksCollection',
	'equipmentsCollection',
	'placesCollection',
	'claimersServicesCollection',
	'teamModel',
	'teamsCollection',
	'officerModel',
	'officersCollection',

	'moment-timezone',
	'moment-timezone-data',

], function(app, GenericModalView, AdvancedSelectBoxView, MultiSelectBoxUsersView, TasksCollection, TaskModel, CategoriesTasksCollection, EquipmentsCollection, PlacesCollection, ClaimersServicesCollection, TeamModel, TeamsCollection, OfficerModel, OfficersCollection, moment){

	'use strict';



	/******************************************
	* Intervention Details View
	*/
	var ModalAddTaskView = GenericModalView.extend({


		templateHTML: '/templates/modals/tasks/modalAddTask.html',


		// The DOM events //
		events: function() {
			return _.defaults({
				'submit #formAddTask'         : 'saveTask',
				'click .linkRefueling'        : 'accordionRefuelingInputs',
			},
			GenericModalView.prototype.events);

		},



		/** View Initialization
		 */
		initialize: function (params) {
			this.create = false;
			this.options = params;
			this.modal = $(this.el);

			if(_.isUndefined(this.model)){
				this.model = new TaskModel();
				this.create = true;
			}

			this.render();
		},


		/** Display the view
		 */
		render: function () {


			var self = this;
			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var template = _.template(templateData, {lang: app.lang});
				var modelJSON = self.model.toJSON();

				self.modal.html(template);
				self.modal.modal('show');
				if(self.create){
					$(self.modal).find('input').prop('readonly',false);
					$(self.modal).find('button').prop('disabled',false);
				}
				else{
					$(self.modal).find('input').prop('readonly',true);
					$(self.modal).find('button').prop('disabled',true);
				}

				$('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });

				$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});

				// Display only categories in dropdown belongs to intervention //
				self.advancedSelectBoxCategoriesInterventionAddTaskView = new AdvancedSelectBoxView({el: $('#taskCategory'), url: CategoriesTasksCollection.prototype.url});

				self.advancedSelectBoxCategoriesInterventionAddTaskView.render();
				//Initialize Vehicle select2 box
				self.selectListVehicleView = new AdvancedSelectBoxView({el:'#taskEquipmentAdd', url: EquipmentsCollection.prototype.url});
				self.selectListVehicleView.render();

				self.taskEquipmentAddList = new AdvancedSelectBoxView({el:'#taskEquipmentAddList', url: EquipmentsCollection.prototype.url});
				self.taskEquipmentAddList.render();

				// Create the view to select the user who have done the task //
				self.multiSelectBoxUsersView = new MultiSelectBoxUsersView({el: '.multiSelectUsers'});


				self.initSearchParams();

				var mStartDate = moment();
				var mEndDate = moment();
				if(self.create){
					//init datetimes values with user timezone
					$('#startDate').val( mStartDate.format('L') );
					$('#endDate').val( mEndDate.format('L') );
					var tempStartDate = moment( mStartDate );
					tempStartDate.hours(8);
					tempStartDate.minutes(0);
					$('#startHour').timepicker( 'setTime', tempStartDate.format('LT') );
					var tempEndDate = moment( mEndDate );
					tempEndDate.hours(18);
					tempEndDate.minutes(0);
					$('#endHour').timepicker('setTime', tempEndDate.format('LT') );
				}
				else{


					$('#taskName').val(modelJSON.name);
					//init datetimes values with user timezone
					mStartDate = moment.utc(modelJSON.date_start).tz(app.current_user.getContext().tz);
					mEndDate = moment.utc(modelJSON.date_end).tz(app.current_user.getContext().tz);

					$('#startDate').val( mStartDate.format('L') );
					$('#endDate').val( mEndDate.format('L') );
					$('#startHour').timepicker( 'setTime', mStartDate.format('LT') );
					$('#endHour').timepicker('setTime', mEndDate.format('LT') );

					//init AdvancedSelectBox values
					self.advancedSelectBoxCategoriesInterventionAddTaskView.setSelectedItem(modelJSON.category_id);

					//equipments and vehicle values need to be retrieved separately
					if(modelJSON.equipment_ids.length>0){
						var vehicle = new EquipmentsCollection();
						var filter_ids = {field: 'id', operator: 'in', value:modelJSON.equipment_ids};
						var filter_type = {field: 'categ_id.is_vehicle', operator: '=', value: 'true'};
						var equipment_names = modelJSON.equipment_names.slice();

						//get vehicle, if present, in equipment_ids (first equipment described as vehicle)
						vehicle.fetch({data:{filters:{0:filter_ids,1:filter_type}}}).done(function(){
							if(vehicle.models.length>0){
								var vehicle_id = vehicle.models[0].get('id');
								var vehicle_names = null;
								_.each(equipment_names, function(item,i){
									if(item[0] === vehicle_id){
										//DEBUG
										if(vehicle_names !== null){
											console.log('Error: There is more than one vehicle linked to the task');
										}
										//remove vehicle from equipment_names and keep it for vehicle selectBox
										vehicle_names = equipment_names.splice(i,1)[0];
									}
								});
								self.selectListVehicleView.setSelectedItem(vehicle_names);
							}
							//format equipment_names to be used with AdvancedSelectBox
							_.each(equipment_names, function(item,i){
								equipment_names[i] = {id:item[0],name: item[1]};
							});
							self.taskEquipmentAddList.setSelectedItems(equipment_names);
						})
						.fail(function(e){
							console.log(e);
						});
					}
					var itemToLoad = modelJSON.team_id !== false ? 'teams' : 'officers';
					self.updateSelectListUsersTeams(itemToLoad);
				}
			});

			return this;
		},



		/** Save the Task
		*/
		saveTask: function(e){

			var self = this;

			e.preventDefault();

			var mNewDateStart = moment( $('#startDate').val(), 'DD-MM-YYYY')
									.add('hours',$('#startHour').val().split(':')[0] )
									.add('minutes',$('#startHour').val().split(':')[1] );
			var mNewDateEnd =  moment( $('#endDate').val(), 'DD-MM-YYYY')
									.add('hours',$('#endHour').val().split(':')[0] )
									.add('minutes',$('#endHour').val().split(':')[1] );

			var planned_hours = mNewDateEnd.diff(mNewDateStart, 'hours', true);

			var vehicle =  self.selectListVehicleView.getSelectedItem();
			var equipments = self.taskEquipmentAddList.getSelectedItems();

			if(vehicle && vehicle >0 ){
				equipments.push( vehicle );
			}
			equipments = [[6,0,equipments]];

			var params = {
				date_start     : mNewDateStart.toDate(),
				date_end       : mNewDateEnd.toDate(),
				state          : TaskModel.status.done.key,
				vehicule       : vehicle,
				equipment_ids  : equipments,
				name           : this.$('#taskName').val(),
				km             : this.$('#equipmentKmAdd').val(),
				oil_qtity      : this.$('#equipmentOilQtityAdd').val().replace(',', '.'),
				oil_price      : this.$('#equipmentOilPriceAdd').val().replace(',', '.'),
				category_id    : self.advancedSelectBoxCategoriesInterventionAddTaskView.getSelectedItem(),
				planned_hours  : planned_hours,
				remaining_hours: 0,
				report_hours   : planned_hours,
			};

			// TODO retrieve the value of the multiSelectBoxUsersView //
			var res = self.multiSelectBoxUsersView.getUserType();
			if(res.type == 'team'){
				params.user_id = false;
				params.team_id = res.value;
			}
			else{
				params.team_id = false;
				params.user_id = res.value;
			}


			var task_model = new TaskModel(params);

			task_model.save().done(function(data) {
				// add task to collection
				task_model.setId(data);
				task_model.fetch({silent : true}).done(function() {
					self.options.tasks.add(task_model);
					self.modal.modal('hide');
				}).fail(function(e) {
					console.log(e);
				});
			}).fail(function(e) {
				console.log(e);
			});
		},



		initSearchParams: function(){
			this.selectListVehicleView.setSearchParam({field:'categ_id.is_vehicle',operator:'=',value:'True'},true);
			this.selectListVehicleView.setSearchParam({field:'internal_use',operator:'=',value:'True'});

			this.taskEquipmentAddList.setSearchParam({field:'categ_id.is_equipment', operator:'=', value:'True'}, true);
			this.taskEquipmentAddList.setSearchParam({field:'internal_use',operator:'=',value:'True'});
		},



		/** Update filters on equipments and taskCategories according to officer / team selected
		*/
		changeOfficerTeam: function(value){
			var self = this;
			this.initSearchParams();
			if(value){
				var item = $('#taskSelectUsersTeams').data('item');
				//get model according to select button 'team/officer'
				var model = null;

				if(item === 'teams'){
					model = new TeamModel();
				}
				else{
					model = new OfficerModel();
				}
				//get service_ids of the model to filter equipments with it
				model.set('id',value);
				model.fetch().done(function(){
					//base filter for equipments
					var filterEquipment = {field: 'service_ids', operator:'=?', value:'False'};
					//if services_ids has a value: filter = ('service_ids' '=' false OR 'service_ids.ids' '=' services)
					//else: filter = ('service_ids' '=' false)
					if(model.get('service_ids').length > 0){
						var filter = {field: 'service_ids.id', operator:'in', value:model.get('service_ids')};
						self.selectListVehicleView.setSearchParam('|');
						self.selectListVehicleView.setSearchParam(filter);

						self.taskEquipmentAddList.setSearchParam('|');
						self.taskEquipmentAddList.setSearchParam(filter);

						self.advancedSelectBoxCategoriesInterventionAddTaskView.setSearchParam(filter,true);
					}
					self.selectListVehicleView.setSearchParam(filterEquipment);
					self.taskEquipmentAddList.setSearchParam(filterEquipment);

				});
			}
		},



		/** Display or Hide Refueling Section (Inputs Km, Oil, Oil prize)
		*/
		accordionRefuelingInputs: function(e){
			e.preventDefault();

			// Toggle Slide Refueling section //
			$('.refueling-vehicle').stop().slideToggle();
		}
	});

	return ModalAddTaskView;
});