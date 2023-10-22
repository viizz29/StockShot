require("dotenv").config();
const { Sequelize } = require('sequelize');
    
const USER_ID = 1;

async function test(){
    const sequelize = new Sequelize({
        "dialect": "sqlite",
        "storage": "../sqlite.db"  
      });

    
    const User = require('./models/user')(sequelize, Sequelize.DataTypes);
    const user = await User.findOne({
        where: {
            id: USER_ID
        },
        raw: true
    });

    if(user == null)
        console.log("No such user.");
    else{
        await User.update({isAdmin: true},{
            where:{
                id: USER_ID
            }
        });
        console.log("Updated ...");

        const user = await User.findOne({
            where: {
                id: USER_ID
            },
            raw: true
        });
        console.log("New Details: ");
        console.log(user);
    }
    
    sequelize.close()

}

test();
