if (Meteor.isClient) {
  Template.listeEvt.evenements = function () {
    return Evenements.find();
  };

  Template.listeEvt.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

