const db = require('./../../models/index');    


async function get(req, res){
    const {symbol} = req.query;
    if(!symbol){
        res.status(400).send("Please provide the symbol.");
        res.end();
        return;
    }

    const Favorite = db.Favorite;
    const favorite = await Favorite.findOne({
        where:{
            userid: req.user.id,
            symbol: symbol
        },
        raw: true
    });

    //console.log(favorite);
    if(favorite == null)
        res.send({code: 200, msg: 'Not a favorite', isfav: false});
    else
        res.send({code: 200, msg: 'It is a favorite', isfav: true, data: favorite});
}

exports.get = get;