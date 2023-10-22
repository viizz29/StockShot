const db = require('./../../models/index');    


async function get(req, res){
    const Favorite = db.Favorite;
    const favorites = await Favorite.findAll({
        where: {
            userid: req.user.id
        },
        raw: true
    });
    res.send(favorites);
}

exports.get = get;