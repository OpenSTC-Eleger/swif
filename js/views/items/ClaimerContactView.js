app.Views.ClaimerContactView = Backbone.View.extend({

	tagName     : 'tr',
	className   : 'row-nested-objects',
	templateHTML: 'items/claimerContact',

	id: function () {
		return 'address_' + this.model.id
	},

	initialize: function () {

		this.fetchOfficers()

	},

	render: function () {
		var self = this;
		this.listenTo(this.officers,'fetchDone', function () {this.applyTemplate();})
		return this;
	},

	applyTemplate: function () {
		var self = this;
		this.serialize()
		$.get("templates/" + self.templateHTML + ".html", function (templateData) {
			var template = _.template(templateData, {
				lang   : app.lang,
				address: self.model.toJSON()
			});
			$(self.el).html(template);
		});
	},

	fetchOfficers: function () {
		var self = this;
		if (! _.isUndefined(self.options.user_ids)) {
			self.officers = new app.Collections.Officers()
			self.officers.fetch({
				data: {filters: {0:{field:'id',operator:'in',value: self.options.user_ids}}}
			}).done( function () {
					self.officers.trigger('fetchDone')
				})
		}
	},

	serialize: function () {
		console.log(this.model)
		if (this.model.get('user_id') != false) {
			this.model.set('user_login', this.officers.get(this.model.get('user_id')[0]).get('login'));
		}
	}

});