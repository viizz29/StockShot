const db = require('./../../models/index');    


async function get(req, res){
    const {symbol} = req.query;
    if(!symbol){
        res.status(400).send("Please provide the symbol.");
        res.end();
        return;
    }

    const Favorite = db.Favorite;
    const record = Favorite.build({
        userid: req.user.id,
        symbol: symbol,
    });
    await record.save()
    .then((item) => {
        res.status(200).send({code: 200, msg: 'success'});
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send("Unknown Error");
    });
    
}

exports.get = get;