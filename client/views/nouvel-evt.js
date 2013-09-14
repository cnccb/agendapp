
/**
 * NOUVELEVT
 */

Template.nouvelEvt.rendered = function() {
    
    //infobulles d'aide
    $('button.bspopover').popover({trigger: "hover", container: 'body'}); //initialize all popover in this template
    //etat des boutons radio
    $('[data-toggle="buttons-radio"]').each(function() {
        var valBouton = $(this).attr("data-value");
        var $button = $('[data-value="' + valBouton + '"]');
        //console.log($(this));
        $button.button('toggle');
        $button.trigger('click');
    });
    $('[data-type="checkbox"]').each(function() {
        var valChecked = $(this).attr("data-value").split(',');
        //console.log(valChecked);
        _.each(valChecked, function(item, key, list) {
            $('[value="' + item + '"]').attr('checked', true);
        })

    });


    //définition des validateur des champs dates
    $('#frmNouvelEvt input[type="date"]').attr('pattern',
            '((0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)[0-9]{2})|'
            +'((19|20)[0-9]{2}[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01]))'
            );
    $('#frmNouvelEvt input[type="date"]').attr('min', getStringFromDate(new Date()));
    var end = new Date();
    end.setFullYear(end.getFullYear() + 3);
    $('#frmNouvelEvt input[type="date"]').attr('max', getStringFromDate(end));

    //creation des datepicker pour tous les éléments dates s'il ne sont pas reconnus par le navigateur
    var dateToFrString="";
    $('#frmNouvelEvt input[type="date"]').each(function(){
        if(document.getElementById($(this).attr('id')).type=='text')
        { 
            //console.log("vérif date pour "+$(this).attr('id'));
            // //changement de la valeur du champs en une chaîne au format dd/mm/yyyy
            if($(this).val())
            {
                dateToFrString=getStringFromDate(getDateFromInput($(this).val()),false);
                $(this).val(dateToFrString);
                $(this).attr('value',dateToFrString);
                //console.log("nouvelle valeur : " + $(this).val());
            }         
            //le datepicker est ensuite créé à la volée lors du click sur le champs date, 
            //et initialisé avec la valeur de l'input ou la date du jour par défaut  
            // cf 'click [type=date]' dans les events de nouvelEvt 
        }
    });
};
Template.nouvelEvt.evenement = function() {
    //pour eviter d'afficher un evenement vide
    if (Session.get('evtEnCours') === undefined)
    {
        Session.set('titreEncours', '');
        return null;
    }

    var res = Evenements.findOne(Session.get('evtEnCours'));
    res = _.omit(res, ['codeedition']);
    Session.set('titreEncours', res.nom);
    res.datedeb = getStringFromDate(getDateFromInput(res.datedeb), true);
    res.datefin = getStringFromDate(getDateFromInput(res.datefin), true);
    res.forclusion = getStringFromDate(getDateFromInput(res.forclusion), true);

    return res;
};

Template.nouvelEvt.events({
    'click #cancel': function(e) {
        e.preventDefault();
        displayView('listeEvt');
    },
    //@todo: trouver plus élegant pour le masquage sélectif des champs optionnels
    'click #ouvrirreco': function(e) {
        $('#evtReco .evtParOption').toggle();
        $('#ouvrirreco i').toggleClass('icon-chevron-right  icon-chevron-down');
        $('html, body').animate({scrollTop: $("#ouvrirreco").offset().top}, 'slow');
        return false;
    },
    'click #ouvrircomplement': function(e) {
        $('#evtCompInfo .evtParOption').toggle();
        $('#ouvrircomplement i').toggleClass('icon-chevron-right  icon-chevron-down');
        $('html, body').animate({scrollTop: $("#ouvrircomplement").offset().top}, 'slow');
        return false;
    },
    //@todo: faire en sorte que ce soit correctement valué/initialisé/repopulé
    'click [data-toggle="buttons-radio"] button': function(e) {
        $button = $(e.currentTarget);
        $buttonGroup = $(e.currentTarget).parent();
        //console.log($buttonGroup);
        $buttonGroup.attr("data-value", $button.attr("data-value"));
        //console.log($buttonGroup.attr('data-value'));
    },
    'mousedown [type=date]' : function(e){
       //création d'un datepicker à la volée si le champs date n'est pas reconnu par le navigateur (voir le rendered du template)
       //le principe du test est que si le browser ne reconnait pas le type date, il mettra le type par defaut, ie "text".
       //donc on applique le datepicker aux champs date reconnu comme du text, en donnant le bon format 
       //la bibli utilisée est http://eternicode.github.io/bootstrap-datepicker/ patchée pour firefox(cf bug #552)
        
       var $input = $(e.currentTarget);
        if(document.getElementById($input.attr('id')).type=='text'){
            $input.datepicker({
            language: 'fr',
            format: 'dd/mm/yyyy',
            autoclose: true, //ferme la fenêtre sur clic
            startDate: getStringFromDate(getDateFromInput($input.attr('min')), false), 
            endDate: getStringFromDate(getDateFromInput($input.attr('max')), false)
        });
        }
        
    },
    'click #submitevt': function(e) {
        // vérifie la validité du formulaire en se reposant sur le navigateur
        // Tout sur la validation browser et HTML5: http://www.html5rocks.com/en/tutorials/forms/constraintvalidation/#toc-declarative-error-messages
        e.preventDefault();
        // NB checkValidity will fire "invalid" events
        if (!(e.target.form.checkValidity()))
        {
            $('html,body').animate({scrollTop: $('input:invalid').first().offset().top}, 'slow');
            console.log($('input:invalid').first());
            console.log("form invalid : exiting");
            return false;
        }


        // Filtre des valeurs du formulaire
        var newEvent =
                {
                    admin: $("#admin").val(), //Mail pour l'administration
                    nom: $("#nom").val(), //nom de l'évènement
                    datedeb: getStringFromDate(getDateFromInput($("#datedeb").val())), // Date 
                    datefin: getStringFromDate(getDateFromInput($("#datefin").val())), // Date 
                    forclusion: getStringFromDate(getDateFromInput($("#forclusion").val())), //Date de forclusion
                    horaires: $("#horaires").val(), //horaires (avec alternatives si pas bordé)
                    echelle: $("#echelle").attr('data-value'), //Echelle (nationale, régionale, ...)
                    cible: checkBoxesValues('cible'), //Public attendu (->cible)
                    prix: $("#prix").val(), //Prix d'inscription
                    orga: $("#orga").val(), //Nom de l'organisateur, 
                    statut: $("#statut").attr('data-value'), //Statut           
                    contact: $("#contact").val(), //Contact (pour information)            
                    tel: $("#tel").val(), //tel orga
                    lieu: $("#lieu").val(), //Lieu / adresse
                    codepostal: $("#codepostal").val(), //Lieu / adresse
                    plan: $("#plan").val(), // Plan d’accès
                    url: $("#url").val(),
                    programme: $("#programme").val(), // Programme
                    options: $("#options").val(), //Options (buvette, offre de repas, etc.)
                    conditions: $("#conditions").val(), //Conditions de participation
                    hebergement: $("#hebergement").val(), //Recommandations d’hébergement
                    restauration: $("#restauration").val(), //Recommandations restauration
                    visites: $("#visites").val() //Recommandations visites
                };
        //quelques défauts
        if (!newEvent.statut)
            newEvent.statut = 'temporaire';

        // pour l'update
        if ($("#dejaexistant").val() != 'null')
        {
            console.log($("#dejaexistant").val())
            newEvent.dejaexistant = $("#dejaexistant").val();
        }

        // envoi des informations au serveur pour creation 
        console.log("Nouvel evènement: envoi des données au serveur");
        console.log(newEvent);
        Meteor.call('addNewEvent', newEvent, function(error, result) {
            if (error !== undefined)
            {
                flash("Probleme: " + error, 'error');
            } else
            {
                flash(result, 'info');
                $('html,body').animate({scrollTop: $('#flashMessage').offset().top}, 'slow');

                //console.log(newEvent);
            }
        });
        console.log("Evènement créé/modifié");

        // Retour à l'interface du calendrier
        displayView('listeEvt');
        // message de validation??        
        //return false;
    },
    'invalid input': function(e)
    {
        var $input = $(e.currentTarget);
        if ($input.siblings('.errorbox').length === 0)
        {
            $input.after('<div class="errorbox alert alert-block alert-error"><button type="button" class="close" data-dismiss="alert">×</button><p></p></div>');
        }
        $input.siblings('.errorbox').children('p').text(e.currentTarget.validationMessage);
        $input.siblings('.errorbox').fadeIn(500);
    },
    'blur input': function(e)
    {
        $(e.currentTarget).addClass("interacted");
        if ($(e.currentTarget).siblings('.errorbox').length > 0)
        {
            $(e.currentTarget).siblings('.errorbox').fadeOut(500);
        }
    }

});