/******************************************
* Interventions List View
*/
app.Views.InterventionsListView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'interventions',

	filters: 'intersListFilter',

	numberListByPage: 25,

	selectedInter : '',
	selectedTask : '',


	// The DOM events //
	events: {
		'click li.active'					: 'preventDefault',
		'click li.disabled'					: 'preventDefault',
		'click ul.sortable li'				: 'preventDefault',

		'click .btn.addTask'                : 'displayModalAddTask',
		'submit #formAddTask'         		: 'saveTask',

		'click a.modalDeleteTask'   		: 'displayModalDeleteTask',
		'click button.btnDeleteTask'   		: 'deleteTask',

		'click a.buttonCancelInter'			: 'displayModalCancelInter',
		'submit #formCancelInter' 			: 'cancelInter',

		'click a.buttonCancelTask'			: 'displayModalCancelTask',
		'submit #formCancelTask' 			: 'cancelTask',

		'click a.printTask, a.printInter'	: 'print',

		'click .buttonTaskDone, .buttonNotFinish' : 'displayModalTaskDone',
		'submit #formTaskDone'   			: 'taskDone',
		'click a.linkSelectUsersTeams'		: 'changeSelectListUsersTeams',
		'click .linkRefueling'				: 'accordionRefuelingInputs',

		'change .taskEquipment'				: 'fillDropdownEquipment',

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


		var interventions = app.collections.interventions.toJSON();


		// Check the number of planned interventions //
		var nbInterventionsPlanned = 0;
		app.callObjectMethodOE([[['state','=','scheduled']]],"project.project","search_count",app.models.user.getSessionID(),{
			success: function(data){
				$('.page-header sup[class="badge badge-info"]').html(data.result)
			}
		});

//		var interventionsPlanned = _.filter(interventions, function(item){
//			return (item.state == app.Models.Intervention.status.scheduled.key);
//		});
//		var nbInterventionsPlanned = _.size(interventionsPlanned);


		// Check the number of pending interventions //
		var nbInterventionsPending = 0;
		app.callObjectMethodOE([[['state','=','pending']]],"project.project","search_count",app.models.user.getSessionID(),{
			success: function(data){
				$('.page-header sup[class="badge"]').html(data.result)
			}
		});
//		var interventionsPending = _.filter(interventions, function(item){ 
//			return (item.state == app.Models.Intervention.status.pending.key);
//		});
//		var nbInterventionsPending = _.size(interventionsPending);



		// Collection Filter if not null //
		if(sessionStorage.getItem(this.filters) != null){
			interventions = _.filter(interventions, function(item){ 
				if(sessionStorage.getItem(self.filters) != 'overrun'){
					return item.state == sessionStorage.getItem(self.filters);
				}
				else{
					return (item.state == app.Models.Intervention.status.closed.key && item.overPourcent > 100);	
				}
			});
		}


	  	//console.log(interventions);


		var len = _.size(interventions);
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);


		// Retrieve the HTML template //
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang                   : app.lang,
				nbInterventions        : len,
				nbInterventionsPending : nbInterventionsPending,
				nbInterventionsPlanned : nbInterventionsPlanned,
				interventionsState     : app.Models.Intervention.status,
				interventions          : interventions,
				startPos               : startPos, endPos: endPos,
				page                   : self.options.page, 
				pageCount              : pageCount,
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

				var applyFilter = sessionStorage.getItem(self.filters);

				if(applyFilter != 'overrun') {
					$('a.filter-button').addClass('text-'+app.Models.Intervention.status[applyFilter].color);
				}
				else{
					$('a.filter-button').addClass('text-overrun');
				}
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
				app.callObjectMethodOE([inter.id],"project.project","get_task_categ_authorized",app.models.user.getSessionID(),{
					success: function(data){
						app.views.selectListAssignementsView = new app.Views.DropdownSelectListView({el: $("#taskCategory"), 
						collection: new app.Collections.CategoriesTasks(data.result)})
						app.views.selectListAssignementsView.clearAll();
						app.views.selectListAssignementsView.addEmptyFirst();
						app.views.selectListAssignementsView.addAll();
					}
				});
			}
//			categoriesFiltered = _.filter(app.collections.categoriesTasks.models, function(item){
//				var services = [];
//				_.each( item.attributes.service_ids.models, function(service){
//					services.push( service.toJSON().id );
//				});
//				return  interJSON.service_id && $.inArray( interJSON.service_id[0], services )!=-1;
//			});
//		}        
//		
//		app.views.selectListAssignementsView = new app.Views.DropdownSelectListView({el: $("#taskCategory"), 
//			collection: categoriesFiltered==null?app.collections.categories: new app.Collections.CategoriesTasks(categoriesFiltered)
//		})
//		app.views.selectListAssignementsView.clearAll();
//		app.views.selectListAssignementsView.addEmptyFirst();
//		app.views.selectListAssignementsView.addAll();	
		
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


		if( _.isUndefined(this.officersDropDownList) )
			this.officersDropDownList = new app.Collections.Officers( app.models.user.attributes.officers );
		if( _.isUndefined(this.teamsDropDownList) )
			this.teamsDropDownList = new app.Collections.Teams( app.models.user.attributes.teams );


		// Fill Officer List //
		app.views.selectListOfficersTeamsView = new app.Views.DropdownSelectListView({el: $('#selectUsersTeams'), collection: this.officersDropDownList})
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

		
		var equipmentsCollection = app.collections.equipments;
//		// Filter Equipment by service on intervention's task //
//
//
//		filteredEquipment = _.filter(equipmentsCollection.models, function(item){	
//			var equipmentJSON = item.toJSON();
//			var services = _.map(equipmentJSON.service_ids, function(service){return service.id;});
//			return $.inArray(serviceInter[0], services)!=-1;
//		});
		
		var task_id = this.selectedTask.id
		
		// Search only vehicles //
		app.callObjectMethodOE([task_id],"project.task","get_vehicules_authorized",app.models.user.getSessionID(),{
			success: function(data){
				// Fill equipment List //
				app.views.selectListEquipmentsView = new app.Views.DropdownSelectListView({el: $("#taskEquipmentDone"), collection: equipmentsCollection.reset(data.result)})
				app.views.selectListEquipmentsView.clearAll();
				app.views.selectListEquipmentsView.addEmptyFirst();
				app.views.selectListEquipmentsView.addAll();
			}
		});
//		var filteredVehicleEquipment = _.filter(filteredEquipment, function(item){
//			return item.attributes.technical_vehicle || item.attributes.commercial_vehicle;
//		});
		
		// Search only materials //
		$('#equipmentsListDone').empty();
		app.callObjectMethodOE([task_id],"project.task","get_materials_authorized",app.models.user.getSessionID(),{
			success: function(data){
				// Display the remain services //
				var nbRemainMaterials = 0;
				for(i in data.result){
					
					nbRemainMaterials++;
					$('#equipmentsListDone').append('<li id="equipment_'+data.result[i].id+'"><a href="#"><i class="icon-wrench"></i> '+ data.result[i].name + '-' + data.result[i].type + ' </a></li>');
				}
				$('#badgeNbEquipmentsDone').html(nbRemainMaterials);			
			}
		});
		

//		var filteredOthersEquipment = _.filter(filteredEquipment, function(item){
//			return item.attributes.small_material || item.attributes.fat_material;
//		});
//
//		_.each(filteredOthersEquipment, function (material, i){
//			var materialJSON = material.toJSON();
//				$('#equipmentsListDone').append('<li id="equipment_'+materialJSON.id+'"><a href="#"><i class="icon-wrench"></i> '+ materialJSON.name + '-' + materialJSON.type + ' </a></li>');
//		});
//
//		$('#badgeNbEquipmentsDone').html(_.size(filteredOthersEquipment));
	},


	/** Retrieve Equipment  (Vehicle)
	*/
	fillDropdownEquipment: function(e){
		e.preventDefault();
		var target = $(e.target).val();
		if( target ) {
			var equipment = app.collections.equipments.get( target );
			if( equipment ) {
				var km = equipment.toJSON().km ;
				$('.equipmentKm').val( km );
				$('.equipmentKm').attr('min', km )
			}
		}
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

			app.views.selectListOfficersTeamsView.collection = this.officersDropDownList;
			app.views.selectListOfficersTeamsView.clearAll();
			app.views.selectListOfficersTeamsView.addEmptyFirst();
			app.views.selectListOfficersTeamsView.addAll();
		}
		else if(itemToLoad == 'teams'){
			$('#btnSelectUsersTeams > i.iconItem.icon-user').addClass('icon-group').removeClass('icon-user');
			$('#selectUsersTeams').data('item', 'teams');
			app.views.selectListOfficersTeamsView.collection = this.teamsDropDownList;			
			app.views.selectListOfficersTeamsView.clearAll();
			app.views.selectListOfficersTeamsView.addEmptyFirst();
			app.views.selectListOfficersTeamsView.addAll();
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



		var vehicule =  $('#taskEquipmentDone').val()!=""? _($('#taskEquipmentDone').val() ).toNumber() : 0;
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


		//alert("TODO: Params must be send to OpenERP");
		this.selectedTask.reportHours(params, 
			{
				success: function(data){	
					$('#modalTaskDone').modal('hide');				
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
				}
			}
		);

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
		
		this.selectedTask.cancel($('#motifCancelTask').val(),
			{
				success: function(data){
					$('#modalCancelTask').modal('hide');
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
				}
			}
		);
		//alert("Merci de laisser du temps pour pouvoir développer cette fonctionnalité");
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



	/** Print a Task or an Intervention
	*/
	print: function(e){
		e.preventDefault();

		this.getTarget(e);

		if($(e.target).data('action') == 'inter'){

			console.log(this.selectedInter);
			
			this.selectedInter = app.collections.interventions.get(this.pos);
			var interJSON = this.selectedInter.toJSON();

			// Hide the print Inter section //
			$('#printTask div.forTask').hide();
			$('#printTask div.forInter').show();
			$('#tableTasks tbody').empty();

			// Display all the tasks of the inter //
			_.each(interJSON.tasks, function(task, i){
				$('#tableTasks tbody').append('<tr style="height: 70px;"><td>'+task.name+'</td><td>'+app.decimalNumberToTime(task.planned_hours, 'human')+'</td><td class="toFill"></td><td class="toFill"></td><td class="toFill"></td><td class="toFill"></td><td class="toFill"></td><td class="toFill"></td></tr>');
			})
		}
		else{
			this.selectedTask = app.collections.tasks.get(this.pos);
			var selectedTaskJSON = this.selectedTask.toJSON();

			// Get the inter of the Task //
			var inter = app.collections.interventions.get(this.selectedTask.toJSON().intervention.id);
			var interJSON = inter.toJSON();

			// Hide the print Inter section //
			$('#printTask div.forInter').hide();
			$('#printTask div.forTask').show();
			$('.field').html('');

			$('#taskLabel').html(selectedTaskJSON.name + ' <em>('+selectedTaskJSON.category_id[1]+')</em>');
			$('#taskPlannedHour').html(app.decimalNumberToTime(selectedTaskJSON.planned_hours, 'human'));
		}




		if(_.isNull(interJSON.ask)){
			$('#claimentName').html(interJSON.create_uid[1]);
		}else{
			if(interJSON.ask.partner_id != false){
				$('#claimentName').html(interJSON.ask.partner_id[1]+' - '+interJSON.ask.partner_address[1]);
				$('#claimentPhone').html(interJSON.ask.partner_phone);
			}
			else{
				$('#claimentName').html(interJSON.ask.people_name);
				$('#claimentPhone').html(interJSON.ask.people_phone);
			}

			$('#claimentType').html(interJSON.ask.partner_type[1]);
		}

		$('#interName').html(interJSON.name);
		$('#interDescription').html(interJSON.description);
		$('#interService').html(interJSON.service_id[1]);

		$('#interDateCreate').html(moment(interJSON.create_date).format('LL'));
		console.info(interJSON);
		console.log(interJSON);
		if(interJSON.date_deadline != false){
			$('#interDeadline').html(' / ' + moment(interJSON.date_deadline).format('LL'));
		}
		$('#interPlace').html(interJSON.site1[1]);
		$('#interPlaceMore').html(interJSON.site_details);


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

		if(this.options.page <= 1){
			this.render();
		}
		else{
			app.router.navigate(app.routes.interventions.baseUrl, {trigger: true, replace: true});
		}
		
	},



	/** Prevent the default action
	*/
	preventDefault: function(event){
		event.preventDefault();
	},
  
});




