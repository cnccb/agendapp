/**** Servers Initialization *********/
var Db, Server, db, mongo, server, mongoClient, Client, _;
mongo = require('mongodb');
icalendar = require('icalendar');
_ = require('underscore');
Server = mongo.Server;
Client = mongo.MongoClient;

Db = mongo.Db;
server = new Server(env.mongodb.host, env.mongodb.port, {w: 1}, {auto_reconnect: true});
mongoClient = new Client(server);

db = mongoClient.db(env.mongodb.dbname);

db.open(function(err, dbConn){
    if(err)
        console.log('error connecting to mongoDb database');
});

/****** db functions *********/
function Storage(){

    /**
     *   Finds all items of <collectionName> filter with <query> and send it as an array of <fields> to <res>
     */
    this.getAll = function(collectionName, query, fields, cb){
        var collection = db.collection(collectionName, function(err, collection){
            if (err)
                throw(new Error(err));

            console.log('collection '+collectionName+' loaded');
            collection.find(query, fields).toArray(function(err, items) {
                if (err)
                   throw(new Error(err));
                console.log(items);
                cb(items);
                //db.close();
            });
        });
    };
}
/***********/

/***** Method Exports  **************/
storage = new Storage();
var generateIcalEvent = function(item){
  datedeb = item.datedeb.split("-");
  datefin = item.datedeb.split("-");
  var event = new icalendar.VEvent(item._id);
  event.setSummary(item.nom);
  event.setDate(new Date(datedeb[0],datedeb[1],datedeb[2]), new Date(datefin[0],datefin[1],datefin[2]));
  event.addProperty("COMMENT", "/event/"+item._id);
  event.addProperty("LOCATION",item.lieu);
  event.addProperty("CATEGORIES", [item.echelle, item.cible]);
  event.addProperty("STATUS", item.statut);
  event.addProperty("CONTACT", item.contact);
  event.addProperty("URL", item.url);
  event.setDescription(item.programme);
  console.log('event : ', event);
  return event;
};

module.exports = {
  getEvents : function(req, res){
    storage.getAll('evenements', {}, {}, function(items){
      res.json(items);
    });
  },
  getIcal : function(req, res){
    //getting all events
    storage.getAll('evenements', {}, {}, function(items){
      ical = new icalendar.iCalendar();
      _.each(items, function (evt){
        ical.addComponent(generateIcalEvent(evt));
      });
      res.send(ical.toString());
    });


  }
};
