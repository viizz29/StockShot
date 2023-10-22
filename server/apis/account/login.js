const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./../../models/index');    




async function post(req, res){
    // Our login logic starts here
  try {
    // Get user input

    //console.log(req.headers);
    //console.log(req.body);
    const { email, password } = req.body;
    

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("Please provide a valid email and password");
      res.end();
      return;
    }
    
    const User = db.User;

    // Validate if user exist in our database
    const user = await User.findOne({ 
      where:{
          email:email
        }
      });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        {id: user.id, firstName: user.firstName, email: user.email, isAdmin: user.isAdmin},
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );

      //console.log(user);
      res.send({'code': 200, 'msg': "Authentication Success", 'token': token, isAdmin: user.isAdmin});
      
      return;
    }
    res.status(400).send({'code': 400, 'msg': "Invalid Credentials"});
  } catch (err) {
    console.log(err);
  }
}

exports.post = post;