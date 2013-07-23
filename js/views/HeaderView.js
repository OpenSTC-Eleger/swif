/******************************************
* Header View
*/
app.Views.HeaderView = Backbone.View.extend({

	el: '#header-navbar',

	templateHTML: 'header',



	/** View Initialization
	*/
	initialize: function () {
		this.render();
	},

	

	/** Display the view
	*/
	render: function (activeMenu) {
		var self = this;

		// If the user is connect, retrieve his menu from OpenERP //
		if(app.models.user.hasAuthToken()) {
			
			app.models.user.getMenus({
				error: function (){
					console.error('ERROR: Unable to retrieve menu');
				},
				success: function (data) {
					self.initHeader(data.result.data.children, activeMenu);
				 
				}
			});
		}
		else{
			this.initHeader('', '');
		}

		return this;
	},



	/** Retrieve the Header template
	*/
	initHeader: function(menus, activeMenu){
		var self = this;
		
		$.get("templates/" + this.templateHTML + ".html", function(templateData) {

			var template = _.template(templateData, {
				lang: app.lang,
				menus: menus,
				user: {fullname: app.models.user.getFullname(), fields: app.models.user.toJSON()}
			});

			$(self.el).html(template);

			self.selectMenuItem(activeMenu);
		});
	},



	/** Change the active menu item
	*/
	selectMenuItem: function (menuItem) {
		$('#nav-menu-app li').removeClass('active');
		
		if (menuItem) {
			$('#' + menuItem).addClass('active');
		}        
	},
	

	/** Change the Grid view of the page
	*/
	switchGridMode: function(type){
		
		switch(type){

			case 'fluid' :
				$('#container').removeClass('container').addClass('container-fluid');
				$('#rowContainer').removeClass('row').addClass('row-fluid');
			break;

			case 'default' :
				$('#rowContainer').removeClass('row-fluid').addClass('row');
				$('#container').removeClass('container-fluid').addClass('container');
			break;
		}
	}

});
