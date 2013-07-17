
if (Meteor.isServer) {
    Meteor.startup(function () {
      //Evenements.update({codeConfirm:{$ne:"ok"}},{$set: {codeConfirmMail: "ok"}});
     // process.env.MAIL_URL = 'smtp://smtp2.phpnet.org:25'; //serveur pour l'envoi du mail de confirmation
      var SERVER_URL ="http://localhost:3000"; //adresse du serveur
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
            baseUrl = SERVER_URL+"/";
            var urlConfirm = ""+baseUrl+"#"+codeConfirm+'#'+evtId;
            var message = "Bonjour, \n\n Vous avez ajouté l'événement "
              +"'"+evt.nom+"' sur l'application Agend'app. Nous avons besoin de confirmer votre e-mail pour poursuivre :\n\n"
              +"Veuillez cliquer sur le lien ci-dessous pour confirmer votre email : \n"
              +urlConfirm+"\n"
              +"Merci d'avoir utilisé Agend'app ! (ne répondez pas à ce message, il a été envoyé automatiquement. Pour tout contact, merci d'envoyer un mail à webmaster@cnccb.net"
              +"\n\n L'équipe Agend'App - CNCCB";

            //envoi de l'email
            Email.send({
              to: evt.admin,
              from: "webmaster@cnccb.net",
              subject: "[Agend'app] Merci de confirmer votre email pour l'événement "+evt.nom+"",
              text: message
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
            //envoi email d'administration
            baseUrl = SERVER_URL+"/";
            var urlAdmin = ""+baseUrl+"#"+evtId;
            var message = "Bonjour, \n\n Votre email a été confirmé pour l'événement "
              +"'"+evt.nom+"' sur l'application Agend'app. Nous avons besoin de confirmer votre e-mail pour poursuivre :\n\n"
              +"Veuillez trouver ci-dessous le lien pour administrer l'évenement : \n"
              +urlConfirm+"\n"
              +"Merci d'avoir utilisé Agend'app ! (ne répondez pas à ce message, il a été envoyé automatiquement. Pour tout contact, merci d'envoyer un mail à webmaster@cnccb.net"
              +"\n\n L'équipe Agend'App - CNCCB";

            //envoi de l'email
            Email.send({
              to: evt.admin,
              from: "webmaster@cnccb.net",
              subject: "[Agend'app] Votre lien d'administration pour l'événement "+evt.nom+"",
              text: message
            });

            //update evt
            Evenements.update(evtId, {$set: {codeConfirmMail: "ok", permalink: urlAdmin}});

            return true;
           }
           else return false;
        }
    });


    
}
