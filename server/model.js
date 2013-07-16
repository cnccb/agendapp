
if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
      });
//todo finir quand on enlevera l'autopublish
    // Meteor.publish("evt-all", function () {
    // return Evenements.find(); // tous les evenements
    // });
    // Meteor.publish("evt-details", function(idEvt){
    // return Evenements.find({permalink:idEvt}); //un evt en particulier, par son permalink
    // });
    Meteor.publish("getDetailEvt", function()
    {
        return Evenements.find({},{fields: {admin: 0}});
    });
    
}
