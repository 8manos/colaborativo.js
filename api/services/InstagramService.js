/**
 * InstagramService.js
 *
 * @description :: Servicio para consumir fotos usando el API de Instagram.
 * @docs        :: TODO
 */


var Instagram = require( 'instagram-node-lib' ),
    later = require('later');

Instagram.set( 'client_id', process.env.INSTAGRAM_CLIENT_ID );
Instagram.set( 'client_secret', process.env.INSTAGRAM_CLIENT_SECRET );

var openSubscriptions = {}

module.exports.RequestRecentFromTag = function( id, tag, tablero ){

    //already an open listener
    if( openSubscriptions[id] ){

        console.log("info: ".yellow + "Instagram Subscription: " + id + " is already active.")
        return openSubscriptions[id];   

    }else{

        console.log("info: ".green + "Instagram recentFromTag: " + id + " Requested For Tag:", tag + " in tablero: " + tablero );

        var sched       = later.parse.text('every 1 minute'),
            timer       = later.setInterval(
                                                function(){ 
                                                    JobsKue.create( 'instagramRecentFromTag', { 
                                                        title: 'instagramRecentFromTag: ' + tag,
                                                        id: id, 
                                                        tag: tag, 
                                                        tablero: tablero 
                                                    }, 0, 3000 ) 
                                                }, sched 
                                            );

        /* Add Subscription to openSubscriptions */ 
        openSubscriptions[id] = timer;      
    }
}

module.exports.GetRecentFromTag = function( job, done ){

        FuentesService.checkActive( job.data.id, function(){

            console.log("info: ".green + "Saving recent instagram entries with tag: " + job.data.tag + ". From fuente: " + job.data.id );

            var min_tag_id = ''; 
            Publicacion.find().where({ defuente: job.data.id }).sort({ createdAt: 'desc' }).limit(1).exec( function( err, publicacion ){
                if (err) {
                    return console.log(err);
                }else{
                    if( typeof publicacion[0] != 'undefined' ){                 
                        console.log("info: ".green + "La mas nueva es: ", publicacion[0].paging.min_tag_id );
                        min_tag_id = publicacion[0].paging.min_tag_id;
                    }else{
                        min_tag_id = null;
                        console.log("info: ".green + "No hay publicaciones anteriores");
                    }

                    Instagram.tags.recent({ 
                        name: job.data.tag,
                        min_tag_id: min_tag_id,
                        complete: function( data, paging ){
                            console.log("info: ".green + data.length + " images found.");
                            if( data.length === 0 ){
                                    setTimeout ( function() {
                                        console.log("info: ".green + "Gave instagram servers a 1 second break.");
                                        done();
                                    }, 1000 );
                            }else{
                                for (var i = data.length - 1; i >= 0; i--) {
                                    // console.log("info: ".green + "Saving image from fuente: " + job.data.id + " from user: " + data[i].user.username + " in tablero: " + job.data.tablero );
                                    var options = [ 'no-color-block', 'no-color-block', 'color-block' ];
                                    var color = Math.floor((Math.random()*7));
                                    var value = Math.floor((Math.random()*3));

                                    Publicacion.create({
                                        entablero: job.data.tablero,
                                        origin_id: job.data.tablero + "_" + data[i].id,
                                        defuente: job.data.id,
                                        color_class: options[ value ] + ' color-' + color,
                                        red: 'instagram',

                                        tipo: data[i].type ,
                                        data: data[i],
                                        paging: paging,
                                    }).exec(function(err, publicacion) {
                                        if (err) {
                                            return console.log(err);

                                        }else {
                                            console.log("info: ".green + "Publicacion saved:", publicacion.id + " from fuente: " + job.data.id );

                                            Publicacion.publishCreate({
                                              id: job.data.tablero,
                                              data: publicacion
                                            });
                                        }
                                    });
                                    if( i === 0) {
                                        console.log("info: ".green + "Saving images done");
                                        console.log("info: ".green + "Giving instagram servers a 2 second break.");
                                        setTimeout ( function() {
                                            console.log("info: ".green + "Gave instagram servers a 2 second break.");
                                            done();
                                        }, 2000 );
                                    }
                                };  
                            }
                        },
                         error: function(errorMessage, errorObject, caller){
                          console.log("error: ".red + "INSTAGRAM Query hizo error: ", errorMessage );
                              var err = new Error( errorMessage );
                              job.failed().error(err);
                              done(err);
                        }

                    });
                }
            });
                
        }, done );

}

        //Instagram.tags.recent({ name: job.data.tag });


    


module.exports.StopRecentFromTag = function( id ){
    if( openSubscriptions[id] ){
        console.log("info: ".yellow + "Disconnecting from instagram recent tag: " + id );
        openSubscriptions[id].clear();
        delete openSubscriptions[id];
    }else{
        console.log("info: ".green + "Instagram recent tag: " + id + " is already disconnected.");
    }
}