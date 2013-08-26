/******************************************
 * Intervention Details View
 */
app.Views.ModalInterventionView = app.Views.GenericModalView.extend({

	//el : '#rowContainer',
	
	templateHTML: 'modals/modalIntervention',

	
	// The DOM events //
	events: function() {
		return _.defaults({
		'submit #formIntervention'          : 'saveIntervention',
		'change #interventionDetailService' : 'fillDropdownService',
		},
		app.Views.GenericModalView.prototype.events);
		
	},



	/** View Initialization
	 */
	initialize: function () {
	    var self = this;
	    console.log("Intervention Details view intialization")
//		this.model = model;
//	    this.create = create;
	    this.modal = $(this.el);
		if(_.isUndefined(this.model)){
			this.model = new app.Models.Intervention();
			this.create = true
		}
	    //this.initCollections().done(function(){
    	self.render();
	    //})
	    
    },



    /** Display the view
     */
    render: function () {
		
		// Change the page title depending on the create value //
		if(this.create){
			app.router.setPageTitle(app.lang.viewsTitles.newIntervention);
		}
		else{
			app.router.setPageTitle(app.lang.viewsTitles.interventionDetail + 'n° ' + this.model.id);
			console.debug(this.model);
		}


		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);
		
		
		//self.collection = this.collection;
		var self = this;
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
				
				var template = _.template(templateData, {lang: app.lang, intervention: self.model.toJSON()});
				
				self.modal.html(template);
				self.modal.modal('show');

				app.views.advancedSelectBoxInterventionServicesView = new app.Views.AdvancedSelectBoxView({el: $("#interventionDetailService"), collection: app.Collections.ClaimersServices.prototype}) 
				app.views.advancedSelectBoxInterventionServicesView.setSearchParam({field:'technical',operator:'=',value:'True'},true)
				app.views.advancedSelectBoxInterventionServicesView.render();

				
				// Fill select Places  //
				app.views.advancedSelectBoxInterventionPlacesView = new app.Views.AdvancedSelectBoxView({el: $("#interventionPlace"), collection: app.Collections.Places.prototype});
				app.views.advancedSelectBoxInterventionPlacesView.render();	
				
				currentIntervention = self.model.toJSON();
				
				if(!self.create && currentIntervention.service_id.length > 0 ) {
					self.renderService(currentIntervention.service_id);
				}
				else{
					self.renderService(null);
				}
				
				if(!self.create && currentIntervention.site1.length > 0 ){
					self.renderSite(currentIntervention.site1);
				}
				else{
					self.renderSite(null)
				}
			

				$('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });


				// If the intervention is Template - Checked the checkbox //
				if(currentIntervention.state == 'template')
					$('#isTemplate').prop('checked', true);
				else
					$('#isTemplate').prop('checked', false);


				// Form elements that can't be change are disable //
				if(self.create){
					$('#isTemplate').prop('disabled', false);
				}
				else{
					$('#isTemplate').prop('disabled', true);	
				}
		});
 
		return this;
    },



    getIdInDopDown: function(view) {
    	if ( view && view.getSelected() )
    		return view.getSelected().toJSON().id;
    	else 
    		return 0
    },



	/** Save the intervention
	*/
	saveIntervention: function (e) {

		e.preventDefault();

		var self = this;

//		var input_service_id = this.getIdInDopDown(app.views.selectListServicesView);

		var params = {
			name: this.$('#interventionName').val(),
			state: this.$('#isTemplate').is(':checked')?"template":"open",
			//active: this.$('#isTemplate').is(':checked')?false:true,
			description: this.$('#interventionDescription').val(),
			date_deadline: new moment($('#interventionDateDeadline').val(), 'DD-MM-YYYY HH:mm').add('hours',2).toDate(),
			service_id: app.views.advancedSelectBoxInterventionServicesView.getSelectedItem(),
			//site1: this.$('#interventionPlace').val(),
			site1: app.views.advancedSelectBoxInterventionPlacesView.getSelectedItem(),
			site_details: this.$('#interventionPlacePrecision').val(),
		};

		this.model.save(params,{patch:!this.create, wait: true}).done(function(data){
			self.modal.modal('hide');
			if(self.create){
				self.model.setId(data);
				self.model.fetch({silent: true, data: {fields: app.views.interventions.collections.interventions.fields}})
				.done(function(){
					app.views.interventions.collections.interventions.add(self.model);
				});
				
			}
			else{

			}

		})
		.fail(function(e){
			console.log(e);
		});
	},



	/** Delete the intervention
	 */
	deleteIntervention: function() { 
	 	this.model.destroy({
	 		success: function () {
	 			window.history.back();
	 		},
	 		error: function () {
	 			console.log('ERROR - Unable to delete the Intervention - InterventionView.js');
	 		},   
	 	});
		return false;
	},
		


	renderSite: function ( site ) {
		if( site!=null )
			//app.views.selectListPlacesView.setSelectedItem( site );
			app.views.advancedSelectBoxInterventionPlacesView.setSelectedItem(site);
	},



	renderService: function ( service ) {
		if(service != null){
			app.views.advancedSelectBoxInterventionServicesView.setSelectedItem(service);
			app.views.advancedSelectBoxInterventionPlacesView.setSearchParam({field:'service_ids.id',operator:'=',value:service[0]},true);
		}	
	},



	fillDropdownService: function(e){
		e.preventDefault();
		var service = app.views.advancedSelectBoxInterventionServicesView.getSelectedItem();
		app.views.advancedSelectBoxInterventionPlacesView.resetSearchParams();
		if(service != '' && service > 0){
			app.views.advancedSelectBoxInterventionPlacesView.setSearchParam({field:'service_ids.id',operator:'=',value:service},true);
		}
	},
});

