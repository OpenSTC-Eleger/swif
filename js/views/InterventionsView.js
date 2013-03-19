/******************************************
* Interventions View
*/
app.Views.InterventionsView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'interventions',

	filters: 'intersListFilter',

	selectedInter : '',
	selectedTask : '',


	// The DOM events //
	events: {
		'click .btn.addTask'                : 'displayModalAddTask',
		'submit #formAddTask'         		: 'saveTask',   

		'click a.modalDeleteTask'   		: 'displayModalDeleteTask',
		'click button.btnDeleteTask'   		: 'deleteTask',

		'click a.buttonCancelInter'			: 'displayModalCancelInter',
		'submit #formCancelInter' 			: 'cancelInter',
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
      
        this.addInfoAboutInter(interventions.models);


        // Hack fo reverse the position of the two first elements //
        var interventionsState = _.clone(app.Models.Intervention.state);
        var firstElements = _.first(interventionsState, 2);

		_(2).times(function(n){
			interventionsState.shift();
		})
		interventionsState =  _.union(firstElements.reverse(), interventionsState);



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
			
//			app.views.selectListEquipmentsView = new app.Views.DropdownSelectListView({el: $("#taskEquipment"), collection: app.collections.equipments})
//			app.views.selectListEquipmentsView.clearAll();
//			app.views.selectListEquipmentsView.addEmptyFirst();
//			app.views.selectListEquipmentsView.addAll();

			$('*[rel="tooltip"]').tooltip({placement: "right"});

			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' }); 
			
			$('.timepicker-default').timepicker({showMeridian:false, modalBackdrop:true});
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
        $('tr.row-object').css({ opacity: '0.5'});
        $('tr.row-object > td').css({ backgroundColor: '#FFF'});
        
        // If the table row isn't already expend //       
        if(!isExpend){
            // Set the new visibility to the selected intervention //
            $('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
            $(e.target).parents('tr.row-object').css({ opacity: '1'});  
            $(e.target).parents('tr.row-object').children('td').css({ backgroundColor: "#F5F5F5" }); 
            //$(e.target).parents('tr.row-object').children('td').css({ backgroundColor: "#f2dede" }); 
            
            //$(e.target).parents('tr.row-object').children('td').addClass( app.collections.interventions.get(id).toJSON().classColor ); //: '#F5F5F5'
        }
        else{
            $('tr.row-object').css({ opacity: '1'});
            $('tr.row-object > td').css({ backgroundColor: '#FFF'});
            $('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' }); 


            //$('tr.row-object:nth-child(4n+1) > td').addClass( app.collections.interventions.get(id).toJSON().classColor ); //'#F9F9F9'
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
        
        //Display only categories in dropdown belongs to intervention
        var categoriesFiltered = null;
        var inter = app.collections.interventions.get(this.pos);
        if( inter) {
        	var interJSON = inter.toJSON();
	        categoriesFiltered = _.filter(app.collections.categories.models, function(item){ 
	        	var services = [];
	        	_.each( item.attributes.service_ids.models, function(service){
	        		services.push( service.toJSON().id );
	        	});
	        	return  interJSON.service_id && $.inArray( interJSON.service_id[0], services )!=-1;
	       	});
		}        
		
		app.views.selectListAssignementsView = new app.Views.DropdownSelectListView({el: $("#taskCategory"), 
			collection: categoriesFiltered==null?app.collections.categories: new app.Collections.Categories(categoriesFiltered)
		})
		app.views.selectListAssignementsView.clearAll();
		app.views.selectListAssignementsView.addEmptyFirst();
		app.views.selectListAssignementsView.addAll();		
	        
        $('#modalAddTask').modal();
	},
   
	
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
	     //TODO : test
	     app.models.task.save(0,params,$('#modalAddTask'), null, "interventions");
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



	cancelInter: function(e){
		e.preventDefault();
	
		params = {
			state: app.Models.Intervention.state[4].value,
			cancel_reason: $('#motifCancel').val(),		
		};		
		this.saveNewState( params,$('#modalCancelInter') );
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



	/** Filter Request
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
			app.router.navigate('interventions', {trigger: true, replace: true});
		}
		
	},
  
});




