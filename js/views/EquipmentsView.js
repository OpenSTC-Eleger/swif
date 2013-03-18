/******************************************
* Claimers List View
*/
app.Views.EquipmentsView = Backbone.View.extend({

	
	el : '#rowContainer',
	
	templateHTML: 'equipments',
	
	numberListByPage: 25,

	selectedEquipment : '',


    // The DOM events //
    events: {
		'click li.active'							: 'preventDefault',
		'click li.disabled'							: 'preventDefault',

		'click a.modalDeleteEquipment'  			: 'modalDeleteEquipment',
		'click a.modalSaveEquipment'  				: 'modalSaveEquipment',

		'submit #formSaveEquipment' 				: "saveEquipment", 
		'click button.btnDeleteEquipment' 			: 'deleteEquipment'
    },

	

	/** View Initialization
	*/
    initialize: function () {
		
    },


	/** Display the view
	*/
    render: function () {
		var self = this;

		// Change the page title //
        app.router.setPageTitle(app.lang.viewsTitles.equipmentsList);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var equipments = app.collections.equipments;

		var len = equipments.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				equipments: equipments.toJSON(),
				lang: app.lang,
				nbEquipments: len,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});
			
			$(self.el).html(template);
		});

		$(this.el).hide().fadeIn('slow');
		
        return this;
    },
    
	getIdInDropDown: function(view) {
    	if ( view && view.getSelected() )
    		var item = view.getSelected().toJSON();
    		if( item )
    			return [ item.id, item.name ];
    	else 
    		return 0
    },    

    setModel: function(e) {
    	e.preventDefault();
    	var link = $(e.target);
    	var id =  _(link.parents('tr').attr('id')).strRightBack('_');
        this.selected = _.filter(app.collections.equipments.models, function(item){ return item.attributes.id == id });
        if( this.selected.length>0 ) {
        	this.model = this.selected[0];
        	this.selectedJson = this.model.toJSON();  
        }
        else {
        	this.selectedJson = null;        	
        }        
    },


    /** Add a new categorie
    */
    modalSaveEquipment: function(e){       
        this.setModel(e);	
        
		app.views.selectListServicesView = new app.Views.DropdownSelectListView({el: $("#equipmentService"), collection: app.collections.claimersServices})
		app.views.selectListServicesView.clearAll();
		app.views.selectListServicesView.addEmptyFirst();
		app.views.selectListServicesView.addAll();		
		
        
        $('#equipmentName').val('');
		$('#equipmentImmat').val('');
        $('#equipmentMarque').val('');
        $('#equipmentUsage').val('');
        $('#equipmentType').val('');
        $('#equipmentCV').val( 0 );
        $('#equipmentYear').val( moment().year() );
        $('#equipmentTime').val( 0 );      
        $('#technicalVehicleEquipment').removeAttr("checked");	
        $('#commercialVehicleEquipment').removeAttr("checked");	          
        $('#smallMaterialEquipment').removeAttr("checked");	
        $('#fatMaterialEquipment').removeAttr("checked");	
        $('#equipmentKm').val( 0 );
        if( this.selectedJson ) {
        	if( this.selectedJson.service )
        		app.views.selectListServicesView.setSelectedItem( this.selectedJson.service[0] );
        	$('#equipmentName').val(this.selectedJson.name);
			$('#equipmentImmat').val(this.selectedJson.immat);
			$('#equipmentMarque').val(this.selectedJson.marque);
	        $('#equipmentUsage').val(this.selectedJson.usage);
	        $('#equipmentType').val(this.selectedJson.type);
	        $('#equipmentCV').val(this.selectedJson.cv);
	        $('#equipmentYear').val(this.selectedJson.year);
	        $('#equipmentTime').val(this.selectedJson.time);
	        this.selectedJson.technical_vehicle?$('#technicalVehicleEquipment').attr("checked","checked"):"";
	        this.selectedJson.commercial_vehicle?$('#commercialVehicleEquipment').attr("checked","checked"):"";
	        this.selectedJson.small_material?$('#smallMaterialEquipment').attr("checked","checked"):"";
	        this.selectedJson.fat_material?$('#fatMaterialEquipment').attr("checked","checked"):"";
	        $('#equipmentKm').val(this.selectedJson.km);
        }       

    },


    /** Display information in the Modal view
    */
    modalDeleteEquipment: function(e){
        
        // Retrieve the ID of the categorie //
    	this.setModel(e);

        $('#infoModalDeleteEquipment p').html(this.selectedJson.name);
        $('#infoModalDeleteEquipment small').html(this.selectedJson.marque);
    },
    
    

    /** Save Claimer Type
	*/
	saveEquipment: function(e) {		     
    	e.preventDefault();	 
    	
    	input_service_id = null;
    	selectView = app.views.selectListServicesView
		if ( selectView &&  selectView.getSelected() )
		   input_service_id = app.views.selectListServicesView.getSelected().toJSON().id;
	     
	     this.params = {	
	         name: this.$('#equipmentName').val(),
		     immat: this.$('#equipmentImmat').val(),
		     service: input_service_id,
		     marque: this.$('#equipmentMarque').val(),
		     usage:this.$('#equipmentUsage').val(),
	     	 type:this.$('#equipmentType').val(),
	     	 cv:this.$('#equipmentCV').val(),
	     	 year:this.$('#equipmentYear').val(),
	     	 time:this.$('#equipmentTime').val(),
	     	 technical_vehicle:this.$('#technicalVehicleEquipment').is(':checked'),
	     	 commercial_vehicle:this.$('#commercialVehicleEquipment').is(':checked'),
	     	 small_material:this.$('#smallMaterialEquipment').is(':checked'),
	     	 fat_material:this.$('#fatMaterialEquipment').is(':checked'),	         
	         km:this.$('#equipmentKm').val(),
	     };
	     
	    this.modelId = this.selectedJson==null?0: this.selectedJson.id;
	    var self = this;
	    
	    app.Models.Equipment.prototype.save(
	    	this.params, 
	    	this.modelId, {
				success: function(data){
					console.log(data);
					if(data.error){
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else{
						if( self.modelId==0 )
							self.model = new app.Models.Equipment({id: data.result.result}); 
						
						self.params.service = self.getIdInDropDown(app.views.selectListServicesView);
						self.model.update(self.params);
						app.collections.equipments.add(self.model);
						$('#modalSaveEquipment').modal('hide');
						app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.equipmentDeleteOk);
						self.render();
					}				
				},
				error: function(e){
					alert("Impossible de mettre à jour le site");
				}
	    });
	},

	
    /** Delete the selected claimer type
    */
    deleteEquipment: function(e){
    	e.preventDefault();
    	
       	var self = this;
		this.model.delete({
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.equipments.remove(self.model);
					$('#modalDeleteEquipment').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.equipmentSaveOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer l'équipment'");
			}

		});
    },


    preventDefault: function(event){
    	event.preventDefault();
    },

});