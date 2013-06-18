/******************************************
 * Intervention Details View
 */
app.Views.InterventionView = Backbone.View.extend({

	el : '#rowContainer',
	
	templateHTML: 'interventionDetails',

	
	// The DOM events //
	events: {
		'submit #formIntervention'			: 'saveIntervention',
		'change #interventionDetailService'		: 'fillDropdownService',
	},



	/** View Initialization
	 */
	initialize: function (model, create) {
	    this.model = model;
	    this.create = create;
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
				$(self.el).html(template);		     


				//search no technical services
				var noTechnicalServices = _.filter(app.collections.claimersServices.models, function(service){
					return service.attributes.technical != true 
				});
				//remove no technical services
				app.collections.claimersServices.remove(noTechnicalServices);

				app.views.selectListServicesView = new app.Views.DropdownSelectListView({el: $("#interventionDetailService"), collection: app.collections.claimersServices})
				app.views.selectListServicesView.clearAll();
				app.views.selectListServicesView.addEmptyFirst();
				app.views.selectListServicesView.addAll();


				// Fill select Places  //
				app.views.selectListPlacesView = new app.Views.DropdownSelectListView({el: $("#interventionPlace"), collection: app.collections.places})
				app.views.selectListPlacesView.clearAll();
				app.views.selectListPlacesView.addEmptyFirst();
				app.views.selectListPlacesView.addAll();	
				currentIntervention = self.model.toJSON()
				if( currentIntervention.service_id ) {
					self.renderService(currentIntervention.service_id[0]);
				}
				else
					self.renderService(null);
				if( currentIntervention.site1 )
					self.renderSite(currentIntervention.site1[0]);
				else
					self.renderSite(null);


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

		$(this.el).hide().fadeIn('slow'); 
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

		var input_service_id = this.getIdInDopDown(app.views.selectListServicesView);

		var params = {
			name: this.$('#interventionName').val(),
			state: this.$('#isTemplate').is(':checked')?"template":"open",
			//active: this.$('#isTemplate').is(':checked')?false:true,
			description: this.$('#interventionDescription').val(),
			date_deadline: new moment($('#interventionDateDeadline').val(), 'DD-MM-YYYY HH:mm').add('hours',2).toDate(),
			service_id: input_service_id,
			site1: this.$('#interventionPlace').val(),
			site_details: this.$('#interventionPlacePrecision').val(),
		};

		this.model.save(params,{
			success: function (data) {
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.router.navigate('#interventions', {trigger: true, replace: true});
					console.log('Success SAVE INTERVENTION');
				}
			},
			error: function () {
				console.log('ERROR - Unable to save the Intervention - InterventionView.js');
			},
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
			app.views.selectListPlacesView.setSelectedItem( site );			
	},



	renderService: function ( service ) {
		if( service!= null ) {
			app.views.selectListServicesView.setSelectedItem( service );
			places = app.collections.places.models;
			
			//keep only places belongs to service selected
			keepedPlaces = _.filter(places, function(item){ 
				var placeJSON = item.toJSON();
				var placeServices = placeJSON.service_ids;	
				var placeServices = [];
				_.each( item.attributes.service_ids.models, function(s){
					placeServices.push( s.toJSON().id );
				});				
				return $.inArray(service, placeServices)!=-1
			});
			app.views.selectListPlacesView.collection = new app.Collections.Places(keepedPlaces);
			app.views.selectListPlacesView.clearAll();
			app.views.selectListPlacesView.addEmptyFirst();
			app.views.selectListPlacesView.addAll();
		}	
	},



	fillDropdownService: function(e){
		e.preventDefault();
		$('#interventionPlace').val('');
		this.renderService( _($(e.target).prop('value')).toNumber() );
	},


});

