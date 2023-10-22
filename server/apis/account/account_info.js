const db = require('./../../models/index');    


async function get(request, response){
    //let fyersClient = request.fyersClient;
     //console.log(await fyersClient.get_profile());
    response.send({code: 200, msg: "OK", data: request.user});
}

exports.get = get;