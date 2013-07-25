
if (Meteor.isServer) {
    Meteor.startup(function() {
        process.env.MAIL_URL = 'smtp://live.cnccb%40gmail.com:cyrano2013@smtp.gmail.com:465/'; //serveur pour l'envoi du mail de confirmation
        SERVER_URL = Meteor.absoluteUrl(); //adresse du serveur
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
        return Evenements.find({}, {fields: {codeedition: 0, admin: 0}});
    });

    Meteor.methods({
        fetchOneEvt: function(idEvt)
        {
            return Evenements.findOne({_id: idEvt}, {fields: {_id: 1}});
        },
        addNewEvent: function(parameters)
        {
            var secretcode = Random.hexString(12);
            //@todo: supprimer pour la mise en prod.
            secretcode = "123";
            // admin calculus
            var newEvent =
                    {
                        codeedition: secretcode, // Pour le lien d'admin
                        valide: false,
                        admin: parameters.admin, //Mail pour l'administration
                        nom: parameters.nom, //nom de l'évènement
                        datedeb: parameters.datedeb, // Date 
                        datefin: parameters.datefin, // Date 
                        forclusion: parameters.forclusion, //Date de forclusion
                        horaires: parameters.horaires, //horaires (avec alternatives si pas bordé)
                        echelle: parameters.echelle, //Echelle (nationale, régionale, ...)
                        cible: parameters.cible, //Public attendu (->cible)
                        prix: parameters.prix, //Prix d'inscription
                        orga: parameters.orga, //Nom de l'organisateur, 
                        statut: parameters.statut, //Statut           
                        contact: parameters.contact, //Contact (pour information)            
                        tel: parameters.tel, //tel orga
                        lieu: parameters.lieu, //Lieu / adresse
                        codepostal: parameters.codepostal, //Lieu / adresse
                        plan: parameters.plan, // Plan d’accès
                        url: parameters.url,
                        programme: parameters.programme, // Programme
                        options: parameters.options, //Options (buvette, offre de repas, etc.)
                        conditions: parameters.conditions, //Conditions de participation
                        hebergement: parameters.hebergement, //Recommandations d’hébergement
                        restauration: parameters.restauration, //Recommandations restauration
                        visites: parameters.visites //Recommandations visites
                    };

            // si edition
            if (parameters.dejaexistant)
            {
                //@todo: protéger contre le changement d'email (ou revalidation)
                newEvent.valide = true,
                        Evenements.update(parameters.dejaexistant, newEvent);
                return 'Evenement mis à jour';
            }

            var evtId = Evenements.insert(newEvent);
            console.log("création de l'evenement : " + evtId);
            // Envoi du mail avec code d'edition

            var evt = Evenements.findOne(evtId);
            var urlConfirm = "" + SERVER_URL + "#" + evt.codeedition + '#' + evt._id;
            var message = "Bonjour, \n\n Vous avez ajouté l'événement "
                    + "'" + evt.nom + "' sur l'application Agend'app. Voici le lien qui vous permettra de le modifier par la suite :\n"
                    + urlConfirm + "\n\n"
                    + "NB:Il est nécessaire de cliquer au moins une fois pour valider l'événement."
                    + "Merci d'avoir utilisé Agend'app ! (ne répondez pas à ce message, il a été envoyé automatiquement. Pour tout contact, merci d'envoyer un mail à webmaster@cnccb.net"
                    + "\n\n L'équipe Agend'App - CNCCB";

            //envoi de l'email
            try {
                Email.send({
                    to: evt.admin,
                    from: "webmaster@cnccb.net",
                    subject: "[Agend'app] Administration de : " + evt.nom + "",
                    text: message
                });
                console.log("mail envoyé");
            } catch (e)
            {
                console.log("impossible d'envoyer le mail"+e.message);
                throw new Meteor.Error(500, "impossible d'envoyer le mail");
            }
            return 'Evenement créé et mail envoyé.';
        },
        verifCodeConfirm: function(evtId, codeConfirm)
        {
            var evt = Evenements.findOne(evtId);
            console.log("Vérification du code de confirmation" + codeConfirm);
            console.log("evt vérifié : ");
            console.log(evt);
            if (evt.codeedition !== codeConfirm)
                throw new Error('Code edition incorrect');
            else if (evt.valide === false)
            {
                //update evt
                Evenements.update(evtId, {$set: {valide: true}});
                return true;
            }
            else
                return false;
        }
    });



}
