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
			
			var template = _.template(templateData, {lang: app.lang, task: self.model.toJSON(),timeSpentDefault: self.secondsToHms(self.model.toJSON().remaining_hours * 60)});
			
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
			
			$('#equipmentsDone, #equipmentsListDone').sortable({
				connectWith: 'ul.sortableEquipmentsList',
				dropOnEmpty: true,
				forcePlaceholderSize: true,
				forceHelperSize: true,
				placeholder: 'sortablePlaceHold',
				containment: '.equipmentsDroppableAreaDone',
				cursor: 'move',
				opacity: '.8',
				revert: 300,
				receive: function(event, ui){
				}

			});
			
//			// Filter Equipment by service on intervention's task //
			var task_id = self.selectedTaskJSON.id;

			var interAssociated = new app.Models.Intervention();
				interAssociated.setId(self.selectedTaskJSON.project_id[0]);
				interAssociated.fetch({silent: true}).done(function(){
				app.views.selectListEquipmentsView = new app.Views.AdvancedSelectBoxView({el:'#taskEquipmentDone', collection:app.Collections.Equipments.prototype});
				
				app.views.selectListEquipmentsView.setSearchParam('&', true);
				app.views.selectListEquipmentsView.setSearchParam('|');
				app.views.selectListEquipmentsView.setSearchParam({field:'technical_vehicle',operator:'=',value:'True'});
				app.views.selectListEquipmentsView.setSearchParam({field:'commercial_vehicle',operator:'=',value:'True'});
				app.views.selectListEquipmentsView.setSearchParam({field:'service_ids.id',operator:'=',value:interAssociated.toJSON().service_id[0]});
				
				app.views.selectListEquipmentsView.render();
			});
			
			
			
			// Search only materials //
			$('#equipmentsListDone').empty();
			$.ajax({
				url: '/api/openstc/tasks/' + task_id.toString() + '/available_equipments',
				success: function(data){
					// Display the remain materials //
					var nbRemainMaterials = 0;
					$('#equipmentsListDone').empty();
					for(i in data){
						
						nbRemainMaterials++;
						$('#equipmentsListDone').append('<li id="equipment_'+data[i].id+'"><a href="#"><i class="icon-wrench"></i> '+ data[i].name + '-' + data[i].type + ' </a></li>');
					}
					$('#badgeNbEquipmentsDone').html(nbRemainMaterials);			
				}
			});
			
		});
 
		return this;
    },

    
    /** Save Task as Done (create another one if timeRemaining set)
     */
    taskDone: function(e){
		e.preventDefault();
		var self = this;

		var vehicule =  app.views.selectListEquipmentsView.getSelectedItem();
		var equipments = _.map($("#equipmentsDone").sortable('toArray'), function(equipment){ return _(_(equipment).strRightBack('_')).toNumber(); }); 
		
		if(vehicule >0 ){
			equipments.push( vehicule );
		}

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

