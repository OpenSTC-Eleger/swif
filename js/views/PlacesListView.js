/******************************************
* Places List View
*/
app.Views.PlacesListView = Backbone.View.extend({

	el            : '#rowContainer',
	
	templateHTML  : 'places',
	
	selectedPlace : '',
	
	urlParemers   : ['search', 'sort'],


	// The DOM events //
	events: {
		'click ul.sortable li'                     : 'preventDefault',

		'submit form.form-search'                  : 'search',
		'click table.table-sorter th[data-column]' : 'sort',

		'click a.modalDeletePlace'                 : 'modalDeletePlace',
		
		'click a.modalSavePlace'                   : 'modalSavePlace',
		'submit #formSavePlace'                    : 'savePlace',
		
		'change #placeWidth, #placeLenght'         : 'calculArea'
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
		app.router.setPageTitle(app.lang.viewsTitles.placesList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		var places = app.collections.places;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang: app.lang,
				places: places,
				nbPlaces: app.collections.places.cpt,
			});

			$(self.el).html(template);

			$('*[data-toggle="tooltip"]').tooltip();
			

			// Advance Select List View //
			app.views.advancedSelectBoxPlaceTypeView = new app.Views.AdvancedSelectBoxView({el: $("#placeType"), model: app.Models.PlaceType.prototype.model_name })
			app.views.advancedSelectBoxPlaceTypeView.render();

			app.views.advancedSelectBoxPlaceParentView = new app.Views.AdvancedSelectBoxView({el: $("#placeParentPlace"), model: app.Models.Place.prototype.model_name })
			app.views.advancedSelectBoxPlaceParentView.render();

			app.views.advancedSelectBoxPlaceServices = new app.Views.AdvancedSelectBoxView({el: $("#placeServices"), model: app.Models.ClaimerService.prototype.model_name })
			app.views.advancedSelectBoxPlaceServices.render();


			
			// Display sort icon if there is a sort //
			if(self.options.sort.order == 'ASC'){ var newIcon = "icon-sort-up"; }else{ var newIcon = "icon-sort-down"; }
			$("th[data-column='"+self.options.sort.by+"'] > i").removeClass('icon-sort icon-muted')
			.addClass('active ' + newIcon);


			// Rewrite the research in the form //
			if(!_.isUndefined(self.options.search)){
				$("form.form-search input").val(self.options.search);
			}

			

			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page   : self.options.page,
				nbPage : Math.ceil(app.collections.places.cpt / app.config.itemsPerPage) 
			})
			app.views.paginationView.render();


			// Set the focus to the first input of the form //
			$('#modalSavePlace, #modalDeletePlace').on('shown', function (e) {
				$(this).find('input, textarea').first().focus();
			})

		});

		$(this.el).hide().fadeIn('slow');

		return this;
	},




	setModel: function(e) {
	
		this.model = null;
		this.selectedPlaceJson = null;
		
		e.preventDefault();
		var link = $(e.target);
		var id =  _(link.parents('tr').attr('id')).strRightBack('_');
		this.selectedPlace = _.filter(app.collections.places.models, function(item){ return item.attributes.id == id });
		if( this.selectedPlace.length>0 ) {
			this.model = this.selectedPlace[0];
			this.selectedPlaceJson = this.model.toJSON();        
		}
	},



	/** Add a new categorie
	*/
	modalSavePlace: function(e){  
		this.setModel(e);


		// Reset the form //
		$('#placeName, #placeWidth, #placeLenght, #placeArea').val('');
		app.views.advancedSelectBoxPlaceTypeView.reset();
		app.views.advancedSelectBoxPlaceParentView.reset();
		app.views.advancedSelectBoxPlaceServices.reset();

		
		// If it's an update //
		if( this.selectedPlaceJson ) {
			$('#placeName').val(this.selectedPlaceJson.name);

			if( this.selectedPlaceJson.type ){
				app.views.advancedSelectBoxPlaceTypeView.setSelectedItem(this.selectedPlaceJson.type);
			}
			if( this.selectedPlaceJson.site_parent_id ){
				app.views.advancedSelectBoxPlaceParentView.setSelectedItem(this.selectedPlaceJson.site_parent_id);
			}
			if(!_.isEmpty(this.selectedPlaceJson.service_ids)){
				app.views.advancedSelectBoxPlaceServices.setSelectedItems(this.selectedPlaceJson.service_ids);
			}

			$('#placeWidth').val(this.selectedPlaceJson.width);
			$('#placeLenght').val(this.selectedPlaceJson.lenght);
			$('#placeArea').val(this.selectedPlaceJson.surface);			
		}

	},



	/** Save the place
	*/
	savePlace: function (e) {


		e.preventDefault();


		var self = this;

	 
		this.params = {	
			name: this.$('#placeName').val(),
			service_ids: [[6, 0, app.views.advancedSelectBoxPlaceServices.getSelectedItems()]],
			type: app.views.advancedSelectBoxPlaceTypeView.getSelectedItem(),
			site_parent_id: app.views.advancedSelectBoxPlaceParentView.getSelectedItem(),
			width: this.$('#placeWidth').val(),
			lenght: this.$('#placeLenght').val(),
			surface: this.$('#placeArea').val(),
		};

		this.modelId = this.selectedPlaceJson==null?0: this.selectedPlaceJson.id;
		var self = this;
		
		app.Models.Place.prototype.save(
			this.params, 
			this.modelId, {
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					$('#modalSavePlace').modal('hide');
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
					console.log('Success SAVE PLACE');
				}
			},
			error: function () {
				console.log('ERROR - Unable to save the Place');
			},	
		});
	},



	/** Display information in the Modal view
	*/
	modalDeletePlace: function(e){

		e.preventDefault();

		var link = $(e.target);
		var id =  _(link.parents('tr').attr('id')).strRightBack('_');

		var model = app.collections.places.get(id);


		app.views.modalDeleteView = new app.Views.ModalDeleteView({
			el    : '#modalDeletePlace',
			model : model
		});
		app.views.modalDeleteView.render();
	},



	/** Calcul the area of the place
	*/
	calculArea: function (e) {

		var area = $('#placeWidth').val() * $('#placeLenght').val();

		$('#placeArea').val(area);
	},



	/** Sort the row of the table
	*/
	sort: function(e){

		if(!$(e.target).is('i')){
			var sortBy = $(e.target).data('column');
		}
		else{
			var sortBy = $(e.target).parent('th').data('column');	
		}

		// Retrieve the current Sort //
		var currentSort = this.options.sort;


		// Calcul the sort Order //
		var sortOrder = '';
		if(sortBy == currentSort.by){
			if(currentSort.order == 'ASC'){
				sortOrder = 'DESC';
			}
			else{
				sortOrder = 'ASC';
			}
		}
		else{
			sortOrder = 'ASC';
		}

		this.options.sort.by = sortBy;
		this.options.sort.order = sortOrder;

		app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
	},



	/** Perform a search on the sites
	*/
	search: function(e){
		e.preventDefault();

		var query = $("form.form-search input").val();

		if(_.isEmpty(query)){
			delete this.options.search;
		}
		else{
			this.options.search = query
		}

		app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
	},

	

	/** Build the url with the parameters
	*/
	urlBuilder: function(){
		var self = this;

		// Retrieve the baseurl of the view //
		var url = app.routes.places.baseUrl;


		// Iterate all urlParameters //
		_.each(this.urlParemers, function(value, item){
			
			// Check if the options parameter aren't undefined or null //
			if(!_.isUndefined(self.options[value]) && !_.isNull(self.options[value])){
				
				// Check if the value of the parameter is not an object //
				if(!_.isObject(self.options[value])){
					url += '/'+value+'/'+self.options[value];
				}
				else{
					var params = '';
					_.each(self.options[value], function(value, item){
						if(!_.isEmpty(params)){
							params += '-'+value;
						}
						else{
							params += value;
						}
					})

					url += '/'+value+'/'+params;
				}
			}

		})

		return url;
	},



	preventDefault: function(event){
		event.preventDefault();
	},

});