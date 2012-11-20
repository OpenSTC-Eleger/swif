openstm.Views.EventsView = Backbone.View.extend({
        initialize: function(planning,collection,officer_id){
			this.planning = planning;
			this.el = $('div#officer_'+officer_id);
			this.collection = collection;
			this.officer_id = officer_id;
            _.bindAll(this); 

            this.collection.bind('reset', this.addAll);
            this.collection.bind('add', this.addOne);
            this.collection.bind('change', this.change);            
            this.collection.bind('destroy', this.destroy);
            
            this.eventView = new openstm.Views.EventView();            
        },

        
        render: function() {	
        	this.initEvents();
        	this.initCalendar();       
        },
        
		save: function(params) {
			model = new openstm.Models.Task();
			model.save(params,			
				{
				    success: function (data) {
				        console.log(data);
				        if(data.error){
				    		openstm.notify('', 'error', openstm.lang.errorMessages.unablePerformAction, openstm.lang.errorMessages.sufficientRights);
				        }
				        else{
				            console.log('Success SAVE REQUEST');
				        }
				    },
				    error: function () {
						console.log('ERROR - Unable to save the Request - RequestDetailsView.js');
				    },           
			},false);
		},
		
        addAll: function() {
            this.el.fullCalendar('addEventSource', this.collection.toJSON());
        },
        addOne: function(event) {
            this.el.fullCalendar('renderEvent', event.toJSON());
        },        
        select: function(startDate, endDate) {
            this.eventView.collection = this.collection;
            this.eventView.model = new Event({start: startDate, end: endDate});
            this.eventView.render();            
        },
        eventClick: function(fcEvent) {
            this.eventView.model = this.collection.get(fcEvent.id);
            this.eventView.render()
        },
        change: function(event) {
            // Look up the underlying event in the calendar and update its details from the model
            var fcEvent = this.el.fullCalendar('clientEvents', event.get('id'))[0];
            fcEvent.planned_hours = event.get('planned_hours');
            fcEvent.remaining_hours = event.get('remaining_hours');
            //this.el.fullCalendar('updateEvent', fcEvent);           
        },
        eventDropOrResize: function(fcEvent) {
            // Lookup the model that has the ID of the event and update its attributes
            this.collection.get(fcEvent.id).save({start: fcEvent.start, end: fcEvent.end});            
        },        
                
        initEvents: function() {
        	this.events = [];
        	var self = this;
        	
        	_.each(this.collection.toJSON(), function (task, i){
        		var event = { id: task.id, 
        		              title: task.name, 
        		              start: task.date_start, 
        		              end: task.date_end, 
        		              planned_hours: task.planned_hours,
        		              remaning_hours: task.remaning_hours,
        		              allDay:false
        		             };
        		self.events.push(event);
        	});
        },
        
        initCalendar: function() {
        	var self = this;
        	self.el.fullCalendar({
				events: self.events,
				
				defaultView: self.planning.calendarView,
				aspectRatio: 1.30,
				header: {
				    left: 'infosUser',
				    center: 'title',
				    right: 'today,prev,next'
				},
				titleFormat:{
				    //week: "d { [ MMM] '-' d} MMM yyyy",
				    week: "'Semaine ' W '<small class=hidden-phone> du' d { [ MMM] 'au' d} MMM yyyy '</small>'",
				},
				allDayText: 'Journée entière',
				axisFormat: 'H:mm',
				timeFormat: 'H:mm',
				slotMinutes: 120,
				firstHour: 8,
				minTime: 8,
				maxTime: 18,
				defaultEventMinutes: 120,
				dragOpacity: 0.5,
				weekends: true,
				editable: true,
				droppable: true,
				disableResizing: true,				
                selectable: true,
                selectHelper: true,
                editable: true,
                ignoreTimezone: false,                
                select: this.select,
                dragRevertDuration:0,
//                eventClick: this.eventClick,
//                eventDrop: this.eventDropOrResize,        
//                eventResize: this.eventDropOrResize,
				
				eventColor: '#378006',
				
//				viewDisplay: function() {
//					// qTip call
//					$('.fc-event', this).qtip();
//				},
				
				eventRender: function(event, element) {
					console.debug(element);		
//					element.qtip({ content: event.description,
//								   position: {
//										corner:{target: 'topRight',tooltip: 'bottomLeft'}
//											},	
//								   show: 'mouseover',
//								   hide: 'mouseout',
//						});
				},
				
				eventClick: function(event, jsEvent, view) {

					console.debug("++++++++++++++++++++++++++EventClick"+event.title);       

					$(this).qtip({    
						content: {    
                        	title: { text: event.title },
                        	text: 
                        			"<span class='title'>Terminée: </span>" + 
                        			event.state +                         			
                        			"<br><span class='title'>Temps travaillé: </span>" + 
                        			event.total_hours + 
                        			"<br><span class='title'>Temps restant: </span>" + 
                        			event.remaining_hours + 
                        			"<br /><input type='button' value='Update' class='button' />"   
                    	},
                        position: {
                            at: 'top center',
                            // Position the tooltip above the link
                            my: 'bottom center',
                            adjust: {
                                y: -2,
                                resize: false // We'll handle it manually
                            },
                            viewport: self.el,
                            container: self.el
                        },
                        show: {
                            solo: true
                        },                         
                        style: { 
                            width: 200,
                            padding: 5,
                            color: 'black',
                            textAlign: 'left',
                            border: {
                                width: 1,
                                radius: 3
                            },
                            tip: 'bottom-middle',
                            classes: 'daytooltip ui-tooltip-dark ui-tooltip-shadow',
                            tip: {
                                width: 20, height: 8
                            }                        
                        } 
                    });
				
				},
				
//								dayClick: function(date, allDay, jsEvent, view) { 
//                   var month=new Array();
//                    month[0]="January";
//                    month[1]="February";
//                    month[2]="March";
//                    month[3]="April";
//                    month[4]="May";
//                    month[5]="June";
//                    month[6]="July";
//                    month[7]="August";
//                    month[8]="September";
//                    month[9]="October";
//                    month[10]="November";
//                    month[11]="December"; 
//
//                   var monthNum=new Array();
//                    monthNum[0]="01";
//                    monthNum[1]="02";
//                    monthNum[2]="03";
//                    monthNum[3]="04";
//                    monthNum[4]="05";
//                    monthNum[5]="06";
//                    monthNum[6]="07";
//                    monthNum[7]="08";
//                    monthNum[8]="09";
//                    monthNum[9]="10";
//                    monthNum[10]="11";
//                    monthNum[11]="12";  
//
//                    var allday = "<label for='allday'><input type='checkbox' id='allday' onClick='enabledisable(this.checked)' /><span>All Day Event</span></label>"
//                    var thisDay = month[date.getMonth()] + '/' + date.getDate() + '/' + date.getFullYear();
//                    var thisDayDBFormat = date.getFullYear() + '-' + monthNum[date.getMonth()] + '-' + date.getDate();
//
//                    var sHours = "<select id='startTimeHour' name='startTimeHour' class='dropdown-menu-time-qtip' >" +                                                               
//                                    "<option value='01'>01</option>" +
//                                    "<option value='02'>02</option>" +
//                                    "<option value='03'>03</option>" +                        
//                                    "<option value='04'>04</option>" +
//                                    "<option value='05'>05</option>" +
//                                    "<option value='06' selected>06</option>" +
//                                    "<option value='07'>07</option>" +                        
//                                    "<option value='08'>08</option>" +
//                                    "<option value='09'>09</option>" +
//                                    "<option value='10'>10</option>" +
//                                    "<option value='11'>11</option>" +                        
//                                    "<option value='12'>12</option>" +                                       
//                                    "</select>";
//                    var sMins = "<select id='startTimeMin' name='startTimeMin' class='dropdown-menu-time-qtip' >" +
//                                    "<option value='00' selected>00</option>" +
//                                    "<option value='15'>15</option>" +
//                                    "<option value='30'>30</option>" +
//                                    "<option value='45'>45</option>" + 
//                                    "</select>";                              
//                    var sAM_PM = "<select id='startTimeAMPM' name='startTimeAMPM' class='dropdown-menu-time-qtip' >" +
//                                    "<option value='AM'>AM</option>" +
//                                    "<option value='PM' selected>PM</option>" +                                        
//                                    "</select>";                                                    
//
//                    var eHours = "<select id='endTimeHour' name='endTimeHour' class='dropdown-menu-time-qtip' >" +                                        
//                                    "<option value='01'>01</option>" +
//                                    "<option value='02'>02</option>" +
//                                    "<option value='03'>03</option>" +
//                                    "<option value='04'>04</option>" +
//                                    "<option value='05'>05</option>" +
//                                    "<option value='06'>06</option>" +
//                                    "<option value='07' selected>07</option>" +
//                                    "<option value='08'>08</option>" +
//                                    "<option value='09'>09</option>" +
//                                    "<option value='10'>10</option>" +
//                                    "<option value='11'>11</option>" +   
//                                    "<option value='12'>12</option>" +                                        
//                                    "</select>";
//                     var eMins = "<select id='endTimeMin' name='endTimeMin' class='dropdown-menu-time-qtip' >" +
//                                    "<option value='00' selected>00</option>" +
//                                    "<option value='15'>15</option>" +
//                                    "<option value='30'>30</option>" +
//                                    "<option value='45'>45</option>" + 
//                                    "</select>";                              
//                    var eAM_PM = "<select id='endTimeAMPM' name='endTimeAMPM' class='dropdown-menu-time-qtip' >" +
//                                    "<option value='AM'>AM</option>" +
//                                    "<option value='PM' selected>PM</option>" +                                        
//                                    "</select>";                          
//
//                    $(this).qtip({
//                    overwrite: true,
//                    content: {                            
//                        title: {
//                            text: 'Create Event / Add Menu Item: ', // + month[date.getMonth()] + '/' + date.getDate() + '/' + date.getFullYear(),
//                            button: true
//                        },
//                        //text: $('#fxx').html() // this html was on the form
//
//                        //text: "<span id='event-create' ><ul><li><input type='checkbox' />All Day</li><li><input type='radio' />input:radio</li><li><select><option>Select</option><option>Foo</option><option>Bar</option></select></li><li></li><li><input type='text' value=" + month[date.getMonth()] + '/' + date.getDate() + '/' + date.getFullYear() + "/></li><li><textarea>textarea</textarea></li></ul><input type='button' class='button' value='Create Event' /></span>"
//                        text: "<div id='event-create'>" +                                
//                                "<fieldset>" +
//                                    "Create a Generic Event OR add a Menu (meal) Event from your Personal Menu!" +
//                                    "<br />" +
//                                    "<label>When:</label><span>" + thisDay + "</span>" +
//                                    "<br />" +                                        
//                                    "<form action='.' method='post' name='create_event'>" +
//                                        "<input type='hidden' name='action' value='save_event' />" +
//                                        "<input type='hidden' name='eventDate' value='" + thisDayDBFormat + "' />" +
//                                        "<label for='eventName'>Name:</label><input type='text' name='eventName' value='' title='Letters, numbers, and underscore!' size='30' />" +
//                                        "<br />" +
//                                        "<label for='eventLocation'>Location:</label><input type='text' name='eventLocation' value='' title='Letters, numbers, and underscore!' size='30' />" +                                                                                                                                   
//                                        "<div id='event-create-time'>" +
//                                            "<input type='checkbox' name='eventAllDay' onClick='enabledisable(this.checked)' /><span>&nbsp;&nbsp;All Day Event</span><br />" +
//                                            "Start: " + sHours + " " + sMins + " " + sAM_PM + "<br />" +
//                                            "End:&nbsp;&nbsp;" + eHours + " " + eMins + " " + eAM_PM + 
//                                        "</div>" +
//                                        "<br />" +
//                                        "<input type='submit' id='event-button' name='btnSaveGenericEvent' class='button150' value='Create Generic Event' />" +                                                                                    
//                                        "<input type='submit' id='event-button' name='btnSaveMenuEvent' class='button150' value='Create Menu Event' />" +                                         
//                                    "</form>" + 
//                                "</fieldset>" +
//                            "</div>"
//                            //"<a href='#' onclick=" + '"' + "document['my_personal_menu'].submit()" + '"' + " >My Personal Menu >></a>" +
//                    },
//                    position: {
//                        at: 'top center',
//                        // Position the tooltip above the link
//                        my: 'bottom center',
//                        adjust: {
//                            y: -2,
//                            resize: false // We'll handle it manually
//                        },
//                        viewport: self.el,
//                        container: self.el, 
//                    },
//
//                    // NOTE: originally, tooltip opened as modal (gray background) and had to close with 'x' button
//                    // Settings were "show: Modal: on: true AND hide: 'false'
//                    //
//                    // To have tooltip popup on each day click AND have any previous tooltip go away (like google calendar)
//                    // Settings "show: modal: on: false AND hide: 'true'"
//                    show: {
//                        ready: true,
//                        event: false,
//                        modal: {
//                            // 'true' = Make it modal (darken the rest of the page)...
//                            on: false,                                
//                            blur: false // ... but don't close the tooltip when clicked
//                        }
//                    },
//                    // 'false' = does not hide when clicking outside
//                    // 'unfocus' = will hide when clicking outside tooltip IF modal 'on: false' (above)
//                    hide: 'unfocus',
//                    style: {
//                        classes: 'daytooltip ui-tooltip-dark ui-tooltip-shadow ui-tooltip-default width400',
//                        tip: { width: 20, height: 8 }                                                 
//                    }
//                })
//                .qtip('show');
//                    
//                },
		
			
				drop: function( date, allDay) { // this function is called when something is dropped
				
				    // retrieve the dropped element's stored Event Object
				    var originalEventObject = $(this).data('eventObject');
				
				    // we need to copy it, so that multiple events don't have a reference to the same object
				    var copiedEventObject = $.extend({}, originalEventObject);
				
				    // assign it the date that was reported
				    copiedEventObject.start = date;
				    copiedEventObject.allDay = allDay;
				
				    // render the event on the calendar
				    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
				    $(self.el).fullCalendar('renderEvent', copiedEventObject, true);
				    //$(self.el).append('<button type="button" class="close" data-dismiss="close">X</button>');
				    params = { 
				               id: copiedEventObject.id,
				    		   date_end: date,
				               date_start: date,
				               planned_hours: copiedEventObject.planned_hours,
				               user_id: self.officer_id
				    };
				    self.save(params);
				
				    $.pnotify({
				        title: 'Tâche attribuée',
				        text: 'La tâche a correctement été attribué à l\'agent.'
					    });
				
				
				    $(this).remove();     
				},
				
				
				eventDragStop: function(event, jsEvent, ui, view) {
				    //if (self.isElemOverDiv($(this), $('div.accordion-group'))) {
					openstm.loader('display');
					
				    params = { 
				       id: event.id,
				       user_id: null
				    };
				    model = openstm.collections.tasks.get(event.id)
					model.save(params);	
				    	
				    self.planning.render();	
				    $(self.el).fullCalendar('removeEvents', event.id);
				    openstm.loader('hide');
				    //}
				}

			});
    	}
    });
