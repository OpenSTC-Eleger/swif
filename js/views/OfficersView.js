/******************************************
* Officers List View
*/
app.Views.OfficersView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'officers',
	
	numberListByPage: 25,

	selectedOfficer: '',


	// The DOM events //
	events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',

		'click a.modalDeleteOfficer'  	: 'modalDeleteOfficer',
		'click a.modalSaveOfficer'  	: 'modalSaveOfficer',

		'submit #formSaveOfficer' 		: 'saveOfficer',
		'click button.btnDeleteOfficer' : 'deleteOfficer'
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
        app.router.setPageTitle(app.lang.viewsTitles.officersList);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');



		var officers = app.collections.officers.models;
		var len = officers.length;

		var officersSortedArray = _.sortBy(officers, function(item){ 
			return item.attributes.name.toUpperCase(); 
		});
		
		console.debug(officers);

		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				officers: officersSortedArray,
				nbOfficers: len,
				lang: app.lang,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});

			$(self.el).html(template);

			// Tooltip //
			$('*[rel="tooltip"]').tooltip({placement: "right"});


			// Fill select Foreman  //
			app.views.selectListGroupsView = new app.Views.DropdownSelectListView({el: $("#officerGroup"), collection: app.collections.groups})
			app.views.selectListGroupsView.clearAll();
			app.views.selectListGroupsView.addEmptyFirst();
			app.views.selectListGroupsView.addAll();
		});

		$(this.el).hide().fadeIn('slow');

		return this;
	},



	setModel: function(e) {
		e.preventDefault();
		var link = $(e.target);
		
		var id =  _(link.parents('tr').attr('id')).strRightBack('_');
		this.selectedOfficer = _.filter(app.collections.officers.models, function(item){ return item.attributes.id == id });

		if( this.selectedOfficer.length > 0 ) {

			this.model = this.selectedOfficer[0];
			this.selectedOfficerJson = this.model.toJSON();

			$('#modalSaveOfficer h3').html(_.capitalize(app.lang.actions.updateOfficer));
		}
		else {
			this.selectedOfficerJson = null;
			
			$('#modalSaveOfficer h3').html(_.capitalize(app.lang.actions.addOfficer));
		}

		console.debug(this.model);
	},



	/** Modal create/update officer
	*/
	modalSaveOfficer: function(e){
		this.setModel(e);

		// Reset the value to null //
		$('#officerName, #officerFirstname, #officerEmail, #officerLogin, #officerPassword').val('');
		app.views.selectListGroupsView.setSelectedItem(0);

		// Update //
		if( this.selectedOfficerJson ) {
			$('#officerName').val(this.selectedOfficerJson.name);
			$('#officerFirstname').val(this.selectedOfficerJson.firstname);

			if(this.selectedOfficerJson.user_email == false){
				$('#officerEmail').val('');
			}
			else{
				$('#officerEmail').val(this.selectedOfficerJson.user_email);
			}
			$('#officerLogin').val(this.selectedOfficerJson.login);

			// Disable the required attribute for the password because it's an update 	//
			$('#officerPassword').removeAttr('required');
		}
		else{
			// Add the required attribute for the password because it's a creation //
			$('#officerPassword').attr('required', 'required');
		}
	},



	/** Display information in the Modal view delete officer
	*/
	modalDeleteOfficer: function(e){

		// Retrieve the ID of the officer //
		this.setModel(e);

		$('#infoModalDeleteOfficer p').html(this.selectedOfficerJson.firstname +' '+ this.selectedOfficerJson.name);
		$('#infoModalDeleteOfficer small').html(_.capitalize(app.lang.lastConnection) +"	 "+ moment(this.selectedOfficerJson.date, 'YYYY-MM-DD HH:mm:ss').format('LLL'));
	},



	/** Save Officer
	*/
	saveOfficer: function(e) {
		e.preventDefault();



		if( this.$('#officerPassword').val() != '' ){
			this.params = {
				name: this.$('#officerName').val().toUpperCase(),
				firstname: this.$('#officerFirstname').val(),
				user_email: this.$('#officerEmail').val(),
				login: this.$('#officerLogin').val(),
				new_password: this.$('#officerPassword').val()
			};
		}
		else{
			this.params = {
				name: this.$('#officerName').val()	.toUpperCase(),
				firstname: this.$('#officerFirstname').val(),
				user_email: this.$('#officerEmail').val(),
				login: this.$('#officerLogin').val()
			};
		}

		     
		var self = this;
		this.modelId = this.selectedOfficerJson==null?0: this.selectedOfficerJson.id;

	    app.Models.Officer.prototype.save(
	    	this.params,
	    	this.modelId, {
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					if( self.modelId==0 ){
						self.model = new app.Models.Officer({id: data.result.result});
					}

					self.model.update(self.params);

					app.collections.officers.add(self.model);

					$('#modalSaveOfficer').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.officerSaveOk);
					self.render();
				}				
			},
			error: function(e){
				alert('Impossible de créer ou mettre à jour l\'équipe');
			}
		});
	},



	/** Delete the selected officer
	*/
	deleteOfficer: function(e){
		e.preventDefault();
    	
		var self = this;
		this.model.delete({
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.officers.remove(self.model);

					$('#modalDeleteOfficer').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.officerDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer l'agent");
			}

		});
	},



	preventDefault: function(event){
    	event.preventDefault();
	 },

});