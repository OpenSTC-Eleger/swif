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


			// Create item service view //
			/*_.each(self.collection.models, function(officer, i){
				var itemOfficerView  = new app.Views.ItemOfficerView({officer: service});
				$('#rows-items').append(itemOfficerView.render().el);
			});*/
			
		});

        return this;
    },



    collapse: function(e){
    	var self = this;

		$(this.el).fadeToggle(function(e){
			
			// Is know hide //
			if(this.isDisplay){
				console.log('il est caché');
				this.isDisplay = false;
			}
			// Is Know Display //
			else{
				self.fetchOfficers().done(function(){

					console.log(self.collection);
				})

				this.isDisplay = true;
			}
		});
    		
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
				filters : {0: {field: 'service_id.id', operator: '=', value: this.model.getId()}},
				fields  : ['name', 'id']
			}
		};


		return $.when(self.collection.fetch(this.fetchParams))
			.fail(function(e){
				console.log(e);
			})
	}



});