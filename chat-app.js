Messages = new Meteor.Collection("messages");
Rooms = new Meteor.Collection("rooms");

if (Meteor.isClient) {
  // client code
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Meteor.subscribe("rooms");
  Meteor.subscribe("messages");

  Template.lobby.events({
    'click #create-room': function(e, t) {
      e.preventDefault();
      var room = t.find("#room-name").value;
      Rooms.insert({roomname: room});
    },
  });

  Template.lobby.helpers({
    rooms: function() {
      return Rooms.find();
    },
    roomname: function() {
      return this.roomname;
    }
  });

  Template.room.helpers({
    roomname: function() {
      return this.roomname;
    },
    messages: function() {
      return Messages.find({room: this.roomname} , {sort: {ts: -1}});
    }
  });

  Template.room.events({
    'click #send-message': function(e, t) {
      e.preventDefault();
      var message = t.find("#msg");
      Messages.insert({user: Meteor.user().username, msg: message.value, ts: new Date(), room: this.roomname});
      message.value = "";
    }
  });

  Template.message.helpers({
    timestamp: function() {
      return this.ts.toLocaleString();
    }
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
  Rooms.allow({
    insert: function (userId, doc) {
      return (userId !== null);
    }
  });
  Rooms.deny({
    insert: function (userId, doc) {
      return (userId === null);
    },
    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },
    remove: function (userId, doc) {
      return true;
    }
  });
  Messages.deny({
    insert: function (userId, doc) {
      return (userId === null);
    },
    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },
    remove: function (userId, doc) {
      return true;
    }
  });
  Messages.allow({
    insert: function (userId, doc) {
      return (userId !== null);
    }
  });

  Meteor.publish("rooms", function () {
    return Rooms.find();
  });
  Meteor.publish("messages", function () {
    return Messages.find({}, {sort: {ts: -1}});
  });
}
