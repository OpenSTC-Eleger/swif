/******************************************
* Row Officers List View
*/
app.Views.OfficersListView = Backbone.View.extend({

	tagName      : 'tr',

	className    : 'row-item row-nested-objects-collapse',

	templateHTML : 'officersList',

	isDisplay    : false,


	// The DOM events  //
	events: {
		'click a.modalCreateOfficer' : 'modalCreateOfficer'
	},



	/** View Initialization
	*/
	initialize: function () {

	},



	/** When the model ara created //
	*/
	add: function(model){

		var itemOfficerView  = new app.Views.ItemOfficerView({ model: model });
		$('#rows-items').prepend(itemOfficerView.render().el);
		app.Helpers.Main.highlight($(itemOfficerView.el))

		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.officerCreateOk);
	},



	/** Display the view
	*/
    render: function () {
    	var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang      : app.lang,
				service   : self.model
			});

			$(self.el).html(template);


		});

		return this;
	},



	collapse: function(e){
		var self = this;


		// Is know hide //
		if(this.isDisplay){
			this.isDisplay = false;
		}
		// Is Know Display //
		else{

			if(!_.isEmpty(self.model.getUsersId())){

				// Fetch the Officers //
				self.fetchOfficers().done(function(){

					// Create item Officer view //
					_.each(self.collection.models, function(officer, i){
						console.log(officer.attributes);
						var itemOfficerView  = new app.Views.ItemOfficerView({model: officer});
						$('#rows-officers').append(itemOfficerView.render().el);
					});
				})
			}

			this.isDisplay = true;
		}


		$(this.el).stop().fadeToggle();

	},



	/** Modal form to create a new Officer
	*/
	modalCreateOfficer: function(e){
		e.preventDefault();
		
		app.views.modalOfficerView = new app.Views.ModalOfficerView({
			el  : '#modalSaveOfficer'
		});
	},



	/** Collection Initialisation
	*/
	fetchOfficers: function(){
		var self = this;

		// Check if the collections is instantiate //
		if(_.isUndefined(this.collection)){ this.collection = new app.Collections.Officers(); }


		this.options.sort = this.collection.default_sort;

		// Create Fetch params //
		this.fetchParams = {
			silent : true,
			data   : {
				sort    : this.options.sort.by+' '+this.options.sort.order,
				filters : {0: {field: 'service_id.id', operator: '=', value: this.model.getId()}}
			}
		};


		return $.when(self.collection.fetch(this.fetchParams))
			.fail(function(e){
				console.log(e);
			})
	}



});