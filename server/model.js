
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

    Meteor.methods({
        sendConfirmationMail: function (evtId) {
            if(_.isUndefined(evtId))
            {
             console.log("pas d'id événement !");
             return null;   
            }
            else 
                console.log("recherche de l'evt #"+evtId);
                
            var evt = Evenements.findOne(evtId);
            Email.send({
              to: evt.admin,
              from: "webmaster@agendapp.cnccb.net",
              subject: "Votre événement vous attend sur Agend'app",
              text: "Veuillez cliquer ici pour confirmer votre email : http://blabla.com"
            });
            console.log("mail envoyé");
        }
    });


    
}
