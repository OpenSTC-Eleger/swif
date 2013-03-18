/******************************************
* Categories List View
*/
app.Views.AbsentTypesView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'absents',
	
	numberListByPage: 25,

	selectedAbsent : '',


    // The DOM events //
    events: {
		'click li.active'						: 'preventDefault',
		'click li.disabled'						: 'preventDefault',

		'click a.modalDeleteAbsentType'  		: 'modalDeleteAbsentType',
		'click a.modalSaveAbsentType'  			: 'modalSaveAbsentType',

		'submit #formSaveAbsentType' 			: "saveAbsentType", 
		'click button.btnDeleteAbsentType' 		: 'deleteAbsentType'
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
		app.router.setPageTitle(app.lang.viewsTitles.categoriesList);


		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		var absentTypes = app.collections.absentTypes.models;

		var absentTypesSortedArray = _.sortBy(absentTypes, function(item){ 
			return item.attributes.name; 
		});

		var len = absentTypesSortedArray.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				absentTypes: absentTypesSortedArray,
				lang: app.lang,
				nbAbsentTypes: len,
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
        this.selectedAbsent = _.filter(app.collections.absentTypes.models, function(item){ return item.attributes.id == id });
        if( this.selectedAbsent.length>0 ) {
        	this.model = this.selectedAbsent[0];
        	this.selectedAbsentJson = this.model.toJSON();    
        }
        else {
        	this.selectedAbsentJson = null;        	
        }        
    },


    /** Add a new categorie
    */
    modalSaveAbsentType: function(e){       
        this.setModel(e);	
        
        $('#absentTypeName').val('');
		$('#absentTypeCode').val('');
		$('#absentTypeDescription').val('');
        if( this.selectedAbsentJson ) {
			$('#absentTypeName').val(this.selectedAbsentJson.name);
			$('#absentTypeCode').val(this.selectedAbsentJson.code);
			$('#absentTypeDescription').val(this.selectedAbsentJson.description);	
        }       

    },


    /** Display information in the Modal view
    */
    modalDeleteAbsentType: function(e){
        
        // Retrieve the ID of the categorie //
    	this.setModel(e);

        $('#infoModalDeleteAbsentType p').html(this.selectedAbsentJson.name);
        $('#infoModalDeleteAbsentType small').html(this.selectedAbsentJson.code);
    },
    
	

	/** Save  place
	*/
	saveAbsentType: function(e) {		     
    	e.preventDefault();

	     var self = this;
	     
	     this.params = {	
		     name: this.$('#absentTypeName').val(),
		     code: this.$('#absentTypeCode').val(),
		     description: this.$('#absentTypeDescription').val(),
	     };
	     
	    
	    this.modelId = this.selectedAbsentJson==null?0: this.selectedAbsentJson.id;
	    var self = this;

	    app.Models.AbsentType.prototype.save(
	    	this.params, 
	    	this.modelId, {
				success: function(data){
					console.log(data);
					if(data.error){
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else{
						if( self.modelId==0 ){
							self.model = new app.Models.AbsentType({id: data.result.result});
						}

						self.model.update(self.params);
						app.collections.absentTypes.add(self.model);
						$('#modalSaveAbsentType').modal('hide');
						app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.absentTypeSaveOk);
						self.render();
					}				
				},
				error: function(e){
					alert("Impossible de mettre à jour le type d'absence'");
				}
	    });
	},

	
    /** Delete the selected categorie
    */
    deleteAbsentType: function(e){
    	e.preventDefault();
    	
       	var self = this;
		this.model.delete({
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.absentTypes.remove(self.model);
					$('#modalDeleteAbsentType').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.absentTypeDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer le type d'absence'");
			}

		});
    },


    preventDefault: function(event){
    	event.preventDefault();
    },

});