/******************************************
* Interventions List View
*/
app.Views.InterventionsListView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'interventions',

	filters: 'intersListFilter',

	selectedInter : '',
	selectedTask : '',


	// The DOM events //
	events: {
		'click li.active'					: 'preventDefault',
		'click li.disabled'					: 'preventDefault',

		'click .btn.addTask'                : 'displayModalAddTask',
		'submit #formAddTask'         		: 'saveTask',

		'click a.modalDeleteTask'   		: 'displayModalDeleteTask',
		'click button.btnDeleteTask'   		: 'deleteTask',

		'click a.buttonCancelInter'			: 'displayModalCancelInter',
		'submit #formCancelInter' 			: 'cancelInter',

		'click a.buttonCancelTask'			: 'displayModalCancelTask',
		'submit #formCancelTask' 			: 'cancelTask',

		'click a.printTask' 				: 'printTask',

		'click .buttonTaskDone, .buttonNotFinish' : 'displayModalTaskDone',
		'submit #formTaskDone'   			: 'taskDone',
		'click a.linkSelectUsersTeams'		: 'changeSelectListUsersTeams',
		'click .linkRefueling'				: 'accordionRefuelingInputs', 

		'click a.accordion-object'    		: 'tableAccordion',

		'click #filterStateInterList li:not(.disabled) a' 	: 'setFilter'
	},



	/** View Initialization
	*/
	initialize : function() {
		console.log('Interventions view Initialize');
	},



    /** Display the view
    */
    render : function() {
        var self = this;

        // Change the page title //
        app.router.setPageTitle(app.lang.viewsTitles.interventionsMonitoring);

        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


        var interventions = app.collections.interventions;

        var nbInterventions = _.size(interventions);



        // Check the number of planned interventions //
        var interventionsPlanned = _.filter(interventions.toJSON(), function(item){ 
            return (item.state == app.Models.Intervention.state[0].value);
        });
        var nbInterventionsPlanned = _.size(interventionsPlanned);


        // Check the number of pending interventions //
        var interventionsPending = _.filter(interventions.toJSON(), function(item){ 
            return (item.state == app.Models.Intervention.state[3].value);
        });
        var nbInterventionsPending = _.size(interventionsPending);



        // Set informations about Intervention //
        this.addInfoAboutInter(interventions.models);



		// Collection Filter if not null //
		if(sessionStorage.getItem(this.filters) != null){
			var filter = _.filter(interventions.toJSON(), function(item){ 
				if(sessionStorage.getItem(self.filters) != 'overrun'){
					return item.state == sessionStorage.getItem(self.filters);
				}
				else{
					return (item.state == app.Models.Intervention.state[2].value && item.overPourcent > 100);	
				}
			});

			interventions.reset(filter);
		}

      

        // Hack to reverse the position of the two first elements //
        var interventionsState = _.clone(app.Models.Intervention.state);
        var firstElements = _.first(interventionsState, 2);

		_(2).times(function(n){
			interventionsState.shift();
		})
		interventionsState =  _.union(firstElements.reverse(), interventionsState);


		console.debug(interventions.toJSON());


		// Retrieve the HTML template //
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang: app.lang,
				nbInterventions: nbInterventions,
				nbInterventionsPending: nbInterventionsPending,
				nbInterventionsPlanned: nbInterventionsPlanned,
				interventionsState: interventionsState,
				interventions: interventions.toJSON(),
			});


			$(self.el).html(template);


			$('*[data-toggle="tooltip"]').tooltip();
			$('*[rel="popover"]').popover({trigger: 'hover'});
			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
			$(".datepicker").datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });


			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });


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


			// Display filter on the table //
			if(sessionStorage.getItem(self.filters) != null){
				$('a.filter-button').removeClass('filter-disabled').addClass('filter-active');
				$('li.delete-filter').removeClass('disabled');

				_.each(app.Models.Intervention.state, function (state, i) {
					if(state.value == sessionStorage.getItem(self.filters)){
						$('a.filter-button').addClass('text-'+state.color);
					}
					else if(sessionStorage.getItem(self.filters) == 'overrun'){
						$('a.filter-button').addClass('text-overrun');
					}
				})
			}
			else{
				$('a.filter-button').removeClass('filter-active ^text').addClass('filter-disabled');
				$('li.delete-filter').addClass('disabled');
			}


			// Set the focus to the first input of the form //
			$('#modalCancelInter, #modalDeleteTask, #modalAddTask, #modalCancelTask').on('shown', function (e) {
				$(this).find('input, textarea').first().focus();
			})
		
			
		});

		$(this.el).hide().fadeIn('slow');
		return this;
    },



    addInfoAboutInter: function(inters) {
    	_.each(inters, function (interModel, i) { 
			var classColor = "";
			var infoMessage = "";
			var intervention = interModel.toJSON();
			var firstDate = null;
			var lastDate = null;
			
			_.each(intervention.tasks, function(task){ 
				if ( firstDate==null )
					firstDate = task.date_start;
				else if ( task.date_start && firstDate>task.date_start )
					firstDate=task.date_start; 
				
				if ( lastDate==null )
					lastDate = task.date_end;
				else if ( task.date_end && lastDate<task.date_end )
					lastDate=task.date_end; 
			});

		
	    	if( firstDate ) {
	    		if( intervention.progress_rate==0 )
	    			infoMessage = "Début prévue le " + firstDate.format('LLL'); 
				else if( lastDate )
		    		infoMessage = "Fin prévue le " + lastDate.format('LLL'); 
	    	}
						
		    if( intervention.state == app.Models.Intervention.state[4].value ) {
				infoMessage = intervention.cancel_reason
		    }
			
			if ( intervention.effective_hours>intervention.planned_hours ) {
				classColor = "bar-danger";
			}

			interModel.setInfoMessage(infoMessage); // = infoMessage;
			interModel.setClassColor(classColor); // = classColor;
			if( intervention.planned_hours ) {
				interModel.setOverPourcent(
					Math.round(100.0 * intervention.effective_hours / intervention.planned_hours));
			}
			else
				interModel.setOverPourcent( 0 );
			console.debug("message:" + infoMessage + ", classColor:"+ classColor);
		});
	},



	/** Fonction collapse table row
	*/
	tableAccordion: function(e){

        e.preventDefault();
        
        // Retrieve the intervention ID //
        var id = _($(e.target).attr('href')).strRightBack('_');


        var isExpend = $('#collapse_'+id).hasClass('expend');

        // Reset the default visibility //
        $('tr.expend').css({ display: 'none' }).removeClass('expend');
        $('tr.row-object').css({ opacity: '0.45'});
        $('tr.row-object > td').css({ backgroundColor: '#FFF'});
        
        // If the table row isn't already expend //       
        if(!isExpend){
            // Set the new visibility to the selected intervention //
            $('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
            $(e.target).parents('tr.row-object').css({ opacity: '1'});  
            $(e.target).parents('tr.row-object').children('td').css({ backgroundColor: "#F5F5F5" }); 
        }
        else{
            $('tr.row-object').css({ opacity: '1'});
            $('tr.row-object > td').css({ backgroundColor: '#FFF'});
            $('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' }); 
        }
           
    },



	getTarget:function(e) {    	
    	e.preventDefault();
	    // Retrieve the ID of the intervention //
		var link = $(e.target);
		this.pos =  _(link.parents('tr').attr('id')).strRightBack('_');
		
    },



	/** Display the form to add a new Task
	*/
	displayModalAddTask: function(e){
        this.getTarget(e);
        
        // Display only categories in dropdown belongs to intervention //
        var categoriesFiltered = null;
        var inter = app.collections.interventions.get(this.pos);
        if( inter) {
        	var interJSON = inter.toJSON();
	        categoriesFiltered = _.filter(app.collections.categoriesTasks.models, function(item){
	        	var services = [];
	        	_.each( item.attributes.service_ids.models, function(service){
	        		services.push( service.toJSON().id );
	        	});
	        	return  interJSON.service_id && $.inArray( interJSON.service_id[0], services )!=-1;
	       	});
		}        
		
		app.views.selectListAssignementsView = new app.Views.DropdownSelectListView({el: $("#taskCategory"), 
			collection: categoriesFiltered==null?app.collections.categories: new app.Collections.CategoriesTasks(categoriesFiltered)
		})
		app.views.selectListAssignementsView.clearAll();
		app.views.selectListAssignementsView.addEmptyFirst();
		app.views.selectListAssignementsView.addAll();	
	        
        $('#modalAddTask').modal();
	},



	/** Prepare Modals
	*/
	displayModalDeleteTask: function(e){
		this.getTarget(e);
		this.selectedTask = app.collections.tasks.get(this.pos);
		this.selectedTaskJSON = this.selectedTask.toJSON();
		$('#infoModalDeleteTask').children('p').html(this.selectedTaskJSON.name);
		$('#infoModalDeleteTask').children('small').html(this.selectedTaskJSON.description);
	},


	displayModalCancelInter: function(e) {
		this.getTarget(e);
		this.selectedInter = app.collections.interventions.get(this.pos);
		this.selectedInterJSON = this.selectedInter.toJSON();
		$('#infoModalCancelInter').children('p').html(this.selectedInterJSON.name);
		$('#infoModalCancelInter').children('small').html(this.selectedInterJSON.description);
	},

	displayModalCancelTask: function(e) {
		var button = $(e.target);
		this.selectedTask = app.collections.tasks.get(button.data('taskid'));
		this.selectedTaskJSON = this.selectedTask.toJSON();

		$('#infoModalCancelTask').children('p').html(this.selectedTaskJSON.name);
		$('#infoModalCancelTask').children('small').html('<i class="icon-pushpin"></i>&nbsp;' + this.selectedTaskJSON.intervention.name);
	},

	displayModalTaskDone: function(e){
		var button = $(e.target);

		// Retrieve the Task //
		if(!button.is('i')){
			this.selectedTask = app.collections.tasks.get(button.data('taskid'));
		}
		else{
			this.selectedTask = app.collections.tasks.get(button.parent().data('taskid'));	
		}

	

		// Display or nor the Remaining Time Section //
		if(button.hasClass('buttonNotFinish') || button.hasClass('iconButtonNotFinish')){
			$('#remainingTimeSection').show();
		}
		else{
			$('#remainingTimeSection').hide();
		}


		this.selectedTaskJSON = this.selectedTask.toJSON();
		var intervention = this.selectedTaskJSON.intervention;
		var serviceInter = intervention.service_id;


		var officers = app.collections.officers;
	

		// Filter officers - Display only officer who belongs to the intervention's service //
		filteredOfficer = _.filter(officers.models, function(officer){	
			var officerJSON = officer.toJSON();
			
			var services = _.map(officerJSON.service_ids, function(service){return service.id;});
    		return $.inArray(serviceInter[0], services)!=-1;
    	});

		// Fill Officer List //
		app.views.selectListOfficersTeamsView = new app.Views.DropdownSelectListView({el: $('#selectUsersTeams'), collection: officers.reset(filteredOfficer)})
		app.views.selectListOfficersTeamsView.clearAll();
		app.views.selectListOfficersTeamsView.addEmptyFirst();
		app.views.selectListOfficersTeamsView.addAll();


		// Set Task Informations //
		$('#infoModalTaskDone').children('p').html(this.selectedTaskJSON.name);
		$('#infoModalTaskDone').children('small').html('<i class="icon-pushpin"></i>&nbsp;' + this.selectedTaskJSON.intervention.name);


    	$("#startDate").val(  moment().format('L') );
    	$("#endDate").val( moment().format('L') );

		// Set Task Planned Hour //
		$("#startHour").timepicker('setTime', moment().format('LT') );
		$("#endHour").timepicker('setTime', moment().add('hour', this.selectedTaskJSON.planned_hours).format('LT') );

		
		// Filter Equipment by service on intervention's task //
		var equipmentsCollection = app.collections.equipments;


		filteredEquipment = _.filter(equipmentsCollection.models, function(item){	
			var equipmentJSON = item.toJSON();
			var services = _.map(equipmentJSON.service_ids, function(service){return service.id;});
    		return $.inArray(serviceInter[0], services)!=-1;
    	});

    	// Search only vehicles //
		var filteredVehicleEquipment = _.filter(filteredEquipment, function(item){
		    return item.attributes.technical_vehicle || item.attributes.commercial_vehicle;
		});

		// Fill equipment List //
		app.views.selectListEquipmentsView = new app.Views.DropdownSelectListView({el: $("#taskEquipmentDone"), collection: equipmentsCollection.reset(filteredVehicleEquipment)})
		app.views.selectListEquipmentsView.clearAll();
		app.views.selectListEquipmentsView.addEmptyFirst();
		app.views.selectListEquipmentsView.addAll();


		// Search only materials //
		var filteredOthersEquipment = _.filter(filteredEquipment, function(item){
		    return item.attributes.small_material || item.attributes.fat_material;
		});

		_.each(filteredOthersEquipment, function (material, i){
			var materialJSON = material.toJSON();
				$('#equipmentsListDone').append('<li id="equipment_'+materialJSON.id+'"><a href="#"><i class="icon-wrench"></i> '+ materialJSON.name + '-' + materialJSON.type + ' </a></li>');
		});

		$('#badgeNbEquipmentsDone').html(_.size(filteredOthersEquipment));
	},



	/** Update the <select> list of Users or Teams in the Modal Task Done
	*/
	changeSelectListUsersTeams: function(e){
		e.preventDefault();
		var link = $(e.target);

		// Retrieve the item to refres - Users or Teams //
		if(link.is('a')){ var itemToLoad = link.data('item'); }
		else{ var itemToLoad = link.parent('a').data('item'); }

		this.selectedTaskJSON = this.selectedTask.toJSON();
		var intervention = this.selectedTaskJSON.intervention;
		var serviceInter = intervention.service_id;
		

		if(itemToLoad == 'officers'){
			$('#btnSelectUsersTeams > i.iconItem.icon-group').addClass('icon-user').removeClass('icon-group');
			$('#selectUsersTeams').data('item', 'officers');
			
			var officers = app.collections.officers;
			// Filter officers - Display only officer who belongs to the intervention's service //
			filteredOfficer = _.filter(app.collections.officers.models, function(officer){	
				var officerJSON = officer.toJSON();
				
				var services = _.map(officerJSON.service_ids, function(service){return service.id;});
	    		return $.inArray(serviceInter[0], services)!=-1;
	    	});

			// Fill Officer List //
			if(app.views.selectListOfficersTeamsView == null){
				app.views.selectListOfficersTeamsView = new app.Views.DropdownSelectListView({el: $('#selectUsersTeams'), collection: officers.reset(filteredOfficer)})
			}
			else{
				app.views.selectListOfficersTeamsView.collection = officers.reset(filteredOfficer);
			}
			app.views.selectListOfficersTeamsView.clearAll();
			app.views.selectListOfficersTeamsView.addEmptyFirst();
			app.views.selectListOfficersTeamsView.addAll();
		}
		else if(itemToLoad == 'teams'){
			$('#btnSelectUsersTeams > i.iconItem.icon-user').addClass('icon-group').removeClass('icon-user');
			$('#selectUsersTeams').data('item', 'teams');
			
			if(app.collections.teams == null ){
				app.collections.teams = new app.Collections.Teams();
			}

			app.collections.teams.fetch({
				success: function(){

					var teams = app.collections.teams;
					filteredTeams = _.filter(teams.models, function(team){	
						var teamJSON = team.toJSON();
						
						var services = _.map(teamJSON.service_ids, function(service){return service.id;});
			    		return $.inArray(serviceInter[0], services)!=-1;
			    	});

					app.views.selectListOfficersTeamsView = new app.Views.DropdownSelectListView({el: $('#selectUsersTeams'), collection: teams.reset(filteredTeams)})
					app.views.selectListOfficersTeamsView.clearAll();
					app.views.selectListOfficersTeamsView.addEmptyFirst();
					app.views.selectListOfficersTeamsView.addAll();
				}	
			});
		}

	},


	/** Display or Hide Refueling Section (Inputs Km, Oil, Oil prize)
	*/
	accordionRefuelingInputs: function(e){
		e.preventDefault();

		// Toggle Slide Refueling section //
		$('.refueling-vehicle').stop().slideToggle();
	},



	taskDone: function(e){
		e.preventDefault();


		if($('#selectUsersTeams').data('item') == 'officers'){
			var teamMode = false;

		}
		else{
			var teamMode = true;
		}

		var id = $('#selectUsersTeams').val();


		// Retrieve Start Date and Start Hour //
		var mNewDateStart =  new moment( $("#startDate").val(),"DD-MM-YYYY")
								.add('hours',$("#startHour").val().split(":")[0] )
								.add('minutes',$("#startHour").val().split(":")[1] );

		// Retrieve Start Date and Start Hour //
		var mNewDateEnd =  new moment( $("#endDate").val(),"DD-MM-YYYY")
								.add('hours',$("#endHour").val().split(":")[0] )
								.add('minutes',$("#endHour").val().split(":")[1] );



		var vehicule = $('#taskEquipmentDone').val();
		var equipments = _.map($("#equipmentsDone").sortable('toArray'), function(equipment){ return _(_(equipment).strRightBack('_')).toNumber(); }); 
	    
	    if(vehicule != ""){
	    	equipments.push( _(vehicule).toNumber() );
	    }


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
			remaining_hours: remaining_hours,
		};


		alert("TODO: Params must be send to OpenERP");


	},



    /** Save the Task
    */
	saveTask: function(e){
		var self = this;

		e.preventDefault();

		input_category_id = null;
	    if( app.views.selectListAssignementsView != null ) {
	    	 var selectItem = app.views.selectListAssignementsView.getSelected();
	    	 if( selectItem ) {
	    		 input_category_id = app.views.selectListAssignementsView.getSelected().toJSON().id;
	    	 }
	    }
	     
//	     input_equipment_id = null;
//	     if( app.views.selectListEquipmentsView != null ) {
//	    	 var selectItem = app.views.selectListEquipmentsView.getSelected();
//	    	 if( selectItem ) {
//	    		 input_equipment_id = selectItem.toJSON().id
//	    	 }
//	     }


	     var duration = $("#taskHour").val().split(":");
	     var mDuration = moment.duration ( { hours:duration[0], minutes:duration[1] });

	     var params = {
	         project_id: this.pos,
	         //equipment_id: input_equipment_id,
	         name: this.$('#taskName').val(),
	         category_id: input_category_id,
		     planned_hours: mDuration.asHours(),
	     };
	     
	     $('#modalAddTask').modal('hide');
	     app.models.task.save(0,params);
   	},



	/** Delete task
	*/
	deleteTask: function(e){
		var self = this;
		this.selectedTask.destroy({
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.tasks.remove(self.selectedTask);
					var inter = app.collections.interventions.get(self.selectedTaskJSON.intervention.id);					
					inter.attributes.tasks.remove(self.selectedTaskJSON.id);
					app.collections.interventions.add(inter);
					$('#modalDeleteTask').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.serviceDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer la tâche");
			}

		});

    },


    /** Cancel Intervention
    */
	cancelInter: function(e){
		e.preventDefault();
		
		this.selectedInter.cancel($('#motifCancel').val(),
			{
				success: function(data){
					$('#modalCancelInter').modal('hide');
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
				}
			}
		);
	},


	/** Cancel Task
	*/
	cancelTask: function(e){
		e.preventDefault();
		
		alert("Merci de laisser du temps pour pouvoir développer cette fonctionnalité");
	},



	saveNewState: function(params, element) {
		var self = this;
		self.element = element;
		self.params = params
		this.selectedInter.save(params, {
			success: function (data) {
				console.log(data);
		        if(data.error){
		    		app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
		        }
		        else{
					console.log('NEW STATE INTER SAVED');
					if( self.element!= null )
						self.element.modal('hide');
					self.selectedInter.update(self.params);
					app.collections.interventions.add(self.selectedInter);
					self.render();
				}
		    },
		    error: function () {
				console.log('ERROR - Unable to valid the Inter - InterventionView.js');
		    },           
		},false);
	},



	/** Print a Task
	*/
	printTask: function(e){
		e.preventDefault();

		this.getTarget(e);
		this.selectedTask = app.collections.tasks.get(this.pos);
		var selectedTaskJSON = this.selectedTask.toJSON();

		console.log(selectedTaskJSON);

		// Get the inter of the Task //
		var inter = app.collections.interventions.get(this.selectedTask.toJSON().intervention.id);
		var interJSON = inter.toJSON();


		console.log(interJSON);

		$('#interName').html(interJSON.name);
		$('#interDescription').html(interJSON.description);
		$('#interPlace').html(interJSON.site1[1]);
		$('#interPlaceMore').html(interJSON.site_details);

		$('#taskLabel').html(selectedTaskJSON.name);
		$('#taskPlannedHour').html(selectedTaskJSON.planned_hours);

        
		$('#printTask').printElement({
			leaveOpen	: true,
			printMode	: 'popup',
			overrideElementCSS:[
				{ href:'css/vendors/print_table.css', media: 'all'}
			]
		});
	},



	/** Filter Request
	*/
	setFilter: function(event){
		event.preventDefault();

		var link = $(event.target);

		var filterValue = _(link.attr('href')).strRightBack('#');

		// Set the filter in the local Storage //
		if(filterValue != 'delete-filter'){
			sessionStorage.setItem(this.filters, filterValue);
		}
		else{
			sessionStorage.removeItem(this.filters);
		}

		route = Backbone.history.fragment;
		Backbone.history.loadUrl(route);
		
	},



	/** Prevent the default action
	*/
	preventDefault: function(event){
		event.preventDefault();
	},
  
});




