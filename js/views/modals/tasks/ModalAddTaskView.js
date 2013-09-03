/******************************************
 * Intervention Details View
 */
app.Views.ModalAddTaskView = app.Views.GenericModalView.extend({

	//el : '#rowContainer',
	
	templateHTML: 'modals/tasks/modalAddTask',

	
	// The DOM events //
	events: function() {
		return _.defaults({
		'submit #formAddTask'          : 'saveTask',
		},
		app.Views.GenericModalView.prototype.events);
		
	},



	/** View Initialization
	 */
	initialize: function () {
	    var self = this;
	    console.log("Daily Add Task view intialization")
	    this.modal = $(this.el);
		this.model = new app.Models.Task();
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
			
			var template = _.template(templateData, {lang: app.lang});
			
			self.modal.html(template);
			self.modal.modal('show');
			$(".datepicker").datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });

			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
			
			// Display only categories in dropdown belongs to intervention //
			self.advancedSelectBoxCategoriesInterventionAddTaskView = new app.Views.AdvancedSelectBoxView({el: $("#taskCategory"), collection: app.Collections.CategoriesTasks.prototype}); 

			self.advancedSelectBoxCategoriesInterventionAddTaskView.render();
			//Initialize Vehicle select2 box
			self.selectListEquipmentsView = new app.Views.AdvancedSelectBoxView({el:'#taskEquipmentAdd', collection:app.Collections.Equipments.prototype});
			self.selectListEquipmentsView.setSearchParam('|', true);
			self.selectListEquipmentsView.setSearchParam({field:'technical_vehicle',operator:'=',value:'True'});
			self.selectListEquipmentsView.setSearchParam({field:'commercial_vehicle',operator:'=',value:'True'});
			self.selectListEquipmentsView.render();
			
			// Initialize equipment draggable list //
			$('#equipmentsAdd, #equipmentsListAdd').sortable({
				connectWith: 'ul.sortableEquipmentsList',
				dropOnEmpty: true,
				forcePlaceholderSize: true,
				forceHelperSize: true,
				placeholder: 'sortablePlaceHold',
				containment: '.equipmentsDroppableAreaAdd',
				cursor: 'move',
				opacity: '.8',
				revert: 300,
				receive: function(event, ui){
				}

			});
			
			$('#equipmentsListAdd').empty();
			$.ajax({
				url: '/api/open_object/users/' + app.models.user.getUID().toString() + '/available_equipments',
				success: function(data){
					// Display the remain materials //
					var nbRemainMaterials = 0;
					$('#equipmentsAdd').empty();
					for(i in data){
						
						nbRemainMaterials++;
						$('#equipmentsListAdd').append('<li id="equipment_'+data[i].id+'"><a href="#"><i class="icon-wrench"></i> '+ data[i].name + '-' + data[i].type + ' </a></li>');
					}
					$('#badgeNbEquipmentsAdd').html(nbRemainMaterials);			
				}
			});
			
			var mStartDate = moment();
			var mEndDate = moment();
			
			$("#startDate").val( mStartDate.format('L') );
	    	$("#endDate").val( mEndDate.format('L') );
			var tempStartDate = moment( mStartDate );
			tempStartDate.hours(8);
			tempStartDate.minutes(0);
			$("#startHour").timepicker( 'setTime', tempStartDate.format('LT') );
			var tempEndDate = moment( mEndDate );
			tempEndDate.hours(18);
			tempEndDate.minutes(0);
			$("#endHour").timepicker('setTime', tempEndDate.format('LT') );
		});
 
		return this;
    },

	/** Save the Task
	*/
	saveTask: function(e){

var self = this;

	e.preventDefault();
	
	var mNewDateStart =  new moment( $("#startDate").val(),"DD-MM-YYYY")
							.add('hours',$("#startHour").val().split(":")[0] )
							.add('minutes',$("#startHour").val().split(":")[1] );
	var mNewDateEnd =  new moment( $("#endDate").val(),"DD-MM-YYYY")
							.add('hours',$("#endHour").val().split(":")[0] )
							.add('minutes',$("#endHour").val().split(":")[1] );
	var planned_hours = mNewDateEnd.diff(mNewDateStart, 'hours', true);

    var vehicle =  self.selectListEquipmentsView.getSelectedItem();
	var equipments = _.map($("#equipmentsAdd").sortable('toArray'), function(equipment){ return _(_(equipment).strRightBack('_')).toNumber(); }); 
    
    if(vehicle && vehicle >0 ){
    	equipments.push( vehicle );
    }
     
	var params = {
		user_id:  app.models.user.getUID(),
		date_start: mNewDateStart.toDate(),
		date_end: mNewDateEnd.toDate(),
		state: app.Models.Task.status.done.key,
		vehicule: vehicle,
		equipment_ids: equipments,
		name: this.$('#taskName').val(),
		km: this.$('#equipmentKmAdd').val(),
		oil_qtity: this.$('#equipmentOilQtityAdd').val().replace(',', '.'),
		oil_price: this.$('#equipmentOilPriceAdd').val().replace(',', '.'),
		category_id: self.advancedSelectBoxCategoriesInterventionAddTaskView.getSelectedItem(),	         
		planned_hours: planned_hours,
		remaining_hours: 0,
	    report_hours: planned_hours,
	};
	
	var task_model = new app.Models.Task(params);

	task_model.save().done(function(data) {
		// add task to collection
		task_model.setId(data);
		task_model.fetch({silent : true}).done(function() {
			self.options.tasks.add(task_model);
			self.modal.modal('hide');
		}).fail(function(e) {
			console.log(e)
		})
	}).fail(function(e) {
		console.log(e)
	})
	},
	
	/** Display or Hide Refueling Section (Inputs Km, Oil, Oil prize)
	*/
	accordionRefuelingInputs: function(e){
		e.preventDefault();

		// Toggle Slide Refueling section //
		$('.refueling-vehicle').stop().slideToggle();
	},
});