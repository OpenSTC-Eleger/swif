/******************************************
* Row Officers List View
*/
app.Views.OfficersListView = Backbone.View.extend({

	tagName      : 'tr',

	className    : 'row-nested-objects-collapse',

	templateHTML : 'officersList',

	isDisplay    : false,


	// The DOM events  //
	events: {
		'click button.modalCreateOfficer' : 'modalCreateOfficer'
	},



	/** View Initialization
	*/
	initialize: function (params) {
		this.options = params;

		// Instantiate the collection //
		this.collection = new app.Collections.Officers();


		this.collection.off();
		this.listenTo(this.collection, 'add', this.add);

	},



	/** When the model ara created //
	*/
	add: function(model){

		var itemOfficerView  = new app.Views.ItemOfficerView({ model: model });
		$(this.el).find('#rows-officers').prepend(itemOfficerView.render().el);
		app.Helpers.Main.highlight($(itemOfficerView.el));
		$('div.alert-info').fadeOut();

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

					$(self.el).find('#rows-officers').html('');

					// Create item Officer view //
					_.each(self.collection.models, function(officer, i){
						var itemOfficerView  = new app.Views.ItemOfficerView({model: officer});
						$(self.el).find('#rows-officers').append(itemOfficerView.render().el);
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
			el  : '#modalSaveOfficer',
			officersListView : this
		});
	},



	/** Collection Initialisation
	*/
	fetchOfficers: function(){
		var self = this;


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