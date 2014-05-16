/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'taskModel',
	'categoriesTasksCollection',
	'officersCollection',
	'teamsCollection',
	'equipmentsCollection',
	'claimersCollection',

	'genericModalView',
	'advancedSelectBoxView',
	'multiSelectBoxUsersView',
	'consumablesSelectView',

	'moment-timezone',
	'moment-timezone-data',
	'bsDatepicker-lang',
	'bsTimepicker',

], function(app, TaskModel, CategoriesTasksCollection, OfficersCollection, TeamsCollection, EquipmentsCollection,ClaimersCollection, GenericModalView, AdvancedSelectBoxView, MultiSelectBoxUsersView, ConsumablesSelectView, moment){
	
	'use strict';


	/******************************************
	 * Intervention Details View
	 */
	var ModalInterventionAddTaskView = GenericModalView.extend({


		templateHTML: '/templates/modals/interventions/modalInterventionAddTask.html',


		// The DOM events //
		events: function() {
			return _.defaults({
				'submit #formAddTask'   : 'saveTask',
				'changeDate #startDate'       : 'startDateChange'
			},

			GenericModalView.prototype.events);
		},



		/** View Initialization
		 */
		initialize: function (params) {
			this.options = params;
			if( _.isUndefined( this.model )){
				this.model = new TaskModel();
			}
			this.modal = $(this.el);
			if(!_.isUndefined(this.options.inter)){
				this.inter = this.options.inter;
			}
			this.render();
		},


		/** Display the view
		 */
		render: function () {
			//self.collection = this.collection;
			var self = this;
			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var template = _.template(templateData,{lang: app.lang,inter: self.inter,});

				self.modal.html(template);
				self.modal.modal('show');

				$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});

				// Display only categories in dropdown belongs to intervention //
				var interJSON = self.options.inter.toJSON();
				app.views.advancedSelectBoxCategoriesInterventionAddTaskView = new AdvancedSelectBoxView({ el: $('#taskCategory'), url: CategoriesTasksCollection.prototype.url });

				if(interJSON.service_id.length > 0){
					app.views.advancedSelectBoxCategoriesInterventionAddTaskView.setSearchParam({field: 'service_ids.id',operator: '=','value': interJSON.service_id[0]}, true);
				}

				app.views.advancedSelectBoxCategoriesInterventionAddTaskView.render();
				
				//_.isUndefined(self.inter)?app.lang.carryOutBy:app.lang.assignedTo
				// Create the view to select the user who have done the task //
				self.multiSelectBoxUsersView = new MultiSelectBoxUsersView({el: '.multiSelectUsers',serviceID: self.options.inter.getService('id'), label : _.isUndefined(self.inter)?app.lang.carryOutBy:app.lang.assignedTo});
				self.multiSelectBoxUsersView.off().on('userType-change', function(){ self.serviceCostSection(); });
				
				//Vehicles and equipments
				self.selectVehicleView = new AdvancedSelectBoxView({ el:'#taskEquipmentDone', url: EquipmentsCollection.prototype.url });
				self.selectListEquipmentsView = new AdvancedSelectBoxView({ el:'#taskEquipmentListDone', url: EquipmentsCollection.prototype.url });

				self.selectVehicleView.setSearchParam({field:'categ_id.is_vehicle', operator:'=', value:'True'}, true);
				self.selectListEquipmentsView.setSearchParam({field:'categ_id.is_equipment', operator:'=', value:'True'}, true);
				self.selectVehicleView.setSearchParam({field:'internal_use', operator:'=', value:'True'});
				self.selectListEquipmentsView.setSearchParam({field:'internal_use', operator:'=', value:'True'});
				
				self.selectVehicleView.render();
				self.selectListEquipmentsView.render();



				
				if(_.isUndefined(self.inter)){
					//Init Dates and times components
					$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: false, showInputs: false, modalBackdrop: false});
					$('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr', todayHighlight: true });
	
					$('#startDate').val(  moment().format('L') );
					$('#endDate').val( moment().format('L') );
	
					// Set Task Planned Hour //
					$('#startHour').timepicker('setTime', moment().format('LT') );
					$('#endHour').timepicker('setTime', moment().format('LT') );
					$('blockquote').hide();
					
					var hasService = (self.inter.toJSON().service_id && !_.isUndefined(self.inter.toJSON().service_id));
					
					if(hasService){
						self.selectVehicleView.setSearchParam('|');
						self.selectVehicleView.setSearchParam({field:'service_ids',operator:'=?',value:'False'});
						self.selectVehicleView.setSearchParam({field:'service_ids.id',operator:'=',value:self.options.inter.toJSON().service_id[0]});
	
						self.selectListEquipmentsView.setSearchParam('|');
						self.selectListEquipmentsView.setSearchParam({field:'service_ids',operator:'=?',value:'False'});
						self.selectListEquipmentsView.setSearchParam({field:'service_ids.id',operator:'=',value:self.options.inter.toJSON().service_id[0]});
					}
					// Create the consumables view //
					self.consumablesSelectView = new ConsumablesSelectView({el: '#consumablesSection'});

				}
				else{
					$('#startDate').attr("required",false);
					$('#startDate').closest('.form-group').hide();
					$('#endDate').attr("required",false);
					$('#endDate').closest('.form-group').hide();
					$('#startHour').attr("required",false);
					$('#startHour').closest('.form-group').hide();
					$('#endHour').attr("required",false);
					$('#endHour').closest('.form-group').hide();
					
					// Create the consumables view //
					self.consumablesSelectView = new ConsumablesSelectView({el: '#consumablesSection', serviceID: self.inter.getService('id')});
				}
			});

			return this;
		},



		getIdInDopDown: function(view) {
			if( view && view.getSelected() ){
				return view.getSelected().toJSON().id;
			}
			else{
				return 0;
			}
		},



		/** Save the Task
		*/
		saveTask: function(e){
			var self = this;

			e.preventDefault();



			
			var vehicule =  this.selectVehicleView.getSelectedItem();
			var equipments = this.selectListEquipmentsView.getSelectedItems();

			if(vehicule > 0 ){
				equipments.push( vehicule );
			}
			equipments = [[6,0,equipments]];

			var params = {
				

				equipment_ids  : equipments,
				vehicule       : vehicule,
				name: this.$('#taskName').val(),
				category_id: app.views.advancedSelectBoxCategoriesInterventionAddTaskView.getSelectedItem(),
				
				consumables    : this.consumablesSelectView.getConsumables()
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
			
			if( this.inter ){
				var duration = $('#taskHour').val().split(':');
				var mDuration = moment.duration ( { hours:duration[0], minutes:duration[1] });
				params.planned_hours = mDuration.asHours();
				params.project_id = this.inter.toJSON();
			}
			else{
				// Retrieve Start Date and Start Hour //
				var mNewDateStart =  moment( $('#startDate').val(),'DD-MM-YYYY')
										.add('hours', $('#startHour').val().split(':')[0] )
										.add('minutes', $('#startHour').val().split(':')[1] );

				// Retrieve Start Date and Start Hour //
				var mNewDateEnd =  moment( $('#endDate').val(),'DD-MM-YYYY')
										.add('hours', $('#endHour').val().split(':')[0] )
										.add('minutes', $('#endHour').val().split(':')[1] );
				
				params.date_start = mNewDateStart.toDate();
				params.date_end = mNewDateEnd.toDate();
			}


			
			

			
			this.model.save(params, {silent: true}).done(function(data){
				self.model.setId(data, {silent: true});
				self.model.fetch().done(function(){
					if(!_.isUndefined(self.options.tasks)){
						self.options.tasks.add(self.model);
					}
				});

				//force re-calculation asynchronously of intervention to update functional fields (planned_hours for example)
				self.options.inter.fetch();
				$('#modalAddTask').modal('hide');
			})
			.fail(function(e){
				console.log(e);
			});
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

	return ModalInterventionAddTaskView;
});