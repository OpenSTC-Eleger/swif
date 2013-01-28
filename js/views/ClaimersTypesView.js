/******************************************
* Claimers List View
*/
app.Views.ClaimersTypesView = Backbone.View.extend({

	
	el : '#rowContainer',
	
	templateHTML: 'claimersTypes',
	
	numberListByPage: 25,

	selectedCat : '',


    // The DOM events //
    events: {
		'click li.active'									: 'preventDefault',
		'click li.disabled'									: 'preventDefault',

		'click a.modalDeleteClaimersTypes'  				: 'modalDeleteClaimersTypes',
		'click a.modalSaveClaimersTypes'  					: 'modalSaveClaimersTypes',

		'submit #formSaveClaimersTypes' 					: "saveClaimersTypes", 
		'click button.btnDeleteClaimersTypes' 				: 'deleteClaimersTypes'
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
        app.router.setPageTitle(app.lang.viewsTitles.claimersTypesList);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var claimersTypes = app.collections.claimersTypes.models;
		
	    var claimersTypesSortedArray = _.sortBy(claimersTypes, function(item){ 
	          return item.attributes.name; 
        });

		var len = claimersTypesSortedArray.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				claimersTypes: claimersTypesSortedArray,
				lang: app.lang,
				nbClaimersTypes: len,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});
			
			$(self.el).html(template);
		});

		$(this.el).hide().fadeIn('slow');
		
        return this;
    },
    
    setModel: function(e) {
    	e.preventDefault();
    	var link = $(e.target);
    	var id =  _(link.parents('tr').attr('id')).strRightBack('_');
        this.selected = _.filter(app.collections.claimersTypes.models, function(item){ return item.attributes.id == id });
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
    modalSaveClaimersTypes: function(e){       
        this.setModel(e);	
        
        $('#claimersTypesName').val('');
        $('#claimersTypesCode').val('');
        if( this.selectedJson ) {
			$('#claimersTypesName').val(this.selectedJson.name);
			$('#claimersTypesCode').val(this.selectedJson.name);
			
        }       

    },


    /** Display information in the Modal view
    */
    modalDeleteClaimersTypes: function(e){
        
        // Retrieve the ID of the categorie //
    	this.setModel(e);

        $('#infoModalDeleteClaimersTypes p').html(this.selectedJson.name);
        $('#infoModalDeleteClaimersTypes small').html(this.selectedJson.code);
    },
    
    

    /** Save Claimer Type
	*/
	saveClaimersTypes: function(e) {		     
    	e.preventDefault();

	     
	     
	     this.params = {	
		     name: this.$('#claimersTypesName').val(),
		     code: this.$('#claimersTypesCode').val(),
	     };
	     
	    this.modelId = this.selectedJson==null?0: this.selectedJson.id;
	    var self = this;
	    
	    app.Models.ClaimerType.prototype.save(
	    	this.params, 
	    	this.modelId, {
				success: function(data){
					console.log(data);
					if(data.error){
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else{
						if( self.modelId==0 )
							self.model = new app.Models.ClaimerType({id: data.result.result}); 
						self.model.update(self.params);
						app.collections.claimersTypes.add(self.model);
						$('#modalSaveClaimersTypes').modal('hide');
						app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.placeDeleteOk);
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
    deleteClaimersTypes: function(e){
    	e.preventDefault();
    	
       	var self = this;
		this.model.delete({
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.claimersTypes.remove(self.model);
					$('#modalDeleteClaimersTypes').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.catDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer la catégorie");
			}

		});
    },


    preventDefault: function(event){
    	event.preventDefault();
    },

});