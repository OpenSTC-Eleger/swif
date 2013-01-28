/******************************************
* Claimers List View
*/
app.Views.ClaimersView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'claimers',

	numberListByPage: 25,

	selectedClaimer : '',


    // The DOM events //
    events: {
    	'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',
		
		
		'click a.modalDeleteClaimer'  		: 'modalDeleteClaimer',
		'click a.modalSaveClaimer'  		: 'modalSaveClaimer',

		'submit #formSaveClaimer' 			: "saveClaimer", 
		'click button.btnDeleteClaimer'		: 'deleteClaimer',
			
		'click a.accordion-object'    : 'tableAccordion'
			
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
        app.router.setPageTitle(app.lang.viewsTitles.claimersList);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var claimers = app.collections.claimers.models;
		var nbClaimers = _.size(claimers);

		console.debug(claimers);


		var len = claimers.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				claimers: app.collections.claimers.toJSON(),
				lang: app.lang,
				nbClaimers: nbClaimers,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});

			$(self.el).html(template);
		});

		$(this.el).hide().fadeIn('slow');

		return this;
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
            $(e.target).parents('tr.row-object').children('td').css({ backgroundColor: '#F5F5F5'});
        }
        else{
            $('tr.row-object').css({ opacity: '1'});
            $('tr.row-object > td').css({ backgroundColor: '#FFF'});
            $('tr.row-object:nth-child(4n+1) > td').css({ backgroundColor: '#F9F9F9'});
        }
           
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
	    this.selectedClaimer = _.filter(app.collections.claimers.models, function(item){ return item.attributes.id == id });
	    if( this.selectedClaimer.length>0 ) {
	    	this.model = this.selectedClaimer[0];
	    	this.selectedClaimerJson = this.model.toJSON();        
	    }
	    else {
	    	this.selectedClaimerJson = null;
	    }        
	},
	
	
	/** Add a new categorie
	*/
	modalSaveClaimer: function(e){       
	    this.setModel(e);	
	    
		app.views.selectListClaimerTypeView = new app.Views.DropdownSelectListView({el: $("#claimerType"), collection: app.collections.claimersTypes})
		app.views.selectListClaimerTypeView.clearAll();
		app.views.selectListClaimerTypeView.addEmptyFirst();
		app.views.selectListClaimerTypeView.addAll();
		
		app.views.selectListClaimerServiceView = new app.Views.DropdownSelectListView({el: $("#claimerService"), collection: app.collections.claimersServices})
		app.views.selectListClaimerServiceView.clearAll();
		app.views.selectListClaimerServiceView.addEmptyFirst();
		app.views.selectListClaimerServiceView.addAll();
		
		app.views.selectListClaimerTechnicalServiceView = new app.Views.DropdownSelectListView({el: $("#claimerTechnicalService"), collection: app.collections.claimersServices})
		app.views.selectListClaimerTechnicalServiceView.clearAll();
		app.views.selectListClaimerTechnicalServiceView.addEmptyFirst();
		app.views.selectListClaimerTechnicalServiceView.addAll();
		
		app.views.selectListClaimerTechnicalSiteView = new app.Views.DropdownSelectListView({el: $("#claimerTechnicalSite"), collection: app.collections.places})
		app.views.selectListClaimerTechnicalSiteView.clearAll();
		app.views.selectListClaimerTechnicalSiteView.addEmptyFirst();
		app.views.selectListClaimerTechnicalSiteView.addAll();
		
	    
	    $('#claimerName').val('');
	    if( this.selectedClaimerJson ) {
			$('#claimerName').val(this.selectedClaimerJson.name);
			if( this.selectedClaimerJson.type_id )
				app.views.selectListClaimerTypeView.setSelectedItem( this.selectedClaimerJson.type_id[0] );	
			if( this.selectedClaimerJson.service_id )
				app.views.selectListClaimerServiceView.setSelectedItem( this.selectedClaimerJson.service_id[0] );	
			if( this.selectedClaimerJson.technical_service_id )
				app.views.selectListClaimerTechnicalServiceView.setSelectedItem( this.selectedClaimerJson.technical_service_id[0] );	
			if( this.selectedClaimerJson.technical_site_id )
				app.views.selectListClaimerTechnicalSiteView.setSelectedItem( this.selectedClaimerJson.technical_site_id[0] );	
			
	    }       
	
	},
	
	
	/** Display information in the Modal view
	*/
	modalDeleteClaimer: function(e){
	    
	    // Retrieve the ID of the Claimer //
		this.setModel(e);
	
	    $('#infoModalDeleteClaimer p').html(this.selectedClaimerJson.name);
	    $('#infoModalDeleteClaimer small').html(this.selectedClaimerJson.code);
	},
	
	
	
	/** Save  place
	*/
	saveClaimer: function(e) {		     
		e.preventDefault();
	
	     
	     
	     var type_id = this.getIdInDropDown(app.views.selectListClaimerTypeView);
	     var service_id = this.getIdInDropDown(app.views.selectListClaimerServiceView);
	     var technical_service_id = this.getIdInDropDown(app.views.selectListClaimerTechnicalServiceView);
	     var technical_site_id = this.getIdInDropDown(app.views.selectListClaimerTechnicalSiteView);
	     
	     this.params = {	
		     name: this.$('#claimerName').val(),
		     type_id: type_id,
		     service_id: service_id,		     
		     technical_service_id: technical_service_id,
		     technical_site_id: technical_site_id,
	     };
	     
	       
	    this.params.type_id =  type_id[0];
	    this.params.service_id =  service_id[0];
	    this.params.technical_service_id =  technical_service_id[0];
	    this.params.technical_site_id =  technical_site_id[0];
	    this.modelId = this.selectedClaimerJson==null?0: this.selectedClaimerJson.id;
	    var self = this;
	    app.Models.Claimer.prototype.save(
	    	this.params, 
	    	this.modelId,
	    	{
				success: function(data){
					console.log(data);
					if(data.error){
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else{
						if( self.modelId==0 )
							self.model = new app.Models.Claimer({id: data.result.result}); 
						self.params.type_id =  self.getIdInDropDown(app.views.selectListClaimerTypeView);
					    self.params.service_id =  self.getIdInDropDown(app.views.selectListClaimerServiceView);
					    self.params.technical_service_id =  self.getIdInDropDown(app.views.selectListClaimerTechnicalServiceView);
					    self.params.technical_site_id =  self.getIdInDropDown(app.views.selectListClaimerTechnicalSiteView);
						self.model.update(self.params);
						app.collections.claimers.add(self.model);
						$('#modalSaveClaimer').modal('hide');
						app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.placeDeleteOk);
						self.render();
					}				
				},
				error: function(e){
					alert("Impossible de mettre à jour le demandeur");
				}
	    });
	},
	
	
	/** Delete the selected claimer
	*/
	deleteClaimer: function(e){
		e.preventDefault();
		
	   	var self = this;
		this.model.delete({
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.claimers.remove(self.model);
					$('#modalDeleteClaimer').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.claimerDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer le demandeur");
			}
	
		});
	},
	
	
	preventDefault: function(event){
		event.preventDefault();
	},



//    /** Display information in the Modal view
//    */
//    setInfoModal: function(e){
//
//        // Retrieve the ID of the intervention //
//        var link = $(e.target);
//
//        var id = _(link.parents('tr').attr('id')).strRightBack('_');
//
//        this.selectedClaimer = _.filter(app.collections.claimers.models, function(item){ return item.attributes.id == id });
//        var selectedClaimerJson = this.selectedClaimer[0].toJSON();
//
//        $('#infoModalDeleteClaimer p').html(selectedClaimerJson.name);
//        $('#infoModalDeleteClaimer small').html(selectedClaimerJson.type_id[1]);
//    },
//
//
//
//    /** Add a new claimer
//    */
//    addClaimer: function(e){
//		e.preventDefault();
//		alert('TODO: save the new claimer');
//	},
//
//
//
//	/** Delete the selected claimer
//	*/
//	deleteClaimer: function(e){
//		var self = this;
//		this.selectedClaimer[0].delete({
//			success: function(e){
//				app.collections.claimers.remove(self.selectedClaimer[0]);
//				$('#modalDeleteClaimer').modal('hide');
//				app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.claimerDeleteOk);
//				self.render();
//			},
//			error: function(e){
//				alert("Impossible de supprimer le demandeur");
//			}
//
//		});
//	},
//
//
//
//    preventDefault: function(event){
//    	event.preventDefault();
//    },

});