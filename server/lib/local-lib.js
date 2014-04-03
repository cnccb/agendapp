envoiMailAdmin = function(evt){
    // Envoi du mail avec code d'edition
    if(SERVER_URL && evt._id && evt.codeedition){
        var urlConfirm = "" + SERVER_URL + 'event/' + evt._id  + '/edit/' + evt.codeedition  ;
    }else{
        throw new Meteor.Error(500, "impossible d'envoyer le mail - manque de donnéees");
    }
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
        //console.log("mail envoyé");
    } catch (e)
    {
        //console.log("impossible d'envoyer le mail"+e.message);
        throw new Meteor.Error(500, "impossible d'envoyer le mail");
    }
    return {message : 'Evenement créé et mail envoyé.', type : 'new', idEvt : evt._id, code: evt.codeedition};
};


/**
twitte l'evt sur le compte twitter @cnncb
*/
evtTwit = function(idEvt, evt){
        var T = new TwitMaker({
           consumer_key:         config.twit.consumer_key,
           consumer_secret:      config.twit.consumer_secret,
           access_token:         config.twit.access_token,
           access_token_secret:  config.twit.access_token_secret
        });
        var newStatus = '#agenda '+evt.nom+' : '+ SERVER_URL + 'event/' + idEvt;
        console.log('try to twit !', newStatus);
        if(config.env==="prod") 
        {
            T.post('statuses/update', { status: newStatus }, function(err, reply) {
                if(err)
                {
                    console.log('errr',err);                                
                }
                else if(reply){
                    console.log('twit ok.');
                }
            });
        }
        
   }