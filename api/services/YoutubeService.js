/**
 * YoutubeService.js
 *
 * @description :: Servicio para consumir videos usando el API de Youtube.
 * @docs        :: TODO
 * @REF         :: https://developers.google.com/youtube/v3/
 */

var Youtube = require('youtube-api'),
    later   = require('later');

var aut = Youtube.authenticate({
    type: 'key'
  , key: process.env.YOUTUBE_API_SERVER_KEY
});

 console.log( aut + " AUT" );

var openSearches = {}

module.exports.requestSearch = function( id, search, tablero ){
    //already an open listener
    if( openSearches[id] ){

        console.log("info: ".yellow + "Youtube Subscription: " + id + " is already active.")
        return openSearches[id];   

    }else{

        console.log("info: ".green + "Youtube recentFromTag: " + id + " Requested For Search: '" + search + "' in tablero: " + tablero );

        var sched       = later.parse.text('every 1 minute'),
            timer       = later.setInterval(
                                                function(){ 
                                                    JobsKue.create( 'youtubeSearch', { 
                                                        title: 'youtubeSearch: ' + search,
                                                        id: id, 
                                                        search: search, 
                                                        tablero: tablero 
                                                    }, 0, 3000 ) 
                                                }, sched 
                                            );

        /* Add Search to openSearches */ 
        openSearches[id] = timer;   

    }
}

module.exports.stopSearch = function( id ){

    if( openSearches[id] ){
        console.log("info: ".yellow + "Disconnecting from youtube search: " + id );
        openSearches[id].clear();
        delete openSearches[id];
    }else{
        console.log("info: ".green + "Youtube search: " + id + " is already disconnected.");
    }

}

module.exports.doSearch = function( job, done ){

    console.log("info: ".green + "Youtube search: " + job.data.id + " bucando y guardando...");

    var min_tag_id = ''; 
    Publicacion.find().where({ defuente: job.data.id }).sort({ createdAt: 'desc' }).limit(1).exec( function( err, publicacion ){
        if (err) {

            return console.log(err);

        }else{

            if( typeof publicacion[0] != 'undefined' ){                 
                console.log("info: ".green + "Video mas nuevo es de: ", publicacion[0].data.snippet.publishedAt );
                min_tag_id = publicacion[0].data.snippet.publishedAt;
            }else{
                min_tag_id = "1970-01-01T00:00:00Z";
                console.log("info: ".green + "No hay videos anteriores");
            }

            Youtube.search.list({
                "part": "snippet"
              , "maxResults": 50
              , "order": "date"
              , "q": job.data.search
              , "type": "video"
              , "videoEmbeddable": "true"
              , "publishedAfter": min_tag_id

            }, function (err, data) {
                if (err) {

                    return console.log(err);
                    done();

                }else {

                    console.log("info: ".green + data.items.length + " videos found.");

                    if( data.length === 0 ){

                            setTimeout ( function() {
                                console.log("info: ".green + "Gave youtube servers a 30 second break.");
                                done();
                            }, 30000 );

                    }else{

                        for (var i = data.items.length - 1; i >= 0; i--) {

                            var options = [ 'no-color-block', 'no-color-block', 'color-block' ];
                            var color = Math.floor((Math.random()*7));
                            var value = Math.floor((Math.random()*3));

                            Publicacion.create({
                                entablero: job.data.tablero,
                                origin_id: job.data.tablero + "_" + data.items[i].id.videoId,
                                defuente: job.data.id,
                                color_class: options[ value ] + ' color-' + color,
                                red: 'youtube',
                                tipo: 'video' ,
                                data: data.items[i]
                            }).exec(function(err, publicacion) {
                                if (err) {
                                    return console.log(err);

                                }else {
                                    console.log("info: ".green + "Video saved:", publicacion.origin_id + " from fuente: " + job.data.id );

                                    Publicacion.publishCreate({
                                      id: job.data.tablero,
                                      data: publicacion
                                    });
                                }
                            });

                            if( i === 0) {
                                console.log("info: ".green + "Saving videos done");
                                console.log("info: ".green + "Giving youtube servers a 2 second break.");
                                setTimeout ( function() {
                                    console.log("info: ".green + "Gave youtube servers a 2 second break.");
                                    done();
                                }, 2000 );
                            }
                        }
                    }
                }
            });
        }
    });
}