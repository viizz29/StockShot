async function get(request, response){
    let dataProvider = request.dataProvider;
    response.send({
        code: 200,
        msg: "OK",
        data: dataProvider.getUsageData()
    });
}

exports.get = get;