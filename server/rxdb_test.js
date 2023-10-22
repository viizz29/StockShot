const rxdb = require('rxdb');
const rxdb_storage = require('rxdb/plugins/storage-memory');

async function populateTokens()
{
    db2 = await rxdb.createRxDatabase({
        name: 'stockshot',
        storage: rxdb_storage.getRxStorageMemory()
    });
    const mySchema = {
        version: 0,
        primaryKey: 'fytoken',
        type: 'object',
        properties: {
            fytoken: {
                type: 'string',
                maxLength: 30 // <- the primary key must have set maxLength
            },
            label: {
                type: 'string',
                maxLength: 50,
                index: true
            },
        },
        required: ['label', 'fytoken']
    }
    
    await db2.addCollections({
        instruments: {
            schema: mySchema
        }
    });

    await db2.instruments.insert({
        fytoken: '123456789',
        label: 'NSE:HDFCBANK-EQ',
    });

    await db2.instruments.insert({
        fytoken: '987654321',
        label: 'NSE:SBIN-EQ',
    });

    await db2.instruments.find({
        selector:{
            label: { $regex: '.*B.*' },
        },
        limit: 2
    }).exec().then(documents => {
        for(let i=0;i<documents.length;i++){
            console.log(JSON.stringify(documents[i].toJSON()));
        }
        
    });
}

populateTokens();