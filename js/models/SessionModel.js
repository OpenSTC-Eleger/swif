app.Models.Session = Backbone.Model.extend({
    defaults: {
        auth_token: null,
    },
    initialize: function() {
        return this.load();
    },
    authenticated: function() {
        return Boolean(this.get("auth_token"));
    },
    save: function(auth_token) {

        return localStorage.setItem('auth_token', auth_token);
    },
    load: function() {
        return this.set({
            auth_token: localStorage.getItem('auth_token')
        });
    }
});