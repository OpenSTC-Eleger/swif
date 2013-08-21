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
	    this.initCollections().done(function(){
	    	self.render();
	    })
	    
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

				app.views.selectListServicesView = new app.Views.DropdownSelectListView({el: $("#interventionDetailService"), collection: self.collections.technicalServices})
				app.views.selectListServicesView.clearAll();
				app.views.selectListServicesView.addEmptyFirst();
				app.views.selectListServicesView.addAll();


				// Fill select Places  //
				app.views.selectListPlacesView = new app.Views.DropdownSelectListView({el: $("#interventionPlace"), collection: self.collections.places})
				app.views.selectListPlacesView.clearAll();
				app.views.selectListPlacesView.addEmptyFirst();
				app.views.selectListPlacesView.addAll();	
				currentIntervention = self.model.toJSON()
				if( currentIntervention.service_id.length > 0 ) {
					self.renderService(currentIntervention.service_id[0]);
				}
				else
					self.renderService(null);
				if( currentIntervention.site1.length > 0 )
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
					app.router.navigate(app.routes.interventions.baseUrl, {trigger: true, replace: true});
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
			places = this.collections.places.models;
			
			//keep only places belongs to service selected
			keepedPlaces = _.filter(places, function(item){ 
//				var placeServices = [];
//				_.each( item.attributes.service_ids.models, function(s){
//					placeServices.push( s.toJSON().id );
//				});				
				return $.inArray(service, item.getServices('id'))!=-1;
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
	initCollections: function(){
		var self = this; 
		
		if(_.isUndefined(this.collections)){this.collections = {}}
		if(_.isUndefined(this.collections.technicalServices)){this.collections.technicalServices = new app.Collections.ClaimersServices()}
		if(_.isUndefined(this.collections.places)){this.collections.places = new app.Collections.Places()}
		
		this.create = false;
		if(_.isUndefined(this.model)){
			this.model = new app.Models.Intervention();
			this.create = true
		}
		var deferred = $.Deferred();
		var domain = [{field: 'technical',operator: '=', value: 'True'}]
		
		this.collections.technicalServices.fetch({data: {filters: app.objectifyFilters(domain)}, silent:true}).done(function(){
			var domainPlaces = [{field: 'service_ids', operator: 'in', value: self.collections.technicalServices.pluck('id')}]
			$.when(self.collections.places.fetch({data: {filters: app.objectifyFilters(domainPlaces)}}))
			.done(function(){
				deferred.resolve();
			})
			.fail(function(e){
				console.log(e)
			})
		})
		.fail(function(e){
			console.log(e)
		})
		return deferred;
		//search no technical services
		//get places according to technicalServices of the user
		
	}

});

