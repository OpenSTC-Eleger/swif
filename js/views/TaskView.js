/******************************************
* Task View
*/
app.Views.TaskView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'taskDetails',
	
	numberListByPage: 25,


	// The DOM events //
	events: {
		'submit #formTask'			: 'saveTask',
	},



	/** View Initialization
	*/
	initialize: function (model, create) {
		this.model = model;
		this.modelJSON = model.toJSON();
		this.create = create;
		
		//this.model.bind('update:intervention', this.updateInter, this);
	},



	/** Display the view
	*/
	render: function () {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.tasksDetail);


		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');
		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang: app.lang,
				task: self.model.toJSON(),
			});
			$(self.el).html(template);
			
			self.getDropDownElements();	
			self.displayEquipmentsInfos();

			$(".datepicker").datepicker({
				format: 'dd/mm/yyyy',
				weekStart: 1,
				autoclose: true,
				language: 'fr'
			});

			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
			
			
			if( self.modelJSON.state != app.Models.Task.status.open.key) {
				$('.inputField').prop('disabled', true);
				$('.save').prop('disabled', true);
			}else {
				$('.inputField').removeProp("disabled");
				$('.save').removeProp("disabled");
			}
				

		});

		$(this.el).hide().fadeIn('slow');
		
		return this;
	},
	
	/** Display  Equipments
		*/
	displayEquipmentsInfos: function(){
			
		$('#equipments').empty();

		var nbRemainMaterials = 0;
		var self = this;
		this.selectedTask = _.filter(app.collections.tasks.models, function(item){ return item.attributes.id == self.modelJSON.id });
		var selectedTaskJson = this.selectedTask[0].toJSON();	
		
		// Clear the list //		
		$('#equipments').empty();

		// Display the services of the team //
		_.each(selectedTaskJson.equipment_ids, function (equipment, i){
			$('#equipments').append('<li id="equipment_'+equipment.id+'"><a href="#"><i class="icon-sitemap"></i> '+ equipment.name + '-' + equipment.type + ' </a></li>');
			nbRemainMaterials++;
		});
		
		$('#badgeNbEquipments').html(nbRemainMaterials);
		
	},
	
	getDropDownElements: function() {
		
		var categoriesFiltered = null;	
		var officersFiltered = null;
		var modelJSON = this.model.toJSON();
		
		if( modelJSON.intervention ) {	    	
			//Display only categories in dropdown those who have a common service with intervention  
			var interJSON = modelJSON.intervention;
			categoriesFiltered = _.filter(app.collections.categoriesTasks.models, function(item){ 
				var services = [];
				_.each( item.attributes.service_ids.models, function(service){
					services.push( service.toJSON().id );
				});
				return  interJSON.service_id && $.inArray(interJSON.service_id[0], services )!=-1;
			});
			
		   //Display only officers in dropdown those who have a common service with intervention  
		   officersFiltered = _.filter(app.collections.officers.models, function(item){ 
				var services = [];
				_.each( item.attributes.service_ids.models, function(service){
					services.push( service.toJSON().id );
				});
				return  interJSON.service_id && $.inArray(interJSON.service_id[0], services )!=-1;
			});    
		}
		
		app.views.selectListAssignementsView = new app.Views.DropdownSelectListView({el: $("#taskCategory"), 
			collection: categoriesFiltered==null?app.collections.categoriesTasks: new app.Collections.CategoriesTasks(categoriesFiltered)
		})
		app.views.selectListAssignementsView.clearAll();
		app.views.selectListAssignementsView.addEmptyFirst();
		app.views.selectListAssignementsView.addAll();
		
		if( modelJSON.category_id) {
			app.views.selectListAssignementsView.setSelectedItem( modelJSON.category_id[0] );
		}
		
		app.views.selectListOfficersView = new app.Views.DropdownSelectListView({el: $("#taskOfficer"), 
			collection: officersFiltered==null?app.collections.officers: new app.Collections.Officers(officersFiltered)
		})
		app.views.selectListOfficersView.clearAll();
		app.views.selectListOfficersView.addEmptyFirst();
		app.views.selectListOfficersView.addAll();
		
		if( modelJSON.user_id) {
			app.views.selectListOfficersView.setSelectedItem( modelJSON.user_id[0] );
		}

	},
	
	/** Save the request
	 */
	saveTask: function (e) {
		 
		e.preventDefault();
		var self = this;
		
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
		 
		 input_officer_id = null;
		 if( app.views.selectListOfficersView != null ) {
			 var selectItem = app.views.selectListOfficersView.getSelected();
			 if( selectItem ) {
				 input_officer_id = selectItem.toJSON().id
			 }
		 }
		 
		 
		 var params = {	
			 user_id: input_officer_id,        
			 date_start: mNewDateStart.toDate(),
			 date_end: mNewDateEnd.toDate(),
			 state: app.Models.Task.status.open.key,
			 name: this.$('#taskName').val(),
			 description: this.$('#taskDescription').val(),
			 category_id: input_category_id,	         
			 planned_hours: planned_hours,
			 effective_hours: 0,
			 remaining_hours: planned_hours,
		 };
		 this.model.save(this.model.id,params,{
			 success: function( data ) {
				console.log(data);	     	
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.router.navigate(app.routes.tasks.baseUrl, true);
				}				
			},
			error: function(e){
				alert("Impossible de mettre à jour la tâche'");
			}
		 });
		
	},


	preventDefault: function(event){
		event.preventDefault();
	},
	
	//    
//    updateInter: function (task) {
//    	intervention = task.toJSON().intervention;
//    	console.debug("BINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDING");
//    	
//    	app.models.intervention.saveAndRoute(intervention.id, {state: 'toscheduled'}, null, null, "#taches");
//    	
//    	
//    },

});