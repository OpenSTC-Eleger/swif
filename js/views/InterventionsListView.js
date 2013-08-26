/******************************************
* Interventions List View
*/
app.Views.InterventionsListView = app.Views.GenericListView.extend({

	templateHTML: 'interventions',

	filters: 'intersListFilter',
	
	numberListByPage: 25,
	selectedInter : '',
	selectedTask : '',
	collections:  {},

	// The DOM events //
	events: function(){
		return _.defaults({
			'click li.active'					: 'preventDefault',
			'click li.disabled'					: 'preventDefault',
			'click ul.sortable li'				: 'preventDefault',

			'click a.modalCreateInter'			: 'displayModalSaveInter',
			
//			'click .btn.addTask'                : 'displayModalAddTask',
//			'submit #formAddTask'         		: 'saveTask',
//
//			'click a.modalDeleteTask'   		: 'displayModalDeleteTask',
//			'click button.btnDeleteTask'   		: 'deleteTask',
//
//			'click a.buttonCancelInter'			: 'displayModalCancelInter',
//			'submit #formCancelInter' 			: 'cancelInter',
//
//			'click a.buttonCancelTask'			: 'displayModalCancelTask',
//			'submit #formCancelTask' 			: 'cancelTask',
//
//			'click a.printTask, a.printInter'	: 'print',
//
//			'click .buttonTaskDone, .buttonNotFinish' : 'displayModalTaskDone',
//			'submit #formTaskDone'   			: 'taskDone',
//			'click a.linkSelectUsersTeams'		: 'changeSelectListUsersTeams',
//			'click .linkRefueling'				: 'accordionRefuelingInputs',
//
//			'change .taskEquipment'				: 'fillDropdownEquipment',

//			'click a.accordion-object'    		: 'tableAccordion',

			'click #filterStateInterList li:not(.disabled) a' 	: 'setFilter'
		}, 
			app.Views.GenericListView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {
		var self = this;
		console.log('Interventions view Initialize');
		this.initCollections().done(function(){
			app.router.render(self);
			// Unbind & bind the collection //
			self.collections.interventions.off();
			self.listenTo(self.collections.interventions, 'add',self.add);
		});
	},

	add: function(model){
		var itemInterView  = new app.Views.ItemInterventionView({ model: model });
		var itemInterTaskListView = new app.Views.ItemInterventionTaskListView({ inter: model, tasks: [] });
		$('#inter-items').prepend(itemInterTaskListView.render().el);
		$('#inter-items').prepend(itemInterView.render().el);
		itemInterView.highlight().done(function(){
			itemInterView.expendAccordion();
		});

		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.interventionSaveOK);
		
		this.partialRender();

		//this.options.id = model.getId();
		app.router.navigate(app.views.interventions.urlBuilder(), {trigger: false, replace: false});
	},

	/** Partial Render of the view
	*/
	partialRender: function (type) {
		var self = this;
		$.when(self.collections.interventions.pendingInterventionsCount(),
				self.collections.interventions.plannedInterventionsCount()).done(function(){
			$('#nbInterPlanned').html(self.collections.interventions.plannedInterventions);
			$('#nbInterPending').html(self.collections.interventions.pendingInterventions);
		});
		//@TODO: update view to use paginationView
		
		//this.collection.count(this.fetchParams).done(function(){
			//$('#bagdeNbTeams').html(self.collection.cpt);
			//app.views.paginationView.render();
		//});
	},
	
	/** Display the view
	*/
	render : function() {
		var self = this;
		console.log('-----------Interventions list view rendering--------------');
		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.interventionsMonitoring);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		var interventions = this.collections.interventions.toJSON();
		var len = this.collections.interventions.cpt;
		var pageCount = Math.ceil(len / app.config.itemsPerPage);

		var startPos = (this.options.page.page - 1) * app.config.itemsPerPage;
		var endPos = startPos + app.config.itemsPerPage;
		// Retrieve the HTML template //
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang                   : app.lang,
				nbInterventions        : len,
				nbInterventionsPending : self.collections.interventions.pendingInterventions,
				nbInterventionsPlanned : self.collections.interventions.plannedInterventions,
				interventionsState     : app.Models.Intervention.status,
				interventions          : interventions,
				startPos               : startPos, endPos: endPos,
				page                   : self.options.page.page, 
				pageCount              : pageCount,
			});


			$(self.el).html(template);
//
//
//			$('*[data-toggle="tooltip"]').tooltip();
//			$('*[rel="popover"]').popover({trigger: 'hover'});
//			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
//			$(".datepicker").datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });
//
//
//			$('tr.row-object').css({ opacity: '1'});
//			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
//			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
//
//
//			$('#equipmentsDone, #equipmentsListDone').sortable({
//				connectWith: 'ul.sortableEquipmentsList',
//				dropOnEmpty: true,
//				forcePlaceholderSize: true,
//				forceHelperSize: true,
//				placeholder: 'sortablePlaceHold',
//				containment: '.equipmentsDroppableAreaDone',
//				cursor: 'move',
//				opacity: '.8',
//				revert: 300,
//				receive: function(event, ui){
//					//self.saveServicesCategories();
//				}

			// Display filter on the table //
			if(!_.isUndefined(self.options.filter)){
				$('a.filter-button').removeClass('filter-disabled').addClass('filter-active');
				$('li.delete-filter').removeClass('disabled');

				var applyFilter = self.options.filter;

				if(applyFilter.value != 'overrun') {
					$('a.filter-button').addClass('text-'+app.Models.Intervention.status[applyFilter.value].color);
				}
				else{
					$('a.filter-button').addClass('text-overrun');
				}
			}
			else{
				$('a.filter-button').removeClass('filter-active ^text').addClass('filter-disabled');
				$('li.delete-filter').addClass('disabled');
			}


//			// Set the focus to the first input of the form //
//			$('#modalCancelInter, #modalDeleteTask, #modalAddTask, #modalCancelTask').on('shown', function (e) {
//				$(this).find('input, textarea').first().focus();
//			})
			
			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);
			
			// Create item intervention view //
			_.each(self.collections.interventions.models, function(inter, i){
				var tasks = new app.Collections.Tasks();
				_.each(inter.toJSON().tasks,function(item,i){
					tasks.add(self.collections.tasks.get(item));
				});
				var itemInterventionView = new app.Views.ItemInterventionView({model: inter});
				$('#inter-items').append(itemInterventionView.render().el);
				var itemInterventionTaskListView = new app.Views.ItemInterventionTaskListView({inter: inter, tasks: tasks});
				$('#inter-items').append(itemInterventionTaskListView.render().el);
				
			});

			
		});
		$(this.el).hide().fadeIn();
		return this;
	},


	getTarget:function(e) {    	
		e.preventDefault();
		// Retrieve the ID of the intervention //
		var link = $(e.target);
		if(link.parents('tr').length > 0){
			this.pos =  _(link.parents('tr').attr('id')).strRightBack('_');
		}
		else{
			this.pos = -1;
		}
		},


	/** Display the form to add / update an intervention
	*/
	displayModalSaveInter: function(e){
		//this.getTarget(e);
		e.preventDefault();
		var params = {el:'#modalSaveInter'}
//		if(this.pos > -1){
//			params.model = this.collections.interventions.get(this.pos);
//		}
		new app.Views.ModalInterventionView(params);
	},
	




	/** Prepare Modals
	*/
	displayModalDeleteTask: function(e){
		this.getTarget(e);
		this.selectedTask = this.collections.tasks.get(this.pos);
		this.selectedTaskJSON = this.selectedTask.toJSON();
		$('#infoModalDeleteTask').children('p').html(this.selectedTaskJSON.name);
		$('#infoModalDeleteTask').children('small').html(this.selectedTaskJSON.description);
	},


	displayModalCancelInter: function(e) {
		this.getTarget(e);
		this.selectedInter = this.collections.interventions.get(this.pos);
		this.selectedInterJSON = this.selectedInter.toJSON();
		$('#infoModalCancelInter').children('p').html(this.selectedInterJSON.name);
		$('#infoModalCancelInter').children('small').html(this.selectedInterJSON.description);
	},

	displayModalCancelTask: function(e) {
		var button = $(e.target);
		this.selectedTask = this.collections.tasks.get(button.data('taskid'));
		this.selectedTaskJSON = this.selectedTask.toJSON();

		$('#infoModalCancelTask').children('p').html(this.selectedTaskJSON.name);
		$('#infoModalCancelTask').children('small').html('<i class="icon-pushpin"></i>&nbsp;' + this.selectedTaskJSON.project_id[1]);
	},

	displayModalTaskDone: function(e){
		var button = $(e.target);
		var self = this;
		// Retrieve the Task //
		if(!button.is('i')){
			this.selectedTask = this.collections.tasks.get(button.data('taskid'));
		}
		else{
			this.selectedTask = this.collections.tasks.get(button.parent().data('taskid'));	
		}

	

		// Display or nor the Remaining Time Section //
		if(button.hasClass('buttonNotFinish') || button.hasClass('iconButtonNotFinish')){
			$('#remainingTimeSection').show();
		}
		else{
			$('#remainingTimeSection').hide();
		}


		this.selectedTaskJSON = this.selectedTask.toJSON();
		//var intervention = this.collections.interventions.get(this.selectedTaskJSON.project_id[0]).toJSON();
		//var serviceInter = intervention.service_id;


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
		$('#infoModalTaskDone').children('small').html('<i class="icon-pushpin"></i>&nbsp;' + this.selectedTaskJSON.project_id[1]);


		$("#startDate").val(  moment().format('L') );
		$("#endDate").val( moment().format('L') );

		// Set Task Planned Hour //
		$("#startHour").timepicker('setTime', moment().format('LT') );
		$("#endHour").timepicker('setTime', moment().add('hour', this.selectedTaskJSON.planned_hours).format('LT') );

		
//		// Filter Equipment by service on intervention's task //
		var task_id = this.selectedTask.id;
		
		// Search only vehicles //
		$.ajax({
			url: '/api/openstc/tasks/' + task_id.toString() + '/available_vehicles',
			
			success: function(data){
				// Fill equipment List //
				self.collections.vehicles = new app.Collections.Equipments(data);
				app.views.selectListEquipmentsView = new app.Views.DropdownSelectListView({el: $("#taskEquipmentDone"), collection: self.collections.vehicles})
				app.views.selectListEquipmentsView.clearAll();
				app.views.selectListEquipmentsView.addEmptyFirst();
				app.views.selectListEquipmentsView.addAll();
			}
		});
		
		// Search only materials //
		$('#equipmentsListDone').empty();
		$.ajax({
			url: '/api/openstc/tasks/' + task_id.toString() + '/available_equipments',
			success: function(data){
				// Display the remain materials //
				var nbRemainMaterials = 0;
				for(i in data){
					
					nbRemainMaterials++;
					$('#equipmentsListDone').append('<li id="equipment_'+data[i].id+'"><a href="#"><i class="icon-wrench"></i> '+ data[i].name + '-' + data[i].type + ' </a></li>');
				}
				$('#badgeNbEquipmentsDone').html(nbRemainMaterials);			
			}
		});
	},


	/** Retrieve Equipment  (Vehicle)
	*/
	fillDropdownEquipment: function(e){
		e.preventDefault();
		var target = $(e.target).val();
		if( target ) {
			var equipment = this.collections.vehicles.get( target );
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
		//var intervention = this.selectedTaskJSON.intervention;
		//var serviceInter = intervention.service_id;
		

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
		var self = this;

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
		//this.selectedTask.reportHours(params, 
		this.selectedTask.save(params, {silent: true, patch: true})
			.done(function(){
				self.selectedTask.fetch().done(function(){
					$('#modalTaskDone').modal('hide');				
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
					})
					.fail(function(e){
						console.log(e)
					})
			})
			.fail(function(e){
				console.log(e)
			});

	},



	

	/** Delete task
	*/
	deleteTask: function(e){
		var self = this;
		this.selectedTask.destroy().done(function(data){
//			this.collections.tasks.remove(self.selectedTask);
//			var inter = this.collections.interventions.get(self.selectedTaskJSON.intervention.id);					
//			inter.attributes.tasks.remove(self.selectedTaskJSON.id);
//			this.collections.interventions.add(inter);
			$('#modalDeleteTask').modal('hide');
			app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.serviceDeleteOk);
			//self.render();
			route = Backbone.history.fragment;
			Backbone.history.loadUrl(route);
		})
		.fail(function(e){
			console.log(e)
			alert("Impossible de supprimer la tâche");
		});

	},


	/** Cancel Intervention
	*/
	cancelInter: function(e){
		e.preventDefault();
		
		this.selectedInter.cancel($('#motifCancel').val()).done(function(data){
			$('#modalCancelInter').modal('hide');
			route = Backbone.history.fragment;
			Backbone.history.loadUrl(route);
		})
	},


	/** Cancel Task
	*/
	cancelTask: function(e){
		e.preventDefault();
		
		this.selectedTask.cancel($('#motifCancelTask').val())
			.done(function(){
				$('#modalCancelTask').modal('hide');
				route = Backbone.history.fragment;
				Backbone.history.loadUrl(route);
			})
			.fail(function(e){
				console.log(e)
			})
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
					this.collections.interventions.add(self.selectedInter);
					self.render();
				}
			},
			error: function () {
				console.log('ERROR - Unable to valid the Inter - InterventionView.js');
			},
		},false);
	},




	/** Filter Request
	*/
	setFilter: function(event){
		event.preventDefault();

		var link = $(event.target);

		var filterValue = _(link.attr('href')).strRightBack('#');

		// Set the filter in the local Storage //
		if(filterValue != 'delete-filter'){
//			sessionStorage.setItem(this.filters, filterValue);
			this.options.filter = {by: 'state', value:filterValue};
		}
		else{
			delete this.options.filter;
		}

//		if(this.options.page <= 1){
//			this.render();
//		}
//		else{
//			app.router.navigate(app.routes.interventions.baseUrl, {trigger: true, replace: true});
//		}
		app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});

	},



	/** Prevent the default action
	*/
	preventDefault: function(event){
		event.preventDefault();
	},
	
	initCollections: function(){
		var self = this;
		
		// Check if the collections are instantiated //
		if(_.isUndefined(this.collections.tasks)){ this.collections.tasks = new app.Collections.Tasks(); }
		if(_.isUndefined(this.collections.interventions)){this.collections.interventions = new app.Collections.Interventions();}
		
		//check sort parameter
		if(_.isUndefined(this.options.sort)){
			this.options.sort = this.collections.interventions.default_sort;
		}
		else{
			this.options.sort = app.calculPageSort(this.options.sort);	
		}
		
		
		// Construction of the domain (filter and search, special domain if filter == overrun)
		var domain = [];
		var optionSearch = {};
		//Retrieve search domain given by search box and / or by filter
		if(!_.isUndefined(this.options.search)){
			// Collection Filter if not null //
			optionSearch.search = this.options.search;
		}
		if(!_.isUndefined(this.options.filter) && !_.isNull(this.options.filter)){
			this.options.filter = app.calculPageFilter(this.options.filter);

			//interventions = _.filter(interventions, function(item){ 
			if(this.options.filter.value == 'overrun'){
				//return (item.state == app.Models.Intervention.status.closed.key && item.overPourcent > 100);
				domain.push({field:'state',operator:'=',value:'closed'});
				domain.push({field:'overPourcent',operator:'>',value:'100.0'});
			}
			else{
				optionSearch.filter = this.options.filter;
			}
		}
		//'Unbuild' domain objectify to be able to add other filters (and objectify when all filters are added
		var searchDomain = app.calculSearch(optionSearch, app.Models.Intervention.prototype.searchable_fields);
		_.each(searchDomain,function(item, index){
			domain.push(item);
		});	
		
		this.options.page = app.calculPageOffset(this.options.page);

		// Create Fetch params //
		var fetchParams = {
			silent : true,
			data   : {
				limit  : app.config.itemsPerPage,
				offset : this.options.page.offset,
				filters: app.objectifyFilters(domain)
			}
		};
		if(!_.isUndefined(this.options.sort)){
			fetchParams.data.sort = this.options.sort.by+' '+this.options.sort.order;
		}
		
		fetchParams.data.fields = this.collections.interventions.fields;
		app.loader('display');
		
		var deferred = $.Deferred();
		//retrieve interventions and tasks associated (use domain ('project_id','in',[...] to retrieve tasks associated)
		this.collections.interventions.fetch(fetchParams)
		.done(function(){
			if(self.collections.interventions.cpt > 0){
				self.collections.tasks.fetch({silent: true,data: {filters: {0:{'field':'project_id.id','operator':'in','value':self.collections.interventions.pluck('id')}}}})
				.done(function(){
					deferred.resolve();
				})
				.fail(function(e){
					console.error(e);
				})
			}
			else{
				deferred.resolve();
			}
		})
		.fail(function(e){
			console.error(e);
		})
		.always(function(){
			app.loader('hide');
		});
		
		return deferred;
	}
  
});




