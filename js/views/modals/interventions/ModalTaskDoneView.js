/******************************************
 * Intervention Details View
 */
app.Views.ModalTaskDoneView = app.Views.GenericModalView.extend({

	//el : '#rowContainer',
	
	templateHTML: 'modals/interventions/modalTaskDone',

	
	// The DOM events //
	events: function() {
		return _.defaults({
			'submit #formTaskDone'   			: 'taskDone',
			'click a.linkSelectUsersTeams'		: 'changeSelectListUsersTeams',
			'click .linkRefueling'				: 'accordionRefuelingInputs'
		},
		app.Views.GenericModalView.prototype.events);
		
	},

	/** View Initialization
	 */
	initialize: function () {
	    var self = this;
	    console.log("Task Done modal view intialization")
	    this.modal = $(this.el);
    	self.render();    
    },

    /** Display the view
     */
    render: function () {
		
		// Change the page title depending on the create value //
		app.router.setPageTitle(app.lang.viewsTitles.newTask);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);
		
		var self = this;
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			
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
			
			app.views.selectListOfficersTeamsView = new app.Views.AdvancedSelectBoxView({el:$('#selectUsersTeams'), collection: app.Collections.Officers.prototype});
			
			self.selectVehicleView = new app.Views.AdvancedSelectBoxView({el:'#taskEquipmentDone', collection:app.Collections.Equipments.prototype});
			self.selectListEquipmentsView = new app.Views.AdvancedSelectBoxView({el:'#taskEquipmentListDone', collection:app.Collections.Equipments.prototype});
			
			self.selectVehicleView.setSearchParam({field:'categ_id.is_vehicle', operator:'=', value:'True'}, true);
			self.selectListEquipmentsView.setSearchParam({field:'categ_id.is_equipment', operator:'=', value:'True'}, true);
			self.selectVehicleView.setSearchParam({field:'internal_use', operator:'=', value:'True'});
			self.selectListEquipmentsView.setSearchParam({field:'internal_use', operator:'=', value:'True'});

			if(hasService){

				app.views.selectListOfficersTeamsView.setSearchParam({field:'service_ids.id',operator:'=',value:self.options.inter.toJSON().service_id[0]}, true);
				
				self.selectVehicleView.setSearchParam('|');
				self.selectVehicleView.setSearchParam({field:'service_ids',operator:'=?',value:'False'});
				self.selectVehicleView.setSearchParam({field:'service_ids.id',operator:'=',value:self.options.inter.toJSON().service_id[0]});

				self.selectListEquipmentsView.setSearchParam('|');
				self.selectListEquipmentsView.setSearchParam({field:'service_ids',operator:'=?',value:'False'});
				self.selectListEquipmentsView.setSearchParam({field:'service_ids.id',operator:'=',value:self.options.inter.toJSON().service_id[0]});
			}
			
			self.selectVehicleView.render();
			self.selectListEquipmentsView.render();
			app.views.selectListOfficersTeamsView.render();
			
		});
 
		return this;
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
		var id = app.views.selectListOfficersTeamsView.getSelectedItem();

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

		params = {
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
		
		if(itemToLoad == 'officers'){
			$('#btnSelectUsersTeams > i.iconItem.icon-group').addClass('icon-user').removeClass('icon-group');
			$('#selectUsersTeams').data('item', 'officers');
			$('#selectUsersTeams').attr('data-placeholder', app.lang.actions.selectAAgentShort);
			
			app.views.selectListOfficersTeamsView.collection = app.Collections.Officers.prototype;
			app.views.selectListOfficersTeamsView.reset();
			app.views.selectListOfficersTeamsView.render();
		}
		else if(itemToLoad == 'teams'){
			$('#btnSelectUsersTeams > i.iconItem.icon-user').addClass('icon-group').removeClass('icon-user');
			$('#selectUsersTeams').data('item', 'teams');
			$('#selectUsersTeams').attr('data-placeholder', app.lang.actions.selectATeamShort);

			app.views.selectListOfficersTeamsView.collection = app.Collections.Teams.prototype;
			app.views.selectListOfficersTeamsView.reset();
			app.views.selectListOfficersTeamsView.render();
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

