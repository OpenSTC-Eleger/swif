define([
	'app',
	'genericModalView',

	'officersCollection',
	'teamsCollection',
	'equipmentsCollection',

	'advancedSelectBoxView',

	'moment-timezone',
	'moment-timezone-data',
	'bsDatepicker-lang',
	'bsTimepicker',

], function(app, GenericModalView, OfficersCollection, TeamsCollection, EquipmentsCollection, AdvancedSelectBoxView, moment, momentTZ, datepicker, timepicker){

	'use strict';

	/******************************************
	* Intervention Details View
	*/
	var ModalTaskDoneView = GenericModalView.extend({


		templateHTML: '/templates/modals/interventions/modalTaskDone.html',


		// The DOM events //
		events: function() {
			return _.defaults({
				'submit #formTaskDone'   			: 'taskDone',
				'click a.linkSelectUsersTeams'		: 'changeSelectListUsersTeams',
				'click .linkRefueling'				: 'accordionRefuelingInputs'
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

				$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
				$(".datepicker").datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });

				$("#startDate").val(  moment().format('L') );
				$("#endDate").val( moment().format('L') );

				// Set Task Planned Hour //
				$("#startHour").timepicker('setTime', moment().format('LT') );
				$("#endHour").timepicker('setTime', moment().add('hour', self.selectedTaskJSON.planned_hours).format('LT') );

				//Display remainingTime if user clicked on "task unfinished"
				if(!self.options.taskDone){
					$('#remainingTimeSection').show();
				}
				else{
					$('#remainingTimeSection').hide();
				}

	//			// Filter Equipment and user/team by service on intervention's task //
				var task_id = self.selectedTaskJSON.id;

				var hasService = (self.options.inter.toJSON().service_id && !_.isUndefined(self.options.inter.toJSON().service_id));

				self.selectListOfficersTeamsView = new AdvancedSelectBoxView({ el:$('#selectUsersTeams'), url: OfficersCollection.prototype.url });

				self.selectVehicleView = new AdvancedSelectBoxView({ el:'#taskEquipmentDone', url: EquipmentsCollection.prototype.url });
				self.selectListEquipmentsView = new AdvancedSelectBoxView({ el:'#taskEquipmentListDone', url: EquipmentsCollection.prototype.url });

				self.selectVehicleView.setSearchParam({field:'categ_id.is_vehicle', operator:'=', value:'True'}, true);
				self.selectListEquipmentsView.setSearchParam({field:'categ_id.is_equipment', operator:'=', value:'True'}, true);
				self.selectVehicleView.setSearchParam({field:'internal_use', operator:'=', value:'True'});
				self.selectListEquipmentsView.setSearchParam({field:'internal_use', operator:'=', value:'True'});

				if(hasService){

					self.setSearchParamsOnUsersTeams();
					self.selectListOfficersTeamsView.setSearchParam({field:'id', operator:'>', value:'1'});

					self.selectVehicleView.setSearchParam('|');
					self.selectVehicleView.setSearchParam({field:'service_ids',operator:'=?',value:'False'});
					self.selectVehicleView.setSearchParam({field:'service_ids.id',operator:'=',value:self.options.inter.toJSON().service_id[0]});

					self.selectListEquipmentsView.setSearchParam('|');
					self.selectListEquipmentsView.setSearchParam({field:'service_ids',operator:'=?',value:'False'});
					self.selectListEquipmentsView.setSearchParam({field:'service_ids.id',operator:'=',value:self.options.inter.toJSON().service_id[0]});
				}

				self.selectVehicleView.render();
				self.selectListEquipmentsView.render();
				self.selectListOfficersTeamsView.render();

			});

			return this;
	    },

	    setSearchParamsOnUsersTeams: function(){
	    	if(this.options.inter.toJSON().service_id && !_.isUndefined(this.options.inter.toJSON().service_id)){
	    		this.selectListOfficersTeamsView.setSearchParam({field:'service_ids.id',operator:'=',value:this.options.inter.toJSON().service_id[0]}, true);
	    	}
		},

	    /** Save Task as Done (create another one if timeRemaining set)
	     */
	    taskDone: function(e){
			e.preventDefault();
			var self = this;

			if($('#selectUsersTeams').data('item') == 'officers'){
				var teamMode = false;

			}
			else{
				var teamMode = true;
			}

			//var id = $('#selectUsersTeams').val();
			var id = this.selectListOfficersTeamsView.getSelectedItem();

			// Retrieve Start Date and Start Hour //
			var mNewDateStart =  new moment( $("#startDate").val(),"DD-MM-YYYY")
									.add('hours',$("#startHour").val().split(":")[0] )
									.add('minutes',$("#startHour").val().split(":")[1] );

			// Retrieve Start Date and Start Hour //
			var mNewDateEnd =  new moment( $("#endDate").val(),"DD-MM-YYYY")
									.add('hours',$("#endHour").val().split(":")[0] )
									.add('minutes',$("#endHour").val().split(":")[1] );



			var vehicule =  this.selectVehicleView.getSelectedItem();
			var equipments = this.selectListEquipmentsView.getSelectedItems();

			if(vehicule >0 ){
				equipments.push( vehicule );
			}
			equipments = [[6,0,equipments]];

			if($('#remainingTimeSection').is(':visible')){
				var duration = $("#eventRemainingTime").val().split(":");
				var mDuration = moment.duration ( { hours:duration[0], minutes:duration[1] });
				var remaining_hours = mDuration.asHours();
			}
			else{
				remaining_hours = 0;
			}

			var params = {
				date_start: mNewDateStart.toDate(),
				date_end: mNewDateEnd.toDate(),
				team_id: teamMode ? id : 0,
				user_id: !teamMode ? id : 0,
				equipment_ids: equipments,
				vehicule: vehicule,
				km: this.$('#equipmentKmDone').val(),
				oil_qtity: this.$('#equipmentOilQtityDone').val().replace(',', '.'),
				oil_price: this.$('#equipmentOilPriceDone').val().replace(',', '.'),
				report_hours: mNewDateEnd.diff(mNewDateStart,'hours',true),
				remaining_hours: remaining_hours,
			};

			this.model.save(params, {silent: true, patch: true, wait: true})
				.done(function(){
					//if task is "unfinished", must retrieve the newly created task with remainingHours
					$.when(
						self.options.tasks.fetch({data: {filters:{0:{'field':'project_id.id',operator: '=', value: self.options.inter.toJSON().id} }}}),
						self.model.fetch())
					.done(function(){
					self.modal.modal('hide');
					self.options.inter.fetch();
					})
					.fail(function(e){
						console.log(e)
					});

				})
				.fail(function(e){
					console.log(e)
				});

		},


		/** Update the <select> list of Users or Teams in the Modal Task Done
		*/
		changeSelectListUsersTeams: function(e){
			e.preventDefault();
			var link = $(e.target);

			// Retrieve the item to refres - Users or Teams //
			if(link.is('a')){ var itemToLoad = link.data('item'); }
			else{ var itemToLoad = link.parent('a').data('item'); }

			this.selectedTaskJSON = this.model.toJSON();
			var filters = this.selectListOfficersTeamsView.searchParams;
			//first, re-init filters with default ones
			this.setSearchParamsOnUsersTeams();
			//update Advanced selectBox Params (placeholder, collection and filters) according to itemToLoad
			if(itemToLoad == 'officers'){
				$('#btnSelectUsersTeams > i.iconItem.fa-users').addClass('fa-user').removeClass('fa-users');
				$('#selectUsersTeams').data('item', 'officers');
				$('#selectUsersTeams').attr('data-placeholder', app.lang.actions.selectAAgentShort);

				this.selectListOfficersTeamsView.collection = OfficersCollection.prototype;
				//filter to remove administrator record
				this.selectListOfficersTeamsView.setSearchParam({field:'id', operator:'>',value:'1'});
				this.selectListOfficersTeamsView.reset();
				this.selectListOfficersTeamsView.render();
			}
			else if(itemToLoad == 'teams'){
				$('#btnSelectUsersTeams > i.iconItem.fa-user').addClass('fa-users').removeClass('fa-user');
				$('#selectUsersTeams').data('item', 'teams');
				$('#selectUsersTeams').attr('data-placeholder', app.lang.actions.selectATeamShort);

				this.selectListOfficersTeamsView.collection = TeamsCollection.prototype;
				this.selectListOfficersTeamsView.reset();
				this.selectListOfficersTeamsView.render();
			}

		},


		/** Display or Hide Refueling Section (Inputs Km, Oil, Oil prize)
		*/
		accordionRefuelingInputs: function(e){
			e.preventDefault();

			// Toggle Slide Refueling section //
			$('.refueling-vehicle').stop().slideToggle();
		},
	});
	return ModalTaskDoneView;
})
