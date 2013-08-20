/******************************************
* Valid Request Modal View
*/
app.Views.ModalValidRequestView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/modalValidRequest',


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


		var params = {
			state   : app.Models.Request.status.valid.key,
			intervention_assignement_id : app.views.advancedSelectBoxCategoryRequestView.getSelectedItem(),
			service_id : app.views.advancedSelectBoxRequestServiceView.getSelectedItem(),
			date_deadline : moment($('#requestDateDeadline').val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
			description: $('#requestDescription').val(),
			

			create_task: $('#createAssociatedTask').is(':checked'),
			planned_hours: moment.duration({ hours: _($("#taskHour").val()).strLeft(':'), minutes: _($("#taskHour").val()).strRight(':') }).asHours(),
			category_id : app.views.advancedSelectBoxTaskcategoryView.getSelectedItem()


		};

		console.log(params);


		/*
		// Set the properties of the model //
		this.model.setServices(app.views.advancedSelectBoxCategoryRequestView.getSelectedItems(), true);
		this.model.setType(app.views.advancedSelectBoxPlaceTypeView.getSelectedItem(), true);
		this.model.setParentPlace(app.views.advancedSelectBoxPlaceParentView.getSelectedItem(), true);
		this.model.setWidth(this.$('#placeWidth').val(), true);
		this.model.setLenght(this.$('#placeLenght').val(), true);
		this.model.setSurface(this.$('#placeArea').val(), true);*/


		this.model.save(params, {patch: true, silent: true})
			.done(function(data) {
				self.modal.modal('hide');
				self.model.fetch({ data : {fields : self.model.fields} });
			})
			.fail(function (e) {
				console.log(e);
			})
			.always(function () {
				$(self.el).find("button[type=submit]").button('reset');
			});
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
			app.views.advancedSelectBoxTaskcategoryView.setSearchParam({ field : 'service_ids.id', operator : '=', value : app.views.advancedSelectBoxRequestServiceView.getSelectedItem()}, true);
		}
	},



	/** When Request Service change, the Task categories are updated
	*/
	filterTaskCategories: function(e){

		if(app.views.advancedSelectBoxRequestServiceView.getSelectedItem() != ''){
			app.views.advancedSelectBoxTaskcategoryView.setSearchParam({ field : 'service_ids.id', operator : '=', value : app.views.advancedSelectBoxRequestServiceView.getSelectedItem()}, true);
		}
	}

});