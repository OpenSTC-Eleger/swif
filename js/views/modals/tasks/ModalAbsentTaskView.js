/******************************************
* Absent Type Modal View
*/
app.Views.ModalAbsentTaskView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/tasks/modalAbsentTask',



	// The DOM events //
	events: function(){
		return _.defaults({
			'submit #formAbsentTask'  : 'saveAbsentTask'
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {

		this.modal = $(this.el);
		this.render();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang      : app.lang,
			});

			self.modal.html(template);	
			self.modal.modal('show');
	        
			var startDate = self.options.startDate;
			var endDate = self.options.endDate;
			
			var mStartDate = moment( startDate );
			var mEndDate = moment( endDate );
			
        	$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
        	$('.datepicker').datepicker({ format: 'dd/mm/yyyy', weekStart: 1, autoclose: true, language: 'fr'});

        	// Display only categories in dropdown belongs to intervention //
			self.advancedSelectBoxAbsentTypesView = new app.Views.AdvancedSelectBoxView({el: $("#absentType"), collection: app.Collections.AbsentTypes.prototype}); 
			self.advancedSelectBoxAbsentTypesView.render();

        	$("#startDate").val( moment( startDate ).format('L') );
        	$("#endDate").val( moment( endDate ).format('L') );
        	if( self.options.allDay ) {
        		var tempStartDate = moment( mStartDate );
        		tempStartDate.add('hours', (app.config.endWorkTime - app.config.startWorkTime))
	    		$("#startHour").timepicker( 'setTime', tempStartDate.format('LT') );
        		var tempEndDate = moment( mEndDate );
        		tempEndDate.add('hours',app.config.endWorkTime)
	    		$("#endHour").timepicker('setTime', tempEndDate.format('LT') );
        	}
        	else {
	    		$("#startHour").timepicker( 'setTime', mStartDate.format('LT') );
	    		$("#endHour").timepicker('setTime', mEndDate.format('LT') );
        	}
        	
        	// Set Modal informations 
        	var icon = self.teamMode?'group':'user' 
        	$('#infoModalAbsentTask p').html("<i class='icon-" + icon +"'></i> " + self.model.name );
    		$('#infoModalAbsentTask small').html("Du " + mStartDate.format('LLL') + " au " + mEndDate.format('LLL') );

			
		});

		return this;
	},



	/** Delete the model pass in the view
	*/
	saveAbsentTask: function(e){
		e.preventDefault();
		var self = this;
		
		// Set the button in loading State //
		$(this.el).find("button[type=submit]").button('loading');
		
		var mNewDateStart =  new moment( $("#startDate").val(),"DD-MM-YYYY")
								.add('hours',$("#startHour").val().split(":")[0] )
								.add('minutes',$("#startHour").val().split(":")[1] );
		var mNewDateEnd =  new moment( $("#endDate").val(),"DD-MM-YYYY")
								.add('hours',$("#endHour").val().split(":")[0] )
								.add('minutes',$("#endHour").val().split(":")[1] );
		var planned_hours = mNewDateEnd.diff(mNewDateStart, 'hours', true);
		
		params = {
			name: self.advancedSelectBoxAbsentTypesView.getSelectedText(),
		    absent_type_id: self.advancedSelectBoxAbsentTypesView.getSelectedItem(),
		    state: 'absent',
		    date_start: mNewDateStart.toDate(),
		    date_end: mNewDateEnd.toDate(),
		    planned_hours: planned_hours,
		    effective_hours: planned_hours,
		    hours: planned_hours,
		    remaining_hours: 0,
		    team_id: self.options.teamMode?self.model.id:0,
		    user_id: !self.options.teamMode?self.model.id:0,
		};
		
		this.model = new app.Models.Task();

		this.model.save(params, {patch: false, silent: true})
			.done(function(data) {
				self.modal.modal('hide');
				self.model.fetch({ data : {fields : self.model.fields} });
				self.options.collection.add(self.model);
			})
			.fail(function (e) {
				console.log(e);
			})
			.always(function () {
				$(self.el).find("button[type=submit]").button('reset');
			});
	},

});