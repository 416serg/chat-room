Messages = new Meteor.Collection("messages");
Rooms = new Meteor.Collection("rooms");

if (Meteor.isClient) {
  // client code
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Template.welcome.rendered = function() {
    Tracker.autorun(function(){
      if (Meteor.userId()) {
        Router.go('lobby');
      }
    });
  }

  Template.lobby.rendered = function() {
    Tracker.autorun(function(){
      if (!Meteor.userId()) {
        Router.go('/');
      }
    });
  }
}

if (Meteor.isServer) {
  // server code
}
