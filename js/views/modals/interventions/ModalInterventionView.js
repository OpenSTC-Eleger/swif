/******************************************
 * Intervention Details View
 */
app.Views.ModalInterventionView = app.Views.GenericModalView.extend({

	//el : '#rowContainer',
	
	templateHTML: 'modals/interventions/modalIntervention',

	
	// The DOM events //
	events: function() {
		return _.defaults({
		'submit #formIntervention'          : 'saveIntervention',
		'change #interventionDetailService' : 'fillDropdownService',
		'click a.linkSelectPlaceEquipment'	: 'changeSelectPlaceEquipment',

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
				var modelJSON = self.model.toJSON();
				var deadLineDt = modelJSON.date_deadline!=false ? moment( modelJSON.date_deadline ).tz(app.models.user.getContext().tz) : moment().tz(app.models.user.getContext().tz);
				deadLineDt.add('minutes',-deadLineDt.zone());
				
				var template = _.template(templateData, {
					lang: app.lang, intervention	: modelJSON,
					deadLineDt						: deadLineDt
				});
				
				self.modal.html(template);
				self.modal.modal('show');

				app.views.advancedSelectBoxInterventionServicesView = new app.Views.AdvancedSelectBoxView({el: $("#interventionDetailService"), collection: app.Collections.ClaimersServices.prototype}) 
				app.views.advancedSelectBoxInterventionServicesView.setSearchParam({field:'technical',operator:'=',value:'True'},true)
				app.views.advancedSelectBoxInterventionServicesView.render();

				currentIntervention = self.model.toJSON();
				
				//display equipment collection os place collection according to 'has_equipment'
				if(currentIntervention.has_equipment){
					self.advancedSelectBoxInterventionPlaceOrEquipment = new app.Views.AdvancedSelectBoxView({el:'#interventionPlaceEquipment', collection: app.Collections.Equipments.prototype});
				}
				else{
					self.advancedSelectBoxInterventionPlaceOrEquipment = new app.Views.AdvancedSelectBoxView({el:'#interventionPlaceEquipment', collection: app.Collections.Places.prototype});

				}
				self.advancedSelectBoxInterventionPlaceOrEquipment.render();

				
				// Fill select Places  //
				app.views.advancedSelectBoxInterventionPlacesView = new app.Views.AdvancedSelectBoxView({el: $("#interventionPlaceIfEquipment"), collection: app.Collections.Places.prototype});
				app.views.advancedSelectBoxInterventionPlacesView.render();	
				
				
				if(!self.create && currentIntervention.service_id.length > 0 ) {
					self.renderService(currentIntervention.service_id);
				}
				else{
					self.renderService(null);
				}
				if(!self.create){
					if(currentIntervention.has_equipment){
						self.setSelectPlaceEquipment('equipment');
						self.renderSiteOrEquipment(currentIntervention.equipment_id);
						if(currentIntervention.site1){
							self.renderSite(currentIntervention.site1);
						}					
					}
					else{
						self.setSelectPlaceEquipment('place');
						if(currentIntervention.site1.length > 0 ){
							self.renderSiteOrEquipment(currentIntervention.site1);
						}
						else{
							self.renderSite(null);
						}
					}
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
    	//private function used to check data: if no value, return false
	    function evalField(fieldValue){
	    	if(fieldValue == '' || _.isUndefined(fieldValue) || fieldValue == null){
	    		return false;
	    	}
	    	return fieldValue;
	    }
		e.preventDefault();

		var self = this;

//		var input_service_id = this.getIdInDopDown(app.views.selectListServicesView);
		var state = this.create ? app.Models.Intervention.status.open.key : this.model.toJSON().state;
		var params = {
			name: this.$('#interventionName').val(),
			state: this.$('#isTemplate').is(':checked')?"template":state,
			description: this.$('#interventionDescription').val(),
			date_deadline: new moment($('#interventionDateDeadline').val(), 'DD-MM-YYYY HH:mm').add('hours',2).toDate(),
			service_id: app.views.advancedSelectBoxInterventionServicesView.getSelectedItem(),
//			site1: app.views.advancedSelectBoxInterventionPlacesView.getSelectedItem(),
			site_details: this.$('#interventionPlacePrecision').val(),
		};
		
	    //adapt data mapping if intervention according that intervention belongs to a place or an equipment
	    if($('#btnSelectPlaceEquipment').data('item') == 'place'){
	    	params.site1 = evalField(this.advancedSelectBoxInterventionPlaceOrEquipment.getSelectedItem());
	    	params.has_equipment = false;
    	}
    	else{
    		params.site1 = evalField(app.views.advancedSelectBoxInterventionPlacesView.getSelectedItem()); 
    		params.equipment_id = evalField(this.advancedSelectBoxInterventionPlaceOrEquipment.getSelectedItem());
    		params.has_equipment = true;
    	}

		this.model.save(params,{patch:!this.create, wait: true, silent: true}).done(function(data){
			self.modal.modal('hide');
			if(self.create){
				self.model.setId(data);
				self.model.fetch({data: {fields: app.Collections.Interventions.fields}})
				.done(function(){
					if(! _.isUndefined(self.options.interventions) )
						self.options.interventions.add(self.model);
				});
				
			}
			else{
				self.model.fetch({data: {fields: app.Collections.Interventions.fields}});
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

	renderSiteOrEquipment: function(valueM2o){
		this.advancedSelectBoxInterventionPlaceOrEquipment.setSelectedItem(valueM2o);
	},

	renderService: function ( service ) {
		if(service != null){
			app.views.advancedSelectBoxInterventionServicesView.setSelectedItem(service);
			this.setParamOnSitesEquipments(service);
		}	
	},



	fillDropdownService: function(e){
		e.preventDefault();
		var service = app.views.advancedSelectBoxInterventionServicesView.getSelectedItem();
		this.setParamOnSitesEquipments(service);
	},
	
    /**
     * Used to update filter of 'places/equipments' select2, reset value and last filters
     */
    setParamOnSitesEquipments: function(service_id){
    	if(service_id == null){
    		service_id = app.views.advancedSelectBoxInterventionServicesView.getSelectedItem();
    	}
    	this.advancedSelectBoxInterventionPlaceOrEquipment.reset();
    	this.advancedSelectBoxInterventionPlaceOrEquipment.resetSearchParams();
    	if(service_id != '' && service_id){
    		this.advancedSelectBoxInterventionPlaceOrEquipment.setSearchParam({field:'service_ids.id', operator:'=', value:service_id});
    	}
    	//if it's an equipment, check too if boolean 'internal_user' is True
    	if($("#btnSelectPlaceEquipment").data('item') == 'equipment'){
    		this.advancedSelectBoxInterventionPlaceOrEquipment.setSearchParam({field:'internal_use', operator:'=', value:true});
    	}
    },
	
    displaySiteIfEquipment: function(display){
    	if(display){
    		app.views.advancedSelectBoxInterventionPlacesView.reset();
    		$('#interventionPlaceIfEquipmentBlock').css({display:'block'});
    	}
    	else{
    		$('#interventionPlaceIfEquipmentBlock').css({display:'none'});
    	}
    },
	
    //when clicking on site or equipment select filter, update selectBox collection if data-item change
    setSelectPlaceEquipment: function(item){
    	var itemSelectedBefore = $('#interventionPlaceEquipment').data('item');
    	//if user wants to change type of collection, we update selectBox, else, do nothing
    	if(item != itemSelectedBefore){
    		//if user wants to switch to equipment, we display place selectBox too, else, we hide it
    		this.displaySiteIfEquipment(item != 'place');
    		//get parameters of the select2 to keep trace of its state
    		var collection = null;
    		if(item == 'place'){
    			$('#interventionPlaceEquipment').attr('data-placeholder',app.lang.actions.selectAPlace);
    			collection = app.Collections.Places.prototype;
    			$('#btnSelectPlaceEquipment').data('item', 'place');
    			$('#btnSelectPlaceEquipment').find('.iconItem').removeClass('icon-wrench');
    			$('#btnSelectPlaceEquipment').find('.iconItem').addClass('icon-map-marker');
    		}
    		else{
    			$('#interventionPlaceEquipment').attr('data-placeholder',app.lang.actions.selectAnEquipment);
    			collection = app.Collections.Equipments.prototype;	    			
    			$('#btnSelectPlaceEquipment').data('item', 'equipment');
    			$('#btnSelectPlaceEquipment').find('.iconItem').removeClass('icon-map-marker');
    			$('#btnSelectPlaceEquipment').find('.iconItem').addClass('icon-wrench');
    		}
    		this.advancedSelectBoxInterventionPlaceOrEquipment.collection = collection;
			this.setParamOnSitesEquipments();
			this.advancedSelectBoxInterventionPlaceOrEquipment.render();
    	}
    },
	
    changeSelectPlaceEquipment: function(e){
    	if(e != null){
    		e.preventDefault();
    	}
    	var link = $(e.target);
    	var item = '';
    	if(link.is('a')){item = link.data('item')}
    	else{item = link.parent('a').data('item')}
    	this.setSelectPlaceEquipment(item);
    },
});

