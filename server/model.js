
if (Meteor.isServer) {
    Meteor.startup(function () {
      //Evenements.update({codeConfirm:{$ne:"ok"}},{$set: {codeConfirmMail: "ok"}});
      process.env.MAIL_URL = 'smtp://smtp2.phpnet.org:25'; //serveur pour l'envoi du mail de confirmation
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
            var codeConfirm = Random.hexString(12);
            Email.send({
              to: evt.admin,
              from: "webmaster@cnccb.net",
              subject: "[Agend'app]Merci de confirmer votre email",
              text: "Veuillez cliquer ici pour confirmer votre email : http://localhost:3000/#"+codeConfirm+'#'+evtId
            });
            console.log("mail envoyé");
            
            Evenements.update(evtId, {$set: {codeConfirmMail: codeConfirm}});
            return true;
        },
        verifCodeConfirm: function(evtId, codeConfirm)
        {
           var evt = Evenements.findOne(evtId);
           console.log("Vérification du code de confirmation"+codeConfirm); 
           console.log("evt");
           if(evt.codeConfirmMail===codeConfirm)
           {
            Evenements.update(evtId, {$set: {codeConfirmMail: "ok"}});
            return true;
           }
           else return false;
           
        }
    });


    
}
