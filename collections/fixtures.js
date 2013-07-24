testEvt = [
    {
        valide: true,
        codeedition: "123",
        admin: 'philippe@canniste.org', //Mail pour l'administration
        nom: 'Internationaux de France 2015', //nom de l'évènement
        datedeb: '2015-05-16', // Date 
        datefin: '2015-05-16', // Date 
        forclusion: '2015-04-01', //Date de forclusion
        horaires: 'Samedi 10h00-19h00, Dimanche 10h00-17h00', //horaires (avec alternatives si pas bordé)
        echelle: 'international', //Echelle (nationale, régionale, ...)
        cible: ['competiteurs', 'confirmes'], //Public attendu (->cible)
        prix: '30€', //Prix d'inscription
        orga: 'Julien Falconnet', //Nom de l'organisateur, 
        statut: 'provisoire', //Statut           
        contact: 'webmaster@darkhan.net', //Contact (pour information)            
        lieu: 'Gymnase de Reuilly, 75012 Paris', //Lieu / adresse
        codepostal: '75012', //cp / adresse 
        plan: 'http://goo.gl/maps/U6l2H', // Plan d’accès
        url: 'http://www.internationaux2015.com',
        programme: 'Ca va poutrer', // Programme
        options: 'buvette, repas sur place, jeux de sociétés', //Options (buvette, offre de repas, etc.)
        conditions: 'Niveau pommeau rouge, étrangers bienvenus.', //Conditions de participation
        hebergement: 'non', //Recommandations d’hébergement
        restauration: 'non', //Recommandations restauration
        visites: 'Paris' //Recommandations visites
    },
    {
        valide: true,
        codeedition: "123",
        admin: 'philippe@canniste.org', //Mail pour l'administration
        nom: 'Championnat de France 2013', //nom de l'évènement
        datedeb: '2013-03-16', // Date 
        datefin: '2013-03-17', // Date 
        forclusion: '2013-02-01', //Date de forclusion
        horaires: 'Samedi 10h00-19h00, Dimanche 10h00-17h00', //horaires (avec alternatives si pas bordé)
        echelle: 'national', //Echelle (nationale, régionale, ...)
        cible: ['competiteurs', 'confirmes'], //Public attendu (->cible)
        prix: '20€', //Prix d'inscription
        orga: 'P. Brasey', //Nom de l'organisateur, 
        statut: 'definitif', //Statut           
        contact: 'webmaster@darkhan.net', //Contact (pour information)            
        lieu: 'Ambérieu en bugey', //Lieu / adresse
        codepostal: '01001', //cp / adresse 
        plan: 'http://goo.gl/maps/U6l2H', // Plan d’accès
        url: '',
        programme: 'Phase finale des championnats de France.', // Programme
        options: 'buvette, repas sur place', //Options (buvette, offre de repas, etc.)
        conditions: 'Avoir été qualifié lors des phases qualificatives en région', //Conditions de participation
        hebergement: 'Charmantes demeures', //Recommandations d’hébergement
        restauration: 'Offerte sur place', //Recommandations restauration
        visites: '' //Recommandations visites
    },
    {
        valide: true,
        codeedition: "123",
        admin: 'philippe@canniste.org', //Mail pour l'administration
        nom: 'Internationaux de France 2013', //nom de l'évènement
        datedeb: '2013-05-18', // Date 
        datefin: '2013-05-19', // Date 
        forclusion: '2013-05-01', //Date de forclusion
        horaires: 'Samedi 10h00-19h00, Dimanche 10h00-17h00', //horaires (avec alternatives si pas bordé)
        echelle: 'international', //Echelle (nationale, régionale, ...)
        cible: ['competiteurs', 'confirmes'], //Public attendu (->cible)
        prix: '30€', //Prix d'inscription
        orga: 'V Chaigneau', //Nom de l'organisateur, 
        statut: 'provisoire', //Statut           
        contact: 'webmaster@darkhan.net', //Contact (pour information)            
        lieu: 'Saint Martin Le Beau', //Lieu / adresse
        codepostal: '37270', //cp / adresse 
        plan: 'http://goo.gl/maps/U6l2H', // Plan d’accès
        url: 'http://www.internationaux2013.com',
        programme: 'Lorem ipsum dolem', // Programme
        options: 'buvette, repas sur place', //Options (buvette, offre de repas, etc.)
        conditions: 'Pommeau rouge', //Conditions de participation
        hebergement: 'non', //Recommandations d’hébergement
        restauration: 'Plateaux à commander', //Recommandations restauration
        visites: 'Le musé du compagnonage de Tour.' //Recommandations visites
    },
    {
        valide: true,
        codeedition: "123",
        admin: 'philippe@canniste.org', //Mail pour l'administration
        nom: 'Internationaux de France 2013', //nom de l'évènement
        datedeb: '2014-05-15', // Date 
        datefin: '2014-05-16', // Date 
        forclusion: '2013-11-10', //Date de forclusion
        horaires: 'Samedi 10h00-19h00, Dimanche 10h00-17h00', //horaires (avec alternatives si pas bordé)
        echelle: 'national', //Echelle (nationale, régionale, ...)
        cible: ['competiteurs', 'confirmes'], //Public attendu (->cible)
        prix: '30€', //Prix d'inscription
        orga: 'Julien Falconnet', //Nom de l'organisateur, 
        statut: 'annule', //Statut           
        contact: 'webmaster@darkhan.net', //Contact (pour information)            
        lieu: 'Gymnase de Reully, 75012 Paris', //Lieu / adresse
        codepostal: '75012', //cp / adresse 
        plan: 'http://goo.gl/maps/U6l2H', // Plan d’accès
        url: 'http://www.internationaux2015.com',
        programme: 'bla bla bla bla bla bla bla', // Programme
        options: 'buvette, repas sur place', //Options (buvette, offre de repas, etc.)
        conditions: 'majeur et vacciné', //Conditions de participation
        hebergement: 'non', //Recommandations d’hébergement
        restauration: 'non', //Recommandations restauration
        visites: 'bof' //Recommandations visites
    },
    {
        valide: false,
        codeedition: "123",
        admin: 'philippe@canniste.org', //Mail pour l'administration
        nom: 'Titis parisiens 2014', //nom de l'évènement
        datedeb: '2014-01-18', // Date 
        datefin: '2014-01-19', // Date 
        forclusion: '2014-01-01', //Date de forclusion
        horaires: 'Samedi 9h00-17h00, Dimanche 10h00-17h00', //horaires (avec alternatives si pas bordé)
        echelle: 'regional', //Echelle (nationale, régionale, ...)
        cible: ['competiteurs', 'debutants'], //Public attendu (->cible)
        prix: '25€', //Prix d'inscription
        orga: 'Julien Falconnet', //Nom de l'organisateur, 
        statut: 'provisoire', //Statut           
        contact: 'webmaster@darkhan.net', //Contact (pour information)            
        lieu: 'Gymnase Jules Noel, 3 avenue Maurice d\'Ocagne.', //Lieu / adresse
        codepostal: '75014', //cp / adresse 
        plan: 'http://goo.gl/maps/U6l2H', // Plan d’accès
        url: 'http://www.cnccb.net',
        programme: 'La grande rencontre inter-galactique des cannistes', // Programme
        options: 'buvette, repas sur place', //Options (buvette, offre de repas, etc.)
        conditions: 'Niveau pommeau rouge ', //Conditions de participation
        hebergement: 'A venir', //Recommandations d’hébergement
        restauration: '', //Recommandations restauration
        visites: 'Les caves alliées' //Recommandations visites
    },
]