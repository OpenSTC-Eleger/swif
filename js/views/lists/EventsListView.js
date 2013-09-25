/******************************************
* Events List View
*/
app.Views.EventsListView = Backbone.View.extend({
	
	//template name
	templateHTML: 'calendar',	
	//Dom element for calendar
	divCalendar : 	null,
	
	calendarView: 	'agendaWeek',	
	teamMode    :		 false,
	initialized : false,
	
	events: {
		'click .fc-button-prev'                  	: 'previousDate',
		'click .fc-button-next'                  	: 'nextDate',
		'click #listAgents li a, #listTeams li a' 	: 'selectPlanning',

		'keyup #searchOfficerOrTeam'             : 'searchOfficerOrTeam'
	},
	
	urlParameters : ['officer','team','year','week'],
	
	/**
	 * Initialize calendar view
	 */
	initialize: function(){	
	
		var self = this;
		this.collections = this.options.collections;
		
		var collection = null;
		
		if(!_.isUndefined(this.options.team)) {
			//get team model selected on calendar
			this.teamMode = true;			
			this.model = _.find(this.collections.teams, function (o) { 
				return _.slugify(o.name).toUpperCase() == self.options.team
			});
		} else {
			//get officer model selected on calendar
			if(_.isUndefined(this.options.officer)) {
				this.model = this.collections.officers[0];
				// Initialize first officer in tab if no officer passed in url
				this.options.officer = _.slugify(this.model.name).toUpperCase()
			}
			else{
				this.model = _.find(this.collections.officers, function (o) { 
					return _.slugify(o.name).toUpperCase() == self.options.officer.toUpperCase()
				});				
			}
		}
		
		// Initialize year,week parameters if not yet in url with current year/week (for prev/next button on calendar)
		if(_.isUndefined(this.options.year)) {
			this.options.year = moment().year();
			this.options.week = moment().week();
		}
		
		//DOM element id for calendar with model
		this.divCalendar = 'div#calendar_' + this.model.id;	
		
	},

    
	/** Display the view
	*/
	render: function() {
		var self = this;

		// Retrieve the template //
		$.get('templates/' + this.templateHTML + '.html', function(templateData){
			var template = _.template(templateData, {
				lang: app.lang,		
				calendar   	: self.model,
				officers	: self.collections.officers,
				teams		: self.collections.teams
			});
			
			self.$el.html(template);	
			// Init calendar
			var momentDate = moment().year(self.options.year).week(self.options.week);			
        	self.initCalendar(momentDate);


        	$('#searchOfficerOrTeam').focus();
        	
        	
			if(!_.isUndefined(self.options.team)) {
				// Check if a Team was selected to select the Team Tab 
				$('#allTabs a[data-target="#tab-teams"]').tab('show');
				// Select team was selected
				$("a[href$="+self.options.team+"]").parent().addClass('active');				
			}
			// Select officer was selected
			else if(!_.isUndefined(self.options.officer)) {
				// Check if a Team was selected to select the Team Tab 
				$('#allTabs a[data-target="#tab-agents"]').tab('show');
				// Select first officer
				$("a[href$="+self.options.officer+"]").parent().addClass('active');
			}
			else
				$("#listAgents li:first").addClass('active');
		});

		return this;
	},


	
	/**
	 * Go to next week
	 */
	nextDate: function(e) {
		this.options.week = String(parseInt(this.options.week)+1);
		app.router.navigate(this.urlBuilder(), {trigger: false, replace: false});
		//Add new url in pagination for intervention panel 
		app.views.planningInterListView.paginationRender();
	},

	/**
	 * Go to previous week
	 */
	previousDate: function(e) {
		this.options.week = String(parseInt(this.options.week)-1);
		app.router.navigate(this.urlBuilder(), {trigger: false, replace: false});
		//Add new url in pagination for intervention panel 
		app.views.planningInterListView.paginationRender();
	},
	
	/**
	 * Go to planning selected
	 */
	selectPlanning: function(e) {
		e.preventDefault();
		
		var link = $(e.target);
		var linkId = link.attr('id')	
		
		this.teamMode = _.str.include( _(linkId).strLeft('_').toLowerCase(),"officer" )?false:true;			
		var calendarName = _(link.attr('href')).strRightBack('/')

		if(this.teamMode) {
			this.options.team = calendarName;
			delete this.options.officer; 
		} else {
			this.options.officer = calendarName;
			delete this.options.team;
		}
		
		app.router.navigate(this.urlBuilder(), {trigger: false, replace: true});
		this.initialize();
		this.render();
		
		//Add new url in pagination for intervention panel 
		app.views.planningInterListView.paginationRender();
		
	},
	

	/**
	 * Constructs url for planning
	 */
	urlBuilder: function() {
		var self = this;
		var url = _(Backbone.history.fragment).strLeft('/');

		// Iterate all urlParameters //
		_.each(this.urlParameters, function(value, index){		
			// Check if the options parameter aren't undefined or null //
			if(!_.isUndefined(self.options[value]) && !_.isNull(self.options[value])){	
					url += '/'+value+'/'+self.options[value];					
			}
		});				
		return url;		
	},

   /**
    * Init fullcallendar
    */
    initCalendar: function(date) {
    	var self = this;

    	this.calendar = $(this.divCalendar).fullCalendar({
    		
    		/** Full calendar attributes **/
    		month:	date.month(),
    		year:	date.year(),
    		date: 	date.date(),
			defaultView: self.calendarView,
    		ignoreTimezone: false,
			aspectRatio: 1.30,
			header: {
			    left: 'infosUser',
			    center: 'title',
			    right: 'today,prev,next'
			},
			// time formats
			titleFormat: {
			    month: 'MMMM yyyy',
			    week:"'Semaine 'W' du' dd [MMM] [yyyy] {'au' dd MMM yyyy}",
			    day: 'dddd dd MMM yyyy'
			},
			columnFormat: {
			    month: 'ddd',
			    week: 'ddd dd/M',
			    day: 'dddd dd/M'
			},
			firstDay: 1,
			axisFormat: 'HH:mm',
			timeFormat: 'H(:mm){ - H(:mm)}',

			monthNames: app.lang.monthNames,
			monthNamesShort: app.lang.monthNamesShort,
			dayNames: app.lang.dayNames,
			dayNamesShort: app.lang.dayNamesShort,
			buttonText: {
			    today: app.lang.today,
			    month: app.lang.month,
			    week: app.lang.week,
			    day: app.lang.day
			},
			allDayText: app.lang.daytime,
			slotMinutes	: 30,
			firstHour	: 8,
			minTime		: app.config.startWorkTime,
			maxTime		: app.config.endWorkTime,
			defaultEventMinutes	: 30,
			dragOpacity	: 0.5,
			weekends	: true,
			droppable	: true,
			selectable	: true,
			selectHelper: true,
			editable	: true,
			dragRevertDuration	:0,
			startOfLunchTime	: app.config.startLunchTime,
			endOfLunchTime		: app.config.endLunchTime,
	
    		/**
    		 * Calculates events to display on calendar for officer (or team) on week selected
    		 */    		
			events: function(start, end, callback) { 
    			var fetchParams={
					silent : true,
					data   : {}
				};
    				
    			var domain = [
    			              	{ 'field' : 'date_start', 'operator' : '>', 'value' : moment(start).format('YYYY-MM-DD HH:mm:ss') },
    			              	{ 'field' : 'date_end', 'operator' : '<', 'value' : moment(end).format('YYYY-MM-DD HH:mm:ss')  },    			              	
    			             ]
    			
    			if(self.teamMode){
        			var users = app.models.user.getOfficerIdsByTeamId(self.model.id)
        			if( users.length>0 )
        				domain.push(		'|',
        								   { 'field' : 'team_id.id', 'operator' : '=', 'value' : self.model.id },
        				                   { 'field' : 'user_id.id', 'operator' : 'in', 'value' : users  }
        				               )
        			else
        				domain.push({ 'field' : 'user_id.id', 'operator' : '=', 'value' : self.model.id })
    			}
    			else{
        			var teams = app.models.user.getTeamIdsByOfficerId(self.model.id)
        			if( teams.length>0 )
        				domain.push(		'|',
        								   { 'field' : 'user_id.id', 'operator' : '=', 'value' : self.model.id },
        				                   { 'field' : 'team_id.id', 'operator' : 'in', 'value' : teams  }
        				               )
        			else
        				domain.push({ 'field' : 'user_id.id', 'operator' : '=', 'value' : self.model.id })
    			}

	    		fetchParams.data.filters    = app.objectifyFilters(domain),
	    		self.collection = new app.Collections.Tasks();
	    		//Get tasks for domain
				self.collection.fetch(fetchParams).done(function(data){					
					//Transforms tasks in events for fullcalendar
					self.events = self.fetchEvents();	
					self.collection.off();
					self.listenTo(self.collection, 'add', self.refreshEvents);
					self.listenTo(self.collection, 'change', self.refreshEvents);
					self.listenTo(self.collection, 'remove', self.refreshEvents);
					
					self.initPrintView();
					//Display events on calendar					
					callback(self.events);
				});
			},			

			/**
			 * Open leave time modal (Absent task)
			 */
			select: function( startDate, endDate, allDay, jsEvent, view) {
				 
				app.views.modalAbsentTaskView = new app.Views.ModalAbsentTaskView({
    				el    		: '#modalAbsentTask',
    				model		: self.model,
    				collection 	: self.collection,
    				startDate 	: startDate ,	
    				endDate		: endDate ,
    				teamMode	: self.teamMode,
    				allDay  	: allDay,
    			});

			},

			/** When a event is Drop on the calendar : plan in backend
			*/
			drop: function( date, allDay ) {

				var domObject = $(this)
				var originalEventObject = $(this).data('eventObject');
				var copiedEventObject = $.extend({}, originalEventObject);
				copiedEventObject.allDay = allDay;
				copiedEventObject.start = date; //$.fullCalendar.formatDate(date, 'yyyy-MM-dd HH:mm:ss');
			
				var params = {
				        task_id	: copiedEventObject.id,	
						start_working_time : app.config.startWorkTime,
						end_working_time : app.config.endWorkTime,
						start_lunch_time : app.config.startLunchTime,
						end_lunch_time : app.config.endLunchTime,
						start_dt: copiedEventObject.start ,
						team_mode : self.teamMode,
						calendar_id : self.model.id,
				}
				
				
				var model = new app.Models.TaskSchedules();
				
				model.save(params, {patch: false, silent: true})
					.done(function(ids) {
						self.collections.interventions.get(copiedEventObject.project_id).fetch();
						self.refreshEvents();
					})
					.fail(function (e) {
						console.log(e);
					})
			},

			/**
			 * Drop event from time slot to another
			 */
			eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) { 
				var model = self.collection.get(event.id)
			
			    params = { 
			       date_start: event.start,
			       date_end: event.end,
			    };
			    
				model.save(params, {patch: true, silent: true})
				.fail(function (e) {
					console.log(e);
				})
			},


			/**
			 * Resize event
			 */
			eventResize: function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) { 			    
			    
			    var model = self.collection.get(event.id)
			    
			    newEvent = self.events.filter(function (element) { 
				    return element.id == event.id;
				})[0];
				
			    params = {
				   date_start: event.start,
			       date_end: event.end,
			       planned_hours: (event.planned_hours + (minuteDelta)/60),
			       total_hours: (event.total_hours + (minuteDelta)/60),
			       remaining_hours: (event.remaining_hours + (minuteDelta)/60),
				};
			    

			    newEvent.date_start = event.start;
			    newEvent.date_end = event.end;
			    newEvent.planned_hours = (event.planned_hours + (minuteDelta)/60);
			    newEvent.total_hours = (event.total_hours + (minuteDelta)/60);
			    newEvent.remaining_hours =  (event.remaining_hours + (minuteDelta)/60);
			   
				model.save(params, {patch: true, silent: true})
					.done(function(data) {
						//If task has intervention (absent task has no intervention)
						if( model.toJSON().project_id != false )
							self.collections.interventions.get(model.toJSON().project_id[0]).fetch();
					})
					.fail(function (e) {
						console.log(e);
					})
			},
			
			/** Task is click on the calendar : display unplan task modal
    	    */
    	    eventClick: function(fcEvent, jsEvent, view) {
    	    	var taskModel = self.collection.get(fcEvent.id);
    	    	var taskModelJSON = taskModel.toJSON();
    	    	var interModel = null;
    	    	if( taskModelJSON.project_id!=false )
    	    		interModel = self.collections.interventions.get(taskModelJSON.project_id[0]); 
    			app.views.modalUnplanTaskView = new app.Views.ModalUnplanTaskView({
    				el    		: '#modalUnplanTask',
    				model 	    : taskModel,
    				interModel	: interModel,
    			});
    		},
		});
	
    	/**
    	 * Get calendar name
    	 */
		var username = $(this.divCalendar).data('username');
		
		/**
		 * Add personal icon for officer on calendar 
		 */
		$('table td.fc-header-left').html("<img src='css/images/unknown-person.jpg' width='80px' class='img-polaroid'> <span class='lead text-info'>"+username+"</span>");		
	},
	// -------------------- End fullcalendar initialization -------------------- //
	
	/**
	 * Transforms tasks in events for fullcalendar
	 */	    
    fetchEvents: function() {
    	this.events = [];
    	var self = this;
    	
    	_.each(this.collection.models , function (model, i){
    		var task = model.toJSON();
    		var actionDisabled = task.state == app.Models.Task.status.done.key || task.state == app.Models.Task.status.cancelled.key;

    		var title = task.name;
    		//team mode
    		if( self.teamMode ) {
    			//Add officer information about task
    			if( task.user_id ) {
    				title += "(" + task.user_id[1] + ")"
    			}   				
    		}  
    		//officer mode
    		else
    		{    			
    			if( task.team_id ) {
    				//Add team information about task
    				title += "(" + task.team_id[1] + ")"
    			}    
    		}    		
    		
    		//Apply user's 'timezone on dates
    		var dtStart = task.date_start!=false ? moment( task.date_start ).tz(app.models.user.getContext().tz) : null
    		var dtEnd = task.date_end!=false ? moment( task.date_end ).tz(app.models.user.getContext().tz) : null		    		
    		

    		//prepare event for calendar
    		var event = { 
    			id: task.id, 
				state: task.state,
				title: title,
				inter_desc: task.inter_desc,
				inter_name: model.getIntervention(),
				inter_site: model.getSite(),
				start: dtStart.add('minutes',-dtStart.zone()).format(),
				end: dtEnd.add('minutes',-dtStart.zone()).format(),
				planned_hours: task.planned_hours,
				total_hours: task.total_hours,
				effective_hours: task.effective_hours,
				remaning_hours: task.remaining_hours,
				allDay: false,
				className: 'calendar-'+app.Models.Task.status[task.state].color,
				editable: true,
				disableDragging: actionDisabled,
				disableResizing: actionDisabled,
			};

    		//Add event in array
    		self.events.push(event);
    	});
    	
    	//order events list by date and return
		return eventsSortedArray = _.sortBy(self.events, function(event){ 
			return [event.start, event.end]; 
		});
    },
    
	/**
	 * Initialize Print calendar view
	 */
	initPrintView: function(){
		if ( _.isUndefined(app.views.printingCalendarView) ){
			app.views.printingCalendarView = new app.Views.PrintingCalendarView({
				calendar : this,
				events : this.events,
			})
		}
		else {
			app.views.printingCalendarView.close();
			app.views.printingCalendarView.calendar = this;
			app.views.printingCalendarView.events = this.events;
		}
		$('#printingCalendar').html(app.views.printingCalendarView.render().el);
	},

	/** When the model ara updated //
	*/
	refreshEvents: function(model){
		$(this.divCalendar).fullCalendar( 'refetchEvents' )
		app.notify('', 'success', app.lang.infoMessages.information, app.lang.infoMessages.taskUpdateOk);
	},



	/** Search officer and Teams //
	*/
	searchOfficerOrTeam: function(e){

		var search = $('#searchOfficerOrTeam').val().toLowerCase();


		// If the term is not empty //
		if(!_.isEmpty(search)){
		 
			_.each($('#listAgents li'), function(a){

				if(!_.str.include($(a).data('name'), search)){
					$(a).fadeOut('fast');
				}
				else{
					$(a).fadeIn('fast');
				}
			});

			_.each($('#listTeams li'), function(a){

				if(!_.str.include($(a).data('name'), search)){
					$(a).fadeOut('fast');
				}
				else{
					$(a).fadeIn('fast');	
				}
			});
		}
		else{
			$('#listAgents li').fadeIn();
			$('#listTeams li').fadeIn();
		}
	
	}

});

