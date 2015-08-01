if(typeof PV === 'undefined'){
    PV = {};
}

PV.InitializationModalView = Backbone.View.extend({
    template: 'initialization_modal',
    initialize: function(options) {
        $('body').append(this.el);
    },
    events: {
        'click .save-pivotal-token': 'initializePivotal'
    },
    render: function(){
        this.$el.html(render_template(this.template, {}));
        this.$('.modal').modal('show');
        return this;
    },
    initializePivotal: function(){
        var that = this;
        this.saveKey();
        $.when(this.saveUsers()).done(function(){
            that.$('.modal').modal('hide');
        });
    },
    saveKey: function(){
        var token = this.$('#pivotal_token').val();
        var project_id = this.$('#pivotal_project').val();
        chrome.storage.sync.set({
            'pivotal_token': token,
            'project_id': project_id
        });
        $.ajaxSetup({
          headers: {'X-TrackerToken': token}
        });
    },
    saveUsers: function(){
        var deferred = $.Deferred();
        $.getJSON('https://www.pivotaltracker.com/services/v5/projects/'+this.$('#pivotal_project').val()+'/memberships', function(data){
            var members = _(data).map(function(member){ return member.person; });
            chrome.storage.sync.set({
                'members': members
            });
            deferred.resolve();
        });
        return deferred;
    }
});