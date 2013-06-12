/******************************************
* Task List View
*/
app.Views.TasksListView = Backbone.View.extend({
	
	el : '#rowContainer',

	templateHTML: 'tasksList',

	filters: 'tasksListFilter',

	numberListByPage: 25,


	// The DOM events //
	events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',
		'click ul.sortable li'			: 'preventDefault',
		
		'click .btn.addTask'            : 'displayModalAddTask',
		'submit #formAddTask'         	: 'saveTask',

		'click a.taskNotDone' 			: 'taskNotDone',

		'click .buttonTimeSpent'		: 'setModalTimeSpent',
		'submit #formTimeSpent'    		: 'saveTimeSpent',

		'click .buttonTaskDone'			: 'setModalTaskDone',
		'submit #formTaskDone'    		: 'saveTaskDone',
		
		'change .taskEquipment'			: 'fillDropdownEquipment',

		'click .linkRefueling'			: 'accordionRefuelingInputs', 

		'change #filterListAgents' 		: 'setFilter'
	},



	/** View Initialization
	*/
	initialize: function () {

	},

	

	/** Display the view
	*/
	render: function () {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.tasksList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		var officer = app.models.user;
		var officer_id = officer.get('uid');
		
		var tasks = app.collections.tasks.toJSON();
		
//		tasks = _.sortBy(tasks, function(item){ 
//			return [-item.state,-item.date_start]; 
//		});


		// Retrieve the year - If not exist in the URL set as the current year //
		if(typeof(this.options.yearSelected) == 'undefined'){
			yearSelected = moment().year();
		}
		else{
			yearSelected = this.options.yearSelected;	
		}

		// Retrieve the week of the year - - If not exist in the URL set as the current week ////
		if(typeof(this.options.weekSelected) == 'undefined'){
			weekSelected = moment().week();
		}
		else{
			weekSelected = this.options.weekSelected;
		}
		
		var momentDate = moment().year(yearSelected).week(weekSelected);



		// Filter on the Tasks //
		var tasksUser = _.filter(tasks, function(task){			
			return task.active == true;
		});




		//  Collection Task Filter if not null //
		if(sessionStorage.getItem(this.filters) != null){
			tasksUser = _.filter(tasksUser, function(item){ 
				return item.user_id[0] == sessionStorage.getItem(self.filters);
			});
		}


		// Create table for each day //
		var mondayTasks =[]; 	var tuesdayTasks =[];
		var wednesdayTasks =[]; var thursdayTasks =[];
		var fridayTasks =[]; 	var saturdayTasks =[]; 
		var sundayTasks =[];

		var nbPendingTasks = 0;


		// Fill the tables with the tasks //
		_.each(tasksUser, function(task, i){

			// Don't display the task with absent state - congé //
			if(task.state != app.Models.Task.state[5].value){

				if(momentDate.clone().isSame(task.date_start, 'week')){
					if(momentDate.clone().day(1).isSame(task.date_start, 'day')){
						mondayTasks.push(task);
					}
					else if(momentDate.clone().day(2).isSame(task.date_start, 'day')){
						tuesdayTasks.push(task);
					}
					else if(momentDate.clone().day(3).isSame(task.date_start, 'day')){
						wednesdayTasks.push(task);
					}
					else if(momentDate.clone().day(4).isSame(task.date_start, 'day')){
						thursdayTasks.push(task);
					}
					else if(momentDate.clone().day(5).isSame(task.date_start, 'day')){
						fridayTasks.push(task);
					}
					else if(momentDate.clone().day(6).isSame(task.date_start, 'day')){
						saturdayTasks.push(task);
					}
					else if(momentDate.clone().day(7).isSame(task.date_start, 'day')){
						sundayTasks.push(task);
					}

					// Retrieve the number of Open Task //
					if(task.state == app.Models.Task.state[0].value){
						nbPendingTasks++;
					}

				}
				// Hack for Sunday Task //
				else {

					if( momentDate.clone().day(7).isSame(task.date_start, 'day') ){					
						sundayTasks.push(task);

						// Retrieve the number of Open Task //
						if(task.state == app.Models.Task.state[0].value){
							nbPendingTasks++;
						}
					}
				}
			}
		});

		var tasksUserFiltered = [
			{'day': momentDate.clone().day(1), 'tasks': mondayTasks},
			{'day': momentDate.clone().day(2), 'tasks': tuesdayTasks},
			{'day': momentDate.clone().day(3), 'tasks': wednesdayTasks},
			{'day': momentDate.clone().day(4), 'tasks': thursdayTasks},
			{'day': momentDate.clone().day(5), 'tasks': fridayTasks},
			{'day': momentDate.clone().day(6), 'tasks': saturdayTasks},
			{'day': momentDate.clone().day(7), 'tasks': sundayTasks}
		];

		console.log("tasksUser");
		console.log(tasksUser);



			
		// Fill DropDown list Agents //
		var officersDropDownList;
		var displayFilter;

		// If the User is DST - Don't Filter Officers Collection //
		if(app.models.user.isDST()){
			
			officersDropDownList = app.collections.officers;
			displayFilter = true;
		}
		// If the User is MANAGER - Filter Officers Collection with the manager service ID//
		else if(app.models.user.isManager()){

			// Retrieve User services //
			var userServices = app.models.user.toJSON().service_ids;

			// Filter on each officer //
			officersDropDownList = _.filter(app.collections.officers.models, function(officer){

				// Display only officers who are not DST //
				if(!officer.isDST()){
					var thing = false;

					_.each(officer.toJSON().service_ids, function(item){
						
						if($.inArray(item.id, userServices) != -1){
							thing = true;
							return;	
						}
					});

					return thing;
				}
				
			});

			officersDropDownList = new app.Collections.Officers(officersDropDownList);
			displayFilter = true;
		}
		else{
			
			// Iterate all the teams to find if the connected user is a foreman //
			var managerTeamID = [];
			
			_.each(app.collections.teams.models, function(team){

				if(!officer.isDST()){

					var teamJSON = team.toJSON();
					
					if(teamJSON.manager_id[0] == app.models.user.toJSON().uid){
						managerTeamID.push(teamJSON.id);
					}
				}

			});

			// If the user is a formean display the filter //
			if(!_.isEmpty(managerTeamID)){
				displayFilter = true;

				// Filter on each officer //
				var officersDropDownListFilter = _.filter(app.collections.officers.models, function(officer){
						var officerJSON = officer.toJSON();
						if(officerJSON.team_ids != null){
							var self = this;
							self.belongsToTeam = false
							//compare with manager teams
							_.each( officerJSON.team_ids, function(team) {
								self.belongsToTeam =  ($.inArray(team.id, managerTeamID) != -1);
							});	
							if( this.belongsToTeam )
								return true;
						}

				});

				officersDropDownList = app.collections.officers.reset(officersDropDownListFilter);

			}
			else{
				displayFilter = false;

			}
		}




		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){


			var template = _.template(templateData, {
				lang: app.lang,
				nbPendingTasks: nbPendingTasks,
				tasksPerDay: tasksUserFiltered,
				momentDate: momentDate,
				displayFilter: displayFilter
			});
			
			$(self.el).html(template);

			app.views.selectListAssignementsView = new app.Views.DropdownSelectListView({el: $("#taskCategory"), collection: app.collections.categoriesTasks})
			app.views.selectListAssignementsView.clearAll();
			app.views.selectListAssignementsView.addEmptyFirst();
			app.views.selectListAssignementsView.addAll();



			if(officersDropDownList != null){
				app.views.selectListFilterOfficerView = new app.Views.DropdownSelectListView({el: $("#filterListAgents"), collection: officersDropDownList})
				app.views.selectListFilterOfficerView.clearAll();
				app.views.selectListFilterOfficerView.addEmptyFirst();
				app.views.selectListFilterOfficerView.addAll();
			}


			$(".datepicker").datepicker({
    			format: 'dd/mm/yyyy',
    			weekStart: 1,
    			autoclose: true,
    			language: 'fr'
    		});
			
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
					//self.saveServicesCategories();
				}
			});	
			
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
					//self.saveServicesCategories();
				}
			});
			
			$('#equipmentsSpent, #equipmentsListSpent').sortable({
				connectWith: 'ul.sortableEquipmentsList',
				dropOnEmpty: true,
				forcePlaceholderSize: true,
				forceHelperSize: true,
				placeholder: 'sortablePlaceHold',
				containment: '.equipmentsDroppableAreaSpent',
				cursor: 'move',
				opacity: '.8',
				revert: 300,
				receive: function(event, ui){
					//self.saveServicesCategories();
				}
			});	
			

			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
			$('*[data-toggle="tooltip"]').tooltip();



			// Collapse border style //
			$('.accordion-toggle').click(function(){
				if($(this).parents('.accordion-group').hasClass('collapse-selected')){
					$(this).parents('.accordion-group').removeClass('collapse-selected');
				}else{
					$(this).parents('.accordion-group').addClass('collapse-selected');	
				}
    		})


    		//  DropDown Filter set Selected //
			if(sessionStorage.getItem(self.filters) != null){
				$('label[for="filterListAgents"]').removeClass('muted');
				app.views.selectListFilterOfficerView.setSelectedItem(sessionStorage.getItem(self.filters));
			}


    		// Set the focus to the first input of the form //
			$('#modalTaskDone, #modalAddTask, #modalTimeSpent').on('shown', function (e) {
				$(this).find('input, textarea').first().focus();
			})

		});

		$(this.el).hide().fadeIn('slow');

		return this;
    },



	/** Display equipments
	*/
	displayEquipmentsInfos: function(e, list, choiceList, badgeComponent, vehicleSelect){
		e.preventDefault();
		
		//Filter equipments
		var filteredEquipment = app.collections.equipments;


		if( this.model ) {
			// Filter Equipment by service on intervention's task //
			var task = this.model.toJSON();
			var intervention = task.intervention;
			//If task not orphelin
			if( intervention!= null ) {
				var service = intervention.service_id;
				filteredEquipment = _.filter(filteredEquipment.models, function(item){	
					var equipmentJSON = item.toJSON();
					var services = _.map(equipmentJSON.service_ids, function(service){return service.id;});
		    		return $.inArray(service[0], services)!=-1;
		    	});			
			}
			else
				filteredEquipment = filteredEquipment.models;
		}
		else {
			// When create orphan task : Filter Equipment by service on user connected //
			filteredEquipment = _.filter(filteredEquipment.models, function(item){
				var equipmentJSON= item.toJSON();
				var self = this;
				self.belongsToUserServices = false	
				var services = _.map(equipmentJSON.service_ids, function(service){return service.id;});
				_.each(services, function(service){
					self.belongsToUserServices = $.inArray(service, app.models.user.toJSON().service_ids)!=-1
				})
				return this.belongsToUserServices;
	    	});
		}
		


		// Search only vehicles //
		var filteredVehicleEquipment = _.filter(filteredEquipment, function(item){
		    return item.attributes.technical_vehicle || item.attributes.commercial_vehicle;
		});
		
		//search only materials
		var filteredOthersEquipment = _.filter(filteredEquipment, function(item){
		    return item.attributes.small_material || item.attributes.fat_material;
		});
		
		app.views.selectListEquipmentsView = new app.Views.DropdownSelectListView({el: vehicleSelect, collection: new app.Collections.Equipments(filteredVehicleEquipment)})
		app.views.selectListEquipmentsView.clearAll();
		app.views.selectListEquipmentsView.addEmptyFirst();
		app.views.selectListEquipmentsView.addAll();

		// Retrieve the ID of the intervention //
		var link = $(e.target);
		var id = _(link.parents('tr').attr('id')).strRightBack('_');
		
		// Clear the lists //		
		list.empty();
		choiceList.empty();

		var equipmentsSelected = new Array();
		if( id ) {
			this.selectedTask = _.filter(app.collections.tasks.models, function(item){ return item.attributes.id == id });
			var selectedTaskJson = this.selectedTask[0].toJSON();	
			
			// Display the services of the team //
			_.each(selectedTaskJson.equipments_ids, function (equipment, i){
				list.append('<li id="equipment_'+equipment.id+'"><a href="#"><i class="icon-wrench"></i> '+ equipment.name + '-' + equipment.type + '</a></li>');
				equipmentsSelected[i] = equipment.id;
			});
		};

		// Display the remain services //
		var nbRemainMaterials = 0;
		_.filter(filteredOthersEquipment, function (material, i){
			var materialJSON = material.toJSON()
			if(!_.contains(equipmentsSelected, materialJSON.id)){
				nbRemainMaterials++;
				choiceList.append('<li id="equipment_'+materialJSON.id+'"><a href="#"><i class="icon-wrench"></i> '+ materialJSON.name + '-' + materialJSON.type + ' </a></li>');
			}
		});
		
		badgeComponent.html(nbRemainMaterials);
		
	},




    resetModal: function() {  
    	this.model = null;
    	$('.taskInput').val('');
    	$('.taskSelect').val(0);
    	$('#taskName').val('');    	
    	//$('.equipments').val('')    	
    },
    
    /**
     * Get Vehicle
     */
    getVehicule: function(e) {	
		input_equipment_id = null;
		if( app.views.selectListEquipmentsView != null ) {
			var selectItem = app.views.selectListEquipmentsView.getSelected();
			if( selectItem ) {
				input_equipment_id = selectItem.toJSON().id
			}
		}    
		return input_equipment_id;
    },
    


	/** Display the form to add a new Task
	*/
	displayModalAddTask: function(e){
			
    	this.resetModal();
    	this.displayEquipmentsInfos(e, $('#equipmentsAdd'), $('#equipmentsListAdd'), $('#badgeNbEquipmentsAdd'), $("#taskEquipmentAdd") );
			
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
		
		$('#modalAddTask .modal-body').css({"height": "450px", "max-height": "450px"});
        $('#modalAddTask').modal();
	},
	
	
	/** Retreive Equipment  (Vehicle)
	*/
	fillDropdownEquipment: function(e){
		e.preventDefault();
		var target = $(e.target).attr('value');
		if( target ) {
			var equipment = app.collections.equipments.get( target );
			if( equipment ) {
				var km = equipment.toJSON().km ;
				$('.equipmentKm').val( km );
				$('.equipmentKm').attr('min', km )
			}
		}
	},
	
  
	/** Get the Task
	*/
    getTask: function(e) {
		
    	this.resetModal();
		var href = $(e.target);
	
		// Retrieve the ID of the request //	
		this.pos = href.parents('tr').attr('id');

		this.model = app.collections.tasks.get(this.pos);
    },
	

	/** Save New Task (Orphelin)
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
		 
		input_category_id = null;	    
	    if( app.views.selectListAssignementsView != null ) {
	    	 var selectItem = app.views.selectListAssignementsView.getSelected();
	    	 if( selectItem ) {
	    		 input_category_id = app.views.selectListAssignementsView.getSelected().toJSON().id;
	    	 }
	    }	 
	     
	    this.equipments = [];	     
		var vehicule = this.getVehicule();
		var equipments = _.map($("#equipmentsAdd").sortable('toArray'), function(equipment){ return _(_(equipment).strRightBack('_')).toNumber(); }); 
	    if( vehicule!=null )
	    	 equipments.push( vehicule );
	     
		var params = {
			user_id:  app.models.user.getUID(),
			date_start: mNewDateStart.toDate(),
			date_end: mNewDateEnd.toDate(),
			state: app.Models.Task.state[1].value,
			vehicule: vehicule,
			equipment_ids: equipments,
			name: this.$('#taskName').val(),
			km: this.$('#equipmentKmAdd').val(),
			oil_qtity: this.$('#equipmentOilQtityAdd').val().replace(',', '.'),
			oil_price: this.$('#equipmentOilPriceAdd').val().replace(',', '.'),
			category_id: input_category_id,	         
			planned_hours: planned_hours,
			remaining_hours: planned_hours,
			date: new Date(),
		    hours: planned_hours,
		};
		
		$('#modalAddTask').modal('hide');
		app.models.task.save(0, params);
   	},
    
    /**
     * Display Modal for task not finished
     */
    setModalTimeSpent: function(e) {    	
    	this.getTask(e);
    	this.displayEquipmentsInfos(e, $('#equipmentsSpent'), $('#equipmentsListSpent'), $('#badgeNbEquipmentsSpent'), $("#taskEquipmentSpent" ) );
    	var task = this.model.toJSON();
    	$('.timepicker-default').timepicker({showMeridian:false, modalBackdrop:true});

    	$('#infoModalTimeSpent').children('p').html(task.name);
    	$('#infoModalTimeSpent').children('small').html('<i class="icon-map-marker icon-large"></i> '+task.intervention.site1[1]);
		$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});

		$('#eventTimeSpent').val(this.secondsToHms(task.remaining_hours*60));
		$('#modalTimeSpent .modal-body').css({"height": "450px", "max-height": "450px"});
		$('#eventTimeRemaining').val("00:00");

    },
    
    /**
     * Save Not Finished Task
     */
    saveTimeSpent: function(e) {
    	e.preventDefault();
    	
    	var task = this.model.toJSON();
    	var inter = task.intervention;
    	
    	//Calculate new intervention state
		var newInterState = null;
  		if( task && task.intervention ) {
  			inter = task.intervention;
  			newInterState = inter.state;
  			if( task.intervention.state!=app.Models.Intervention.state[5].value ) {
  				newInterState = app.Models.Intervention.state[3].value;
  			}
  		}    

  		//calculate Date and times
    	var timeArray = $('#eventTimeSpent').val().split(':');
    	var hours = parseInt(timeArray[0]) + (timeArray[1]!="00" ? parseInt(timeArray[1])/60 : 0)
    	timeArray = $('#eventTimeRemaining').val().split(':');
    	var remaining_hours = parseInt(timeArray[0]) + (timeArray[1]!="00" ? parseInt(timeArray[1])/60 : 0);
	     
	    var equipments = [];    	
	    var vehicule = this.getVehicule();
	    equipments = _.map($("#equipmentsSpent").sortable('toArray'), function(equipment){ return _(_(equipment).strRightBack('_')).toNumber(); });
	    if( vehicule!=null )
	    	equipments.push( vehicule );

    	
    	params = {
    	    project_state: newInterState,
  		  	email_text: null,
  		    task_state: app.Models.Task.state[1].value,  		  
  		  	equipment_ids: equipments,
  		    vehicule: vehicule,
  		    km: self.$('#equipmentKmSpent').val().replace(',', '.'),
			oil_qtity: self.$('#equipmentOilQtitySpent').val(),
			oil_price: self.$('#equipmentOilPriceSpent').val().replace(',', '.'),
	        planned_hours: remaining_hours,
	        remaining_hours: hours,
  		    date: new Date(),
  		    hours: hours,
		};
    	
    	this.model.saveTaskDone(params,
			{
				success: function(data){
					$('#modalTimeSpent').modal('hide');
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
				}
			}
		);

    },

	/** 
	 * Set Information in the Modal Task Done
	*/
    setModalTaskDone: function(e) {
    	this.getTask(e);
    	this.displayEquipmentsInfos(e, $('#equipmentsDone'), $('#equipmentsListDone'), $('#badgeNbEquipmentsDone'), $("#taskEquipmentDone") );

    	var task = this.model.toJSON();

    	$('.timepicker-default').timepicker({showMeridian:false, modalBackdrop:true});
    	
    	// Set Modal information about the Task //
    	$('#infoModalTaskDone').children('p').html(task.name);
		$('#infoModalTaskDone').children('small').html('<i class="icon-map-marker icon-large"></i> '+task.intervention.site1[1]);

		$('#modalTaskDone .modal-body').css({"height": "450px", "max-height": "450px"});
		$('#eventTimeDone').val(this.secondsToHms(task.remaining_hours*60));

    },

	/** 
	 * Update the task as done
	*/
    saveTaskDone: function(e) {
    	e.preventDefault();
    	
    	if( task && task.intervention )
    		return;
    	
    	var task = this.model.toJSON();
    	var inter = task.intervention;;
    	
    	//Calculate new intervention state
    	var that = this;
    	var newInterState = inter.state;
		that.state = app.Models.Intervention.state[2].value;		
		var tasks = this.model.toJSON().intervention.tasks;
		_.each(tasks.models, function (task, i) {
			if( that.model.id!= task.id && ( task.toJSON().state == app.Models.Task.state[0].value
				 || task.toJSON().state == app.Models.Task.state[2].value
				 || task.toJSON().state == app.Models.Task.state[3].value) )
				that.state = app.Models.Intervention.state[3].value;
		});		
		
		if( task.intervention.state!=app.Models.Intervention.state[5].value ) {
			newInterState = that.state;
		}		 	
		//End calculate new intervention state

		//Get time spent to done task
		var timeArray = $('#eventTimeDone').val().split(':');
    	var hours = parseInt(timeArray[0]) + (timeArray[1]!="00" ? parseInt(timeArray[1])/60 : 0);
    	
	     
	    var vehicule = this.getVehicule();
	    var equipments = _.map($("#equipmentsDone").sortable('toArray'), function(equipment){ return _(_(equipment).strRightBack('_')).toNumber(); }); 
	    if ( vehicule!=null )
	    	equipments.push( vehicule );


		params = {
		    //Project state
		    project_state: newInterState,
		    //email text send to partner
		    email_text: app.Models.Request.state[3].traduction,
		    //Task params
			task_state: app.Models.Task.state[1].value,		   
		    equipment_ids: equipments,
		    vehicule: vehicule,
	        km: this.$('#equipmentKmDone').val(),
	        oil_qtity: this.$('#equipmentOilQtityDone').val().replace(',', '.'),
	        oil_price: this.$('#equipmentOilPriceDone').val().replace(',', '.'),
	        date: new Date(),
	        remaining_hours: hours,
	        hours: hours,
	        
		};
	    
	    this.model.saveTaskDone(params,
			{
				success: function(data){
					$('#modalTaskDone').modal('hide');
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
				}
			}
		);
    	
    },
    
    /**
     * Save Task as not beginning
     */
    taskNotDone: function(e) {
		e.preventDefault();
		this.getTask(e);
		taskParams = {
			state: app.Models.Task.state[3].value,		
			user_id: null,
			team_id:null,
			date_end: null,
			date_start: null,
		};
		
		$('#modalAddTask').modal('hide');
		app.models.task.save(this.model.id, taskParams);

	},
	
	secondsToHms : function (d) {
		d = Number(d);	
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);
		return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
	},

	/** 
	 * Filter Tasks
	*/
	setFilter: function(event){
		event.preventDefault();

		var filterValue = $(event.target).attr('value');

		// Set the filter in the local Storage //
		if(filterValue != ''){
			sessionStorage.setItem(this.filters, filterValue);
		}
		else{
			sessionStorage.removeItem(this.filters);
		}

		this.render();
	},


	/** Display or Hide Refueling Section (Inputs Km, Oil, Oil prize)
	*/
	accordionRefuelingInputs: function(e){
		e.preventDefault();

		// Toggle Slide Refueling section //
		$('.refueling-vehicle').stop().slideToggle();

	},

    preventDefault: function(event){
    	event.preventDefault();
    },

});