/******************************************
* Requests List View
*/
app.Views.RequestsListView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'requestsList',

	filters: 'requestsListFilter',

	numberListByPage: 25,

	selectedRequest : 0,



	// The DOM events //
	events: {
		'click li.active'						: 'preventDefault',
		'click li.disabled'						: 'preventDefault',
			
		'click .buttonValidRequest'				: 'setInfoModal',
		'click .buttonRefuseRequest'			: 'setInfoModal',
		'click .buttonConfirmDST'				: 'setInfoModal',

		'submit #formValidRequest' 				: 'validRequest',
		'submit #formRefuseRequest' 			: 'refuseRequest',
		'submit #formConfirmDSTRequest' 		: 'confirmDSTRequest',

		'change #createAssociatedTask' 			: 'accordionAssociatedTask',

		'click #filterStateRequestList li:not(.disabled) a' 	: 'setFilter'
	},



	/** View Initialization
	*/
	initialize: function () {			
		//this.render();
	},



	/** Display the view
	*/
	render: function () {
		//app.Views.appView.prototype.render.call(this);
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.requestsList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		var requests = app.collections.requests.toJSON();

		requests = _.sortBy(requests, function(item){ 
			return item.date_start; 
		});

		// Collection Filter if not null //
		if(sessionStorage.getItem(this.filters) != null){
			requests = _.filter(requests, function(item){ 
				return item.state == sessionStorage.getItem(self.filters);
			});
		}
		


		var len = requests.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);


		// Retrieve the number Interventions due to the Group user //
		if(app.models.user.isDST()){
			var interventionsFilter = _.filter(requests, function(item){ 
				return item.state == app.Models.Request.state[1].value; 
			});
			var nbInterventionsInBadge = _.size(interventionsFilter);
		}
		else if(app.models.user.isManager()){
			var interventionsFilter = _.filter(requests, function(item){ 
				return item.state == app.Models.Request.state[0].value; 
			});
			var nbInterventionsInBadge = _.size(interventionsFilter);
		}
		else {
			var nbInterventionsInBadge = _.size(requests);
		}

		this.addInfoAboutInter(requests);


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
	  
			var template = _.template(templateData, {
				lang: app.lang,
				nbInterventionsInBadge: nbInterventionsInBadge,
				requests: requests,
				requestsState: app.Models.Request.state,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});

			console.debug(requests);

			$(self.el).html(template);
			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});

			
			// Display filter on the table //
			if(sessionStorage.getItem(self.filters) != null){
				$('a.filter-button').removeClass('filter-disabled').addClass('filter-active');
				$('li.delete-filter').removeClass('disabled');

				_.each(app.Models.Request.state, function (state, i) {
					if(state.value == sessionStorage.getItem(self.filters)){
						$('a.filter-button').addClass('text-'+state.color);
					}
				})
			}
			else{
				$('a.filter-button').removeClass('filter-active ^text').addClass('filter-disabled');
				$('li.delete-filter').addClass('disabled');
			}

			// Display the Tooltip or Popover //
			$('*[rel="popover"]').popover({trigger: 'hover'});
			$('*[rel="tooltip"]').tooltip({placement: 'top'});


			// Set the focus to the first input of the form //
			$('#modalValidRequest, #modalRefuseRequest, #modalConfirmDSTRequest').on('shown', function (e) {
				$(this).find('input:not(:disabled), textarea').first().focus();
			})

		});


		$(this.el).hide().fadeIn('slow');
		return this;
	},



    addInfoAboutInter: function(requests) {
    	_.each(requests, function (request, i) {
    		this.infoMessage = "";
    		var self = this;
    		_.each(request.intervention_ids, function (intervention, i) {
				var classColor = "";
				
				//var intervention = interModel.toJSON();
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

				self.infoMessage = intervention.create_uid!=null? "par " + intervention.create_uid[1] + ". ": ""; 
		    	if( firstDate ) {
		    		if( intervention.progress_rate==0 )
						self.infoMessage += "Début prévue le " + firstDate.format('LLL'); 
					else if( lastDate )
						self.infoMessage += "Fin prévue le " + lastDate.format('LLL'); 
					else{
			    		self.infoMessage += "Remis en plannification";
					}
				}
				else{
					self.infoMessage += "Non planifiée";
				}

			    if( intervention.state==app.Models.Intervention.state[4].value ) 
					infoMessage = intervention.cancel_reason

				console.debug("message:" + infoMessage + ", classColor:"+ classColor);
			});   
				
			request['infoMessage'] = this.infoMessage;
    	});
    },



	/** Display informations about the request in the Modal view
	*/
	setInfoModal: function(e){

		var btn = $(e.target);

		// Retrieve the ID of the request //
		this.pos = btn.parents('tr').attr('id');
		this.model = app.collections.requests.get(this.pos);
		this.selectedRequest = this.model.toJSON();


		if(btn.hasClass("buttonValidRequest")){
			$('#requestName').val(this.selectedRequest.name);
			$('#infoModalValidRequest').children('small').html(this.selectedRequest.description);
			
			//search no technical services
			var noTechnicalServices = _.filter(app.collections.claimersServices.models, function(service){
				return service.attributes.technical != true 
			});
			//remove no technical services
			app.collections.claimersServices.remove(noTechnicalServices);
			
			app.views.selectServicesView = new app.Views.DropdownSelectListView({el: $("#requestService"), collection: app.collections.claimersServices})
			app.views.selectServicesView.clearAll();
			app.views.selectServicesView.addEmptyFirst();
			app.views.selectServicesView.addAll();
			if( this.selectedRequest.service_id )
				app.views.selectServicesView.setSelectedItem( this.selectedRequest.service_id[0] );
			else {
				if( this.selectedRequest.belongsToService )
					app.views.selectAssignementsView.setSelectedItem( this.selectedRequest.belongsToService.id );
			}
			
			app.views.selectAssignementsView = new app.Views.DropdownSelectListView({el: $("#requestAssignement"), collection: app.collections.assignements})
			app.views.selectAssignementsView.clearAll();
			app.views.selectAssignementsView.addEmptyFirst();
			app.views.selectAssignementsView.addAll();
			if( this.selectedRequest.belongsToAssignement )
				app.views.selectAssignementsView.setSelectedItem( this.selectedRequest.belongsToAssignement.id );
			
			$('#requestNote').val(this.selectedRequest.description);

			// Set the current date to the input date Deadline //
			$('#requestDeadline').val(moment().format("L"));
			
			// Enable the datePicker //
			$('.datePicker').datepicker({
				format: 'dd/mm/yyyy',
				weekStart: 1,
				autoclose: true,
				language: 'fr'
			});

		}
		else if(btn.hasClass("buttonRefuseRequest")){
			$('#infoModalRefuseRequest').children('p').html(this.selectedRequest.name);
			$('#infoModalRefuseRequest').children('small').html(this.selectedRequest.description);
		}
		else if(btn.hasClass("buttonConfirmDST")){
			$('#infoModalConfirmDST').children('p').html(this.selectedRequest.name);
			$('#infoModalConfirmDST').children('small').html(this.selectedRequest.description);
		}
		
	},



	/** Valid the request
	*/
	validRequest: function(e){
		e.preventDefault();
		
	    var duration = $("#taskHour").val().split(":");
	    var mDuration = moment.duration ( { hours:duration[0], minutes:duration[1] });
	    
		params = {
				//ask_id: this.model.getId(),	
				request_state: app.Models.Request.state[2].value,
				email_text: app.Models.Request.state[2].traduction,
				project_state: app.Models.Intervention.state[1].value,
		        description: $('#requestNote').val(),
		        //date_deadline: $('#requestDeadline').val(),
		        intervention_assignement_id: $('#requestAssignement').val(),
		        service_id: $('#requestService').val(),	
				site1: this.model.getSite1()[0],
				planned_hours: mDuration.asHours(),
				create_task: $('#createAssociatedTask').is(':checked'),
		};
	    
	    this.model.valid(params,
			{
				success: function(data){
					$('#modalValidRequest').modal('hide');
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
				}
			}
		);
	},



	/** Refuse the request
	*/
	refuseRequest: function(e){
		e.preventDefault();

		params = {
		        state: app.Models.Request.state[4].value,
		        email_text: app.Models.Request.state[4].traduction,
		        refusal_reason: $('#motifRefuse').val(),		
		};		
		this.saveNewState( params,$('#modalRefuseRequest') );
	},



	/** Set the request state to Confirm DST
	*/
	confirmDSTRequest: function(e){
		e.preventDefault();
		params = {
		        state: app.Models.Request.state[1].value,
		        email_text: app.Models.Request.state[1].traduction,
		        note: $('#motifDST').val(),		
		};
		this.saveNewState( params, $('#modalConfirmDSTRequest') );

	},



	saveNewState: function(params, element) {
		var self = this;
		self.element = element;
		self.params = params
		this.model.save(params, {
				    success: function (data) {
					        console.log(data);
					        if(data.error){
					    		app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					        }
					        else{					        	
					            console.log('NEW STATE REQUEST SAVED');
					            if( self.element!= null )
					            	self.element.modal('hide');
					            self.model.update(params);
					            //app.collections.requests.get(self.pos).update(self.model);
					            self.render();
					            
					            //Send mail except confirm status
					            //if( self.params.state!=app.Models.Task.state[1].value) {
					            	//self.model.sendEmail(null);
					            //}
					        }
					    },
					    error: function () {
							console.log('ERROR - Unable to valid the Request - RequestsListView.js');
					    },           
					},false);
	},



	/** Filter Requests
	*/
	setFilter: function(e){
		event.preventDefault();

		var link = $(e.target);

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
			app.router.navigate('demandes-dinterventions', {trigger: true, replace: true});
		}
		
	},



	/** Display or Hide Create associated Task Section
	*/
	accordionAssociatedTask: function(event){
		event.preventDefault();

		// Toggle Slide Create associated task section //
		$('fieldset.associated-task').stop().slideToggle(function(){
			$('#modalValidRequest div.modal-body').animate({scrollTop: $('#modalValidRequest div.modal-body').height()}, 400);
		});
	},



	/** Prevent the default action
	*/
	preventDefault: function(event){
		event.preventDefault();
	},
	
//	setElement: function(element, delegate) {
//	    if (this.$el) this.undelegateEvents();
//	    this.$el = (element instanceof $) ? element : $(element);
//	    this.el = this.$el[0];
//	    if (delegate !== false) this.delegateEvents();
//	    return this;
//	 },

});