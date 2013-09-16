Meteor.methods({
   'getVille' : function(cp){
        var res = Communes.findOne({cp:cp}, {fields:{ville:1}});
        if(res)
            ville = res.ville;
        else 
            ville = "";
    return ville;
   },
   'getCP' : function(ville){
        var res = Communes.findOne({ville:ville}, {fields:{cp:1}});
        if(res)
            cp = res.cp;
        else 
            cp = "";
    return cp;
   }
});