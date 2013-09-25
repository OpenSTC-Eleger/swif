/******************************************
* Services List View
*/
app.Views.ServicesListView = app.Views.GenericListView.extend({
	
	templateHTML: 'servicesList',
	

	// The DOM events  //
	events: function(){
		return _.defaults({
			'click a.modalCreateService' : 'modalCreateService',
		}, 
			app.Views.GenericListView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize: function () {
		var self = this;

		this.initCollection().done(function(){

			// Unbind & bind the collection //
			self.collection.off();
			self.listenTo(self.collection, 'add', self.add);

			app.router.render(self);
		})
	},



	/** When the model ara created //
	*/
	add: function(model){

		var officersListView = new app.Views.OfficersListView({model: model});
		var itemServiceView  = new app.Views.ItemServiceView({ model: model, officersListView: officersListView });

		$('#rows-items').prepend(officersListView.render().el);
		$('#rows-items').prepend(itemServiceView.render().el);
	

		app.Helpers.Main.highlight($(itemServiceView.el))

		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.serviceCreateOk);
		this.partialRender();
	},



	/** Display the view
	*/
    render: function () {
    	var self = this;
		
		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.servicesList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);



		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang      : app.lang,
				nbServices: self.collection.cpt
			});

			$(self.el).html(template);

			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);


			// Create item service view //
			_.each(self.collection.models, function(service, i){

				var officersListView = new app.Views.OfficersListView({model: service});
				var itemServiceView  = new app.Views.ItemServiceView({model: service, officersListView: officersListView});

				$('#rows-items').append(itemServiceView.render().el);
				$('#rows-items').append(officersListView.render().el);
			});


			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page       : self.options.page.page,
				collection : self.collection
			})
			
		});

		$(this.el).hide().fadeIn();
		
        return this;
    },


    /** Partial Render of the view
	*/
	partialRender: function (type) {
		var self = this; 

		this.collection.count(this.fetchParams).done(function(){
			$('#badgeNbServices').html(self.collection.cpt);
			app.views.paginationView.render();
		});
	},

    

	/** Modal form to create a new Service
	*/
	modalCreateService: function(e){
		e.preventDefault();
		
		app.views.modalServiceView = new app.Views.ModalServiceView({
			el  : '#modalSaveService'
		});
	},




	/** Collection Initialisation
	*/
	initCollection: function(){
		var self = this;

		// Check if the collections is instantiate //
		if(_.isUndefined(this.collection)){ this.collection = new app.Collections.ClaimersServices(); }


		// Check the parameters //
		if(_.isUndefined(this.options.sort)){
			this.options.sort = this.collection.default_sort;
		}
		else{
			this.options.sort = app.Helpers.Main.calculPageSort(this.options.sort);	
		}
		this.options.page = app.Helpers.Main.calculPageOffset(this.options.page);


		// Create Fetch params //
		this.fetchParams = {
			silent : true,
			data   : {
				limit  : app.config.itemsPerPage,
				offset : this.options.page.offset,
				sort   : this.options.sort.by+' '+this.options.sort.order
			}
		};
		if(!_.isUndefined(this.options.search)){
			this.fetchParams.data.filters = app.Helpers.Main.calculSearch({search: this.options.search }, app.Models.ClaimerService.prototype.searchable_fields);
		}


		return $.when(self.collection.fetch(this.fetchParams))
			.fail(function(e){
				console.log(e);
			})
	},
































	/** Save Officer
	*/
	saveOffiAAcer: function(e) {
		e.preventDefault();
	
		var group_id = this.getIdInDropDown(app.views.selectListGroupsView);
		this.services = _.map($("#officerServices").sortable('toArray'), function(service){ return _(_(service).strRightBack('_')).toNumber(); }); 
		
		if( this.$('#officerPassword').val() != '' ){
			this.params = {
				name: this.$('#officerName').val().toUpperCase(),
				firstname: this.$('#officerFirstname').val(),
				user_email: this.$('#officerEmail').val(),
				login: this.$('#officerLogin').val(),
				new_password: this.$('#officerPassword').val(),
				groups_id:[[6, 0, [group_id[0]]]],
				//isManager: group_id[0]==19? true: false,
				service_id: this.selectedServiceJson.id,
				service_ids: [[6, 0, this.services]],
			};
		}
		else{
			this.params = {
				name: this.$('#officerName').val()	.toUpperCase(),
				firstname: this.$('#officerFirstname').val(),
				user_email: this.$('#officerEmail').val(),
				login: this.$('#officerLogin').val(),
				groups_id:[[6, 0, [group_id[0]]]],
				//isManager: group_id[0]==19? true: false,
				service_id: this.selectedServiceJson.id,
				service_ids: [[6, 0, this.services]],
			};
		}
	
		     
		var self = this;
		this.modelId = this.selectedOfficerJson==null?0: this.selectedOfficerJson.id;
	
	    app.Models.Officer.prototype.save(
	    	this.params,
	    	this.modelId, {
			success: function(data){
				
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.models.user.getTeamsAndOfficers();

					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
					
					$('#modalSaveOfficer').modal('hide');
				}				
			},
			error: function(e){
				alert('Impossible de créer ou mettre à jour l\'équipe');
			}
		});
	},
	


});