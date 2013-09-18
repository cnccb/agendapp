
/**
 * fil d'ariane / navigation
 */
Template.ariane.links = function() {
    var currentView = Session.get('currentView');
    var currentTitle = Session.get('titreEncours');
        
    var breadcrumb = new Array();

    // Toujours l'accueil
    breadcrumb.push(
            {
                id: 'accueil',
                label: 'accueil',
                href: '/'
            }
    );
    // Accueil
    if (currentView === 'listeEvt')
    {
        // rien de plus
    }
    // Détails
    else if (currentView === 'detailEvt')
    {
        breadcrumb.push(
                {
                    id: 'detail',
                    label: currentTitle,
                    last: true
                });
    }
    // Creation
    else if (currentView === 'nouvelEvt' && Session.get('evtEnCours') === undefined)
    {
        breadcrumb.push(
                {
                    id: 'creation',
                    label: 'création d\'un nouvel événement',
                    last: true
                });
        resetForm('frmNouvelEvt'); //pour éviter que les champs restent remplis après un première création

    }
    // Modification
    else if (currentView === 'nouvelEvt')
    {

        //@fixme : il existe un état (lorsque on arrive sur le lien d'admin de l'evt) où l'id evt existe en session mais pas son titre, 
        // du coup le lien est créé avec un label vide. Ci-dessous une parade, moche...
        if(Session.get('evtEnCours') !== undefined && currentTitle === undefined )
        {
            //console.log('titre non defini pour #',Session.get('evtEnCours'));
            currentTitle = Evenements.find(Session.get('evtEnCours'), {fields:{nom :1}}).fetch().nom;
        }

        breadcrumb.push(
                {
                    id: 'detaillink',
                    label: currentTitle,
                    href: '/event/' + Session.get('evtEnCours')
                });
        breadcrumb.push(
                {
                    id: 'modification',
                    label: 'modification',
                    last: true
                });
    }
    return breadcrumb;
};

Template.ariane.events({
    'click #detaillink a': function(e) {
        e.preventDefault();
        var evt = $(e.currentTarget).attr('href')
        //console.log(evt);
        page('/event/'+evt);
    },
    'click #accueil': function(e) {
        e.preventDefault();        
        page('/');
    }

});
