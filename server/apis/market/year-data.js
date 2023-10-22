async function get(request, response){

    let instrument = request.query.hasOwnProperty('instrument')?request.query.instrument:'NSE:SBIN-EQ';
    let result = await request.dataProvider.getOneYearData(instrument);
    response.send(result);
}

exports.get = get;