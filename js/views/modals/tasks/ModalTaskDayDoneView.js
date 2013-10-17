/******************************************
 * Intervention Details View
 */
app.Views.ModalTaskDayDoneView = app.Views.GenericModalView.extend({

	//el : '#rowContainer',
	
	templateHTML: 'modals/tasks/modalTaskDayDone',

	
	// The DOM events //
	events: function() {
		return _.defaults({
			'submit #formTaskDone'   			: 'taskDone',
			'click .linkRefueling'				: 'accordionRefuelingInputs'
		},
		app.Views.GenericModalView.prototype.events);
		
	},

	/** View Initialization
	 */
	initialize: function () {
	    var self = this;
	    console.log("Daily Task Done modal view intialization");
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
			
			var template = _.template(templateData, {
				lang: app.lang,
				task: self.model,
				timeSpentDefault: self.secondsToHms(self.model.toJSON().remaining_hours * 60)
			});
			
			self.modal.html(template);
			self.modal.modal('show');

			self.selectedTaskJSON = self.model.toJSON();

			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
			
			//Display remainingTime if user clicked on "task unfinished"
			if(!self.options.taskDone){
				$('#remainingTimeSection').show();
			}
			else{
				$('#remainingTimeSection').hide();
			}
			
			// Filter Equipments / Vehicle by service of task's intervention
			var task_id = self.selectedTaskJSON.id;

			var interAssociated = new app.Models.Intervention();
			interAssociated.setId(self.selectedTaskJSON.project_id[0]);
			interAssociated.fetch({silent: true}).done(function(){
				
				self.selectListVehicleView = new app.Views.AdvancedSelectBoxView({el:'#taskEquipmentDone', collection:app.Collections.Equipments.prototype});
				self.selectListVehicleView.setSearchParam({field:'categ_id.is_vehicle',operator:'=',value:'True'},true);
				self.selectListVehicleView.setSearchParam({field:'internal_use',operator:'=',value:'True'});
				self.selectListVehicleView.setSearchParam('|');
				self.selectListVehicleView.setSearchParam({field:'service_ids',operator:'=?',value:'False'});
				self.selectListVehicleView.setSearchParam({field:'service_ids.id',operator:'=',value:interAssociated.toJSON().service_id[0]});
				
				self.selectListVehicleView.render();
			
				self.selectListEquipmentsDoneView = new app.Views.AdvancedSelectBoxView({el:'#taskEquipmentListDone', collection:app.Collections.Equipments.prototype});
				self.selectListEquipmentsDoneView.setSearchParam({field:'categ_id.is_equipment', operator:'=', value:'True'}, true);
				self.selectListEquipmentsDoneView.setSearchParam({field:'internal_use',operator:'=',value:'True'});
				self.selectListEquipmentsDoneView.setSearchParam('|');
				self.selectListEquipmentsDoneView.setSearchParam({field:'service_ids',operator:'=?',value: 'False'});
				self.selectListEquipmentsDoneView.setSearchParam({field:'service_ids.id',operator:'=',value:interAssociated.toJSON().service_id[0]});
			
				self.selectListEquipmentsDoneView.render();
			});		
		});
 
		return this;
    },

    
    /** Save Task as Done (create another one if timeRemaining set)
     */
    taskDone: function(e){
		e.preventDefault();
		var self = this;

		var vehicule =  this.selectListVehicleView.getSelectedItem();
		var equipments = this.selectListEquipmentsDoneView.getSelectedItems(); 
		
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
		
		var durationSpentHours = $('#eventTimeSpent').val().split(':');
		var mDurationSpentHours = moment.duration ( { hours:durationSpentHours[0], minutes:durationSpentHours[1] });
		var spent_hours = mDurationSpentHours.asHours();
		
		params = {
			equipment_ids: equipments,
			vehicule: vehicule,
			km: this.$('#equipmentKmDone').val(),
			oil_qtity: this.$('#equipmentOilQtityDone').val().replace(',', '.'),
			oil_price: this.$('#equipmentOilPriceDone').val().replace(',', '.'),
			report_hours: spent_hours,
			remaining_hours: remaining_hours,
		};

		this.model.save(params, {silent: true, patch: true, wait: true})
			.done(function(){
				//if task is "unfinished", must retrieve the newly created task with remainingHours
				$.when(
					self.model.fetch())
				.done(function(){
				self.modal.modal('hide');
				})
				.fail(function(e){
					console.log(e)
				});
				
			})
			.fail(function(e){
				console.log(e)
			});

	},
	/** Display or Hide Refueling Section (Inputs Km, Oil, Oil prize)
	*/
	accordionRefuelingInputs: function(e){
		e.preventDefault();

		// Toggle Slide Refueling section //
		$('.refueling-vehicle').stop().slideToggle();
	},
	
	secondsToHms : function (d) {
		d = Number(d);	
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);
		return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
	},
});

