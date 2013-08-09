/******************************************
* Valid Request Modal View
*/
app.Views.ModalValidRequestView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/modalValidRequest',

	modal        : null,


	// The DOM events //
	events: function(){
		return _.defaults({
			'submit #formValidRequest'     : 'validRequest',
			'change #createAssociatedTask' : 'accordionAssociatedTask',

			'change #requestService' 	   : 'filterTaskCategories'
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {
		var self = this;

		this.modal = $(this.el);

		this.render();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang    : app.lang,
				request : self.model
			});

			self.modal.html(template);

			// Advance Select List View //
			app.views.advancedSelectBoxCategoryRequestView = new app.Views.AdvancedSelectBoxView({el: $("#requestCategory"), collection_url: app.Collections.CategoriesRequests.prototype.url })
			app.views.advancedSelectBoxCategoryRequestView.render();

			app.views.advancedSelectBoxRequestServiceView = new app.Views.AdvancedSelectBoxView({el: $("#requestService"), collection_url: app.Collections.ClaimersServices.prototype.url })
			app.views.advancedSelectBoxRequestServiceView.render();

			app.views.advancedSelectBoxTaskcategoryView = new app.Views.AdvancedSelectBoxView({el: $("#taskCategory"), collection_url: app.Collections.CategoriesTasks.prototype.url })
			app.views.advancedSelectBoxTaskcategoryView.render();

			// Enable the datePicker //
			$('input.datepicker').datepicker({ format: 'dd/mm/yyyy', weekStart: 1, autoclose: true, language: 'fr'});
			$('input.timepicker').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});


			self.modal.modal('show');
		});

		return this;
	},



	/** Delete the model pass in the view
	*/
	validRequest: function(e){
		e.preventDefault();

		var self = this;

		// Set the button in loading State //
		$(this.el).find("button[type=submit]").button('loading');


		/*
		var duration = $("#taskHour").val().split(":");
	    var mDuration = moment.duration ( { hours:duration[0], minutes:duration[1] });

		params = {
				//ask_id: this.model.getId(),

				request_state: app.Models.Request.status.valid.key,
				email_text: app.Models.Request.status.valid.translation,
				project_state: app.Models.Intervention.status.open.key,
				date_deadline: new moment($('#requestDateDeadline').val(), 'DD-MM-YYYY').add('hours',2).toDate(),
				description: $('#requestNote').val(),
				intervention_assignement_id: $('#requestAssignement').val(),
				service_id: $('#requestService').val(),	
				site1: this.model.getSite1()[0],
				planned_hours: mDuration.asHours(),
				category_id: _($('#taskCategory').val()).toNumber(),
				create_task: $('#createAssociatedTask').is(':checked'),
		};

	    this.model.valid(params,
			{
				success: function(data){
					$('#modalValidRequest').modal('hide');
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
				}
			}
		);*/

		/*
		// Set the properties of the model //
		this.model.setName(this.$('#placeName').val(), true);
		this.model.setServices(app.views.advancedSelectBoxPlaceServices.getSelectedItems(), true);
		this.model.setType(app.views.advancedSelectBoxPlaceTypeView.getSelectedItem(), true);
		this.model.setParentPlace(app.views.advancedSelectBoxPlaceParentView.getSelectedItem(), true);
		this.model.setWidth(this.$('#placeWidth').val(), true);
		this.model.setLenght(this.$('#placeLenght').val(), true);
		this.model.setSurface(this.$('#placeArea').val(), true);


		this.model.save()
			.done(function(data) {
				self.modal.modal('hide');

				// Create mode //
				if(self.model.isNew()) {
					self.model.setId(data);
					self.model.fetch({silent: true, data : {fields : self.model.fields} }).done(function(){
						app.views.placesListView.collection.add(self.model);
					})
				// Update mode //
				} else {
					self.model.fetch({ data : {fields : self.model.fields} });
				}
			})
			.fail(function (e) {
				console.log(e);
			})
			.always(function () {
				$(self.el).find("button[type=submit]").button('reset');
			});*/

		console.log('TODO');
	},



	/** Display or Hide Create associated Task Section
	*/
	accordionAssociatedTask: function(e){
		e.preventDefault();

		// Toggle Slide Create associated task section //
		$('fieldset.associated-task').stop().slideToggle('fast', function(){
			$('#modalValidRequest div.modal-body').animate({scrollTop: $('#modalValidRequest div.modal-body').height()}, 400);
		})

		// Set the search params for the Task Category //
		if(app.views.advancedSelectBoxRequestServiceView.getSelectedItem() != ''){
			app.views.advancedSelectBoxTaskcategoryView.setSearchParam({ field : 'service_ids', operator : '=', value : app.views.advancedSelectBoxRequestServiceView.getSelectedItem()}, true);
		}
	},



	/** When Request Service change, the Task categories are updated
	*/
	filterTaskCategories: function(e){

		if(app.views.advancedSelectBoxRequestServiceView.getSelectedItem() != ''){
			app.views.advancedSelectBoxTaskcategoryView.reset();
			app.views.advancedSelectBoxTaskcategoryView.setSearchParam({ field : 'service_ids', operator : '=', value : app.views.advancedSelectBoxRequestServiceView.getSelectedItem()}, true);
		}
	}

});