
/**
 * fil d'ariane / navigation
 */
Template.ariane.links = function() {
    var currentView = Session.get('currentView');
    var currentTitle = Session.get('titreEncours');
    //console.log('current title : ',currentTitle);
        
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
    else if (currentView === 'thanks')
    {
        breadcrumb.push(
        {
            id: 'detaillink',
            label: currentTitle,
            href: '/event/' + Session.get('evtEnCours')
        });
        breadcrumb.push(
        {
            id: 'merci',
            label: 'merci',
            last: true
        });
    }
    //renvoyer le lien
    else if (currentView === 'renvoyerMailAdmin')
    {
        breadcrumb.push(
        {
            id: 'detaillink',
            label: currentTitle,
            href: '/event/' + Session.get('evtEnCours')
        });
        breadcrumb.push(
                {
                    id: 'recevoir',
                    label: 'recevoir le lien',
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
        page(evt);
    },
    'click #accueil': function(e) {
        e.preventDefault();        
        page('/');
    }

});
