async function get(request, response){
    let query = request.query.hasOwnProperty('q')?request.query.q:'TATA';
    query = query.toLowerCase();
    //console.log(query);
    request.dataProvider.getDatabase().instruments.find({
        selector:{
            label: { $regex: '.*'+query+'.*' },
        },
        limit: 10
    }).exec().then(documents => {
        let data = [];
        for(let i=0;i<documents.length;i++){
            data.push(documents[i].toJSON());
        }
        response.send(data);    
    });
}

exports.get = get;