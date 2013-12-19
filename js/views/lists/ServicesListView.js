define([
	'app',
	'appHelpers',

	'claimersServicesCollection',
	'claimerServiceModel',
	'officerModel',
	
	'genericListView',
	'paginationView',
	'itemServiceView',
	'modalServiceView',
	'officersListView'
	

], function(app, AppHelpers, ClaimersServicesCollection, ClaimerServiceModel, OfficerModel, GenericListView, PaginationView,ItemServiceView,ModalServiceView, OfficersListView){

	'use strict';

	
	/******************************************
	* Services List View
	*/
	var ServicesListView = GenericListView.extend({
		
		templateHTML: 'lists/servicesList',
		
	
		// The DOM events  //
		events: function(){
			return _.defaults({
				'click a.modalCreateService' : 'modalCreateService',
			}, 
				GenericListView.prototype.events
			);
		},
	
	
	
		/** View Initialization
		*/
		initialize: function (params) {
			this.options = params;
	
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
	
			var officersListView = new OfficersListView({model: model});
			var itemServiceView  = new ItemServiceView({ model: model, officersListView: officersListView });
	
			$('#rows-items').prepend(officersListView.render().el);
			$('#rows-items').prepend(itemServiceView.render().el);
		
	
			AppHelpers.highlight($(itemServiceView.el))
	
			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.serviceCreateOk);
			this.partialRender();
		},
	
	
	
		/** Display the view
		*/
	    render: function () {
	    	var self = this;
			
			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.servicesList);
	
	
	
			// Retrieve the template // 
			$.get("templates/" + this.templateHTML + ".html", function(templateData){
				var template = _.template(templateData, {
					lang      : app.lang,
					nbServices: self.collection.cpt
				});
	
				$(self.el).html(template);
	
				// Call the render Generic View //
				GenericListView.prototype.render(self.options);
	
	
				// Create item service view //
				_.each(self.collection.models, function(service, i){
	
					var officersListView = new OfficersListView({model: service});
					var itemServiceView  = new ItemServiceView({model: service, officersListView: officersListView});
	
					$('#rows-items').append(itemServiceView.render().el);
					$('#rows-items').append(officersListView.render().el);
				});
	
	
				// Pagination view //
				app.views.paginationView = new PaginationView({ 
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
			
			app.views.modalServiceView = new ModalServiceView({
				el  : '#modalSaveService'
			});
		},
	
	
	
	
		/** Collection Initialisation
		*/
		initCollection: function(){
			var self = this;
	
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new ClaimersServicesCollection(); }
	
	
			// Check the parameters //
			if(_.isUndefined(this.options.sort)){
				this.options.sort = this.collection.default_sort;
			}
			else{
				this.options.sort = AppHelpers.calculPageSort(this.options.sort);	
			}
			this.options.page = AppHelpers.calculPageOffset(this.options.page);
	
	
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
				this.fetchParams.data.filters = AppHelpers.calculSearch({search: this.options.search }, ClaimerServiceModel.prototype.searchable_fields);
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
		
		    OfficerModel.prototype.save(
		    	this.params,
		    	this.modelId, {
				success: function(data){
					
					if(data.error){
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else{
						app.current_user.getTeamsAndOfficers();
	
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

	return ServicesListView;
})