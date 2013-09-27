initApp = function() {
    //mapping des routes (cf views.js)
    page('/event/:evt/edit/:code', evtEdit);
    page('/event/:evt/sendAdminLink',evtSend);
    page('/event/:evt/thanks', evtThanks);
    page('/event/new', evtNew);
    page('/event/:evt', evtShow);
    page('/', index);
    page();
}