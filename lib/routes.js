Router.configure({
  layoutTemplate: 'layout',

  // waitOn: function() {
  //   return [
  //     Meteor.subscribe("rooms"),
  //     Meteor.subscribe("messages")
  //   ];
  // }
});

if (Meteor.isClient) {
  Router.onRun(function() {
    this.next();
  });
}

Router.route('/', function () {
  this.render('welcome');
});

Router.route('/lobby', function () {
  this.render('lobby');
});
