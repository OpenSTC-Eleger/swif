/******************************************
* Categories Tasks List View
*/
app.Views.CategoriesTasksListView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'categoriesTasks',
	
	numberListByPage: 25,

	selectedCat : '',


    // The DOM events //
    events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',

		'click a.modalDeleteCat'  		: 'modalDeleteCat',
		'click a.modalSaveCat'  		: 'modalSaveCat',

		'submit #formSaveCat' 			: "saveCat", 
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
		app.router.setPageTitle(app.lang.viewsTitles.categoriesTasksList);


		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		var categories = app.collections.categoriesTasks.models;

		var len = categories.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		
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
						
			$('#catServices, #servicesList').sortable({
				connectWith: 'ul.sortableServicesList',
				dropOnEmpty: true,
				forcePlaceholderSize: true,
				forceHelperSize: true,
				placeholder: 'sortablePlaceHold',
				containment: '.servicesDroppableArea',
				cursor: 'move',
				opacity: '.8',
				revert: 300,
				receive: function(event, ui){
					//self.saveServicesCategories();
				}
			});			
			
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

    	this.displayTeamInfos(e);
    	var link = $(e.target);
    	var id =  _(link.parents('tr').attr('id')).strRightBack('_');
        this.selectedCat = _.filter(app.collections.categoriesTasks.models, function(item){ return item.attributes.id == id });

        if( this.selectedCat.length>0 ) {
        	this.model = this.selectedCat[0];
        	this.selectedCatJson = this.model.toJSON();
        }
        else {
        	this.selectedCatJson = null;        	
        }        
    },



    /** Add a new categorie
    */
    modalSaveCat: function(e){       
        this.setModel(e);	
        
    	app.views.selectListCategoriesView = new app.Views.DropdownSelectListView({el: $("#catParent"), collection: app.collections.categoriesTasks})
		app.views.selectListCategoriesView.clearAll();
		app.views.selectListCategoriesView.addEmptyFirst();
		app.views.selectListCategoriesView.addAll();
        
        $('#catName').val('');
		$('#catCode').val('');
		$('#catUnit').val('');
        if( this.selectedCatJson ) {
			$('#catName').val(this.selectedCatJson.name);
			$('#catCode').val(this.selectedCatJson.code);
			$('#catUnit').val(this.selectedCatJson.unit);
			if( this.selectedCatJson.parent_id )
				app.views.selectListCategoriesView.setSelectedItem( this.selectedCatJson.parent_id[0] );	
	
        }  

		
		// Set the focus to the first input of the form //
		$('#modalSaveCat').on('shown', function(e) {
			$(this).find('input:not(:disabled), textarea').first().focus();
		})
    },
    


	/** Display category services
	*/
	displayTeamInfos: function(e){
		e.preventDefault();

		// Retrieve the ID of the intervention //
		var link = $(e.target);
		var id = _(link.parents('tr').attr('id')).strRightBack('_');
		
		// Clear the list of the user //
		$('#catServices li, #servicesList li').remove();

		var catServices = new Array();
		if( id ) {
			this.selectedCat = _.filter(app.collections.categoriesTasks.models, function(item){ return item.attributes.id == id });
			var selectedCatJson = this.selectedCat[0].toJSON();	
			
			// Display the services of the team //
			_.each(selectedCatJson.service_ids, function (service, i){
				$('#catServices').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
				catServices[i] = service.id;
			});
		};
		
	    //search no technical services
		var noTechnicalServices = _.filter(app.collections.claimersServices.models, function(service){
			return service.attributes.technical != true 
		});
		//remove no technical services
		app.collections.claimersServices.remove(noTechnicalServices);
		app.collections.claimersServices.toJSON()

		// Display the remain services //
		_.filter(app.collections.claimersServices.toJSON(), function (service, i){ 
			if(!_.contains(catServices, service.id)){
				$('#servicesList').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
			}
		});

		var nbRemainServices = $('#servicesList li').length;
		$('#badgeNbServices').html(nbRemainServices);
		
	},



    /** Display information in the Modal view
    */
    modalDeleteCat: function(e){
        
        // Retrieve the ID of the categorie //
    	this.setModel(e);

        $('#infoModalDeleteCat p').html(this.selectedCatJson.name);
        $('#infoModalDeleteCat small').html(this.selectedCatJson.code);
    },
    
	

	/** Save  place
	*/
	saveCat: function(e) {		     
    	e.preventDefault();

	     var self = this;
	     
	     var parent_id = this.getIdInDropDown(app.views.selectListCategoriesView);
	     this.services = _.map($("#catServices").sortable('toArray'), function(service){ return _(_(service).strRightBack('_')).toNumber(); });     
	     
	     this.params = {	
		     name: this.$('#catName').val(),
		     code: this.$('#catCode').val(),
		     unit: this.$('#catUnit').val(),
		     parent_id: parent_id,
		     service_ids: [[6, 0, this.services]],
	     };
	     
	    
	    this.params.parent_id =  parent_id[0]
	    this.modelId = this.selectedCatJson==null?0: this.selectedCatJson.id;
	    var self = this;

	    app.Models.CategoryTask.prototype.save(
	    	this.params, 
	    	this.modelId, {
				success: function(data){
					console.log(data);
					if(data.error){
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else{
						if( self.modelId==0 ){
							self.model = new app.Models.CategoryTask({id: data.result.result});
						}
						
						self.params.parent_id = self.getIdInDropDown(app.views.selectListCategoriesView);						
						self.params.service_ids = self.services;
						
						self.model.update(self.params);
						app.collections.categoriesTasks.add(self.model);
						$('#modalSaveCat').modal('hide');
						app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.catCreateOk);
						self.render();
					}				
				},
				error: function(e){
					alert("Impossible de mettre à jour le site");
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
					app.collections.categoriesTasks.remove(self.model);
					$('#modalDeleteCat').modal('hide');
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