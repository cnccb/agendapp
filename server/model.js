
if (Meteor.isServer) {
    Meteor.startup(function() {
        SERVER_URL = Meteor.absoluteUrl(); //adresse du serveur
        //if(SERVER_URL!="http://localhost:3000/") 
        process.env.MAIL_URL = 'smtp://live.cnccb%40gmail.com:cyrano2013@smtp.gmail.com:465/'; //serveur pour l'envoi du mail de confirmation
        console.log("app listening on ", SERVER_URL, " -- let's rock.");

    });

    Meteor.methods({
        fetchOneEvt: function(idEvt)
        {
            return Evenements.findOne({_id: idEvt}, {fields: {_id: 1}});
        },
        addNewEvent: function(parameters)
        {
            var idEvt = parameters.idEvt;
            // admin calculus
            var newEvent =
                    {
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
                        ville: parameters.ville, //Lieu / adresse
                        plan: parameters.plan, // Plan d’accès
                        url: parameters.url,
                        programme: parameters.programme, // Programme
                        options: parameters.options, //Options (buvette, offre de repas, etc.)
                        conditions: parameters.conditions, //Conditions de participation
                        hebergement: parameters.hebergement, //Recommandations d’hébergement
                        restauration: parameters.restauration, //Recommandations restauration
                        visites: parameters.visites, //Recommandations visites
                        valide : false,
                    };

            // si edition
            if (idEvt)
            {
                //@todo: protéger contre le changement d'email (ou revalidation)
                evt = Evenements.findOne({_id: idEvt}, {fields: {_id: 1, codeedition : 1, twitted : 1}});
                if (parameters.codeedition === evt.codeedition)
                {

                    newEvent.valide = true;
                    newEvent.codeedition = evt.codeedition;
                    newEvent.twitted = evt.twitted
                    Evenements.update(idEvt, newEvent);
                    //console.log('event ',evt);
                    if(!evt.twitted)
                    {
                        evtTwit(idEvt,newEvent);
                        newEvent.twitted=true;
                    }
                    Evenements.update(idEvt, newEvent);

                    //console.log('parameter dejaexistant = true => update', newEvent);
                    return {message : 'Evenement mis à jour', type : 'maj'};
                }
                else 
                {
                    console.error("Mauvais code d'édition !", parameters);
                    return "Erreur lors de la modification";
                }
            }

            //sinon création
            var secretcode = Random.hexString(12);
            //console.log('addNEwEvent : nouveau code / params :', secretcode, parameters);
            newEvent.codeedition = secretcode;
            newEvent.twitted=false;
            var evtId = Evenements.insert(newEvent);
            var evt = Evenements.findOne(evtId);

            //console.log("création de l'evenement : " + evtId, evt);
                       
            return envoiMailAdmin(evt);
        },
        
        verifCodeConfirm: function(evtId, codeConfirm)
        {
            var evt = Evenements.findOne(evtId);
            //console.log("Vérification du code de confirmation " + codeConfirm);
            //console.log("evt vérifié : ");
            //console.log(evt);
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
        },
        renvoyerEmailAdmin: function(evtId, emailAdmin){
            var evt = Evenements.findOne(evtId);
            //console.log("Vérification du mail d'admin " + emailAdmin);
            //console.log("evt vérifié : ", evt);

            if(evt.admin === emailAdmin){
                return envoiMailAdmin(evt);
            }
            else
            {
              throw new Meteor.Error(500, "Erreur serveur", "Mail incorrect :",evtId, emailAdmin);  
            }

            
        }
    });
}


