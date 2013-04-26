/******************************************
* Categories Interventions List View
*/
app.Views.CategoriesInterventionsListView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'categoriesInterventions',
	
	numberListByPage: 25,

	selectedCat : '',


    // The DOM events //
    events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',

		'click a.modalDeleteCat'  		: 'modalDeleteCat',
		'click a.modalSaveCat'  		: 'modalSaveCat',

		'submit #formSaveCat' 			: 'saveCat',
		'click button.btnDeleteCat' 	: 'deleteCat'
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
		app.router.setPageTitle(app.lang.viewsTitles.categoriesIntersList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		var categories = app.collections.categoriesInterventions.models;

		var len = categories.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		console.log("------------------------------>");
		console.log(categories);

		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				cats: categories,
				lang: app.lang,
				nbCats: len,
				startPos: startPos, endPos: endPos,
				page: self.options.page,
				pageCount: pageCount,
			});

			$(self.el).html(template);
			
		});

		$(this.el).hide().fadeIn('slow');
		
        return this;
    },



	/** Retrieve the model in the table
	*/
    setModel: function(e) {
       	e.preventDefault();

    	var link = $(e.target);
    	var id =  _(link.parents('tr').attr('id')).strRightBack('_');
        this.selectedCat = _.filter(app.collections.categoriesInterventions.models, function(item){ return item.attributes.id == id });

        if(this.selectedCat.length > 0){
        	this.model = this.selectedCat[0];
        	this.selectedCatJson = this.model.toJSON();
        }
        else{
        	this.selectedCatJson = null;
        }
    },



    /** Add a new categorie
    */
    modalSaveCat: function(e){       
        this.setModel(e);	
        
        
        // Reset Form //
        $('#catName').val('');
        $('#catCode').val('');

        if( this.selectedCatJson ) {
			$('#catName').val(this.selectedCatJson.name);
			$('#catCode').val(this.selectedCatJson.code);
        }  

		
		// Set the focus to the first input of the form //
		$('#modalSaveCat').on('shown', function(e) {
			$(this).find('input:not(:disabled), textarea').first().focus();
		})
    },
    


    /** Display information in the Modal view
    */
    modalDeleteCat: function(e){
        
        // Retrieve the ID of the categorie //
    	this.setModel(e);

        $('#infoModalDeleteCat p').html(this.selectedCatJson.name);
        $('#infoModalDeleteCat small').html(this.selectedCatJson.code);
    },
    
	

	/** Save Categorie
	*/
	saveCat: function(e) {		     
    	e.preventDefault();

		var self = this;
	     
     
		this.params = {	
			name: this.$('#catName').val(),
			code: this.$('#catCode').val(),
		};

     
	    this.modelId = this.selectedCatJson == null ? 0 : this.selectedCatJson.id;


	    app.Models.CategoryIntervention.prototype.save(
	    	this.params, 
	    	this.modelId, {
				success: function(data){
					console.log(data);
					if(data.error){
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else{
						if( self.modelId==0 ){
							self.model = new app.Models.CategoryIntervention({id: data.result.result});
						}
						
					
						self.model.update(self.params);
						app.collections.categoriesInterventions.add(self.model);
						$('#modalSaveCat').modal('hide');
						app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.catCreateOk);
						self.render();
					}				
				},
				error: function(e){
					alert('Impossible d\'enregistrer la catégorie');
				}
	    });
	},



    /** Delete the selected categorie
    */
    deleteCat: function(e){
    	e.preventDefault();
    	
       	var self = this;
		this.model.delete({
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.categoriesInterventions.remove(self.model);
					$('#modalDeleteCat').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.catDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert('Impossible de supprimer la catégorie');
			}

		});
    },



    preventDefault: function(event){
    	event.preventDefault();
    },

});