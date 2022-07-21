import con from '../config.js';
import jwt from 'jsonwebtoken';

export const login = (req,response)=>{
    let username = req.body.username;
    let password = req.body.password;
    if(username && password){
        con.query("Select * from user where username = ? AND password = ?",[username, password], (err, result) =>{
            if (err) {
                response.status(500).send("err");
            }
            if(result.length > 0) {
                response.status(200).send("login success!");
                //redirect or something
            }
            else{
                response.send("Incorrect username or password!");
            }
        })
    }
    else{
        response.send('Please input username and password!');
    }
}


export const retrieveInfo = (req,res)=>{
    con.query("select * from user", (err, result) => {
        if (err) 
        { 
            res.send(err);
        }
        else 
        { 
            res.send(result);
        }
    })
}

export const register = (req,response)=>{
    let username = req.body.username;
    let password = req.body.password;
    if(username && password){
        con.query("Select * from user where username = ?",[username], (err, result) =>{
            if (err) {
                response.status(500).send("err");
            }
            if(result.length > 0) {
                response.send("Username has already been used!");
                //redirect or something
            }
            else{
                con.query("INSERT INTO user (username, password) VALUES (?, ?)",[username,password], (err) =>{
                    if (err) {
                        response.status(500).send("err");
                    }
                    else response.send("You have successfully been registered!");
                })
            }
        })
    }
    else{
        response.send('Please input username and password!');
    }
}

export const changePassword = (req,response)=>{
    let username = req.body.username;
    let password = req.body.password;
    let newPassword = req.body.newPassword;
    if(username && password && newPassword){
        con.query("Select * from user where username = ? AND password = ?",[username,password], (err, result) =>{
            if (err) {
                response.status(500).send("err")
            }
            if(result.length > 0) {
                //redirect or something
                con.query("UPDATE user SET password = ? WHERE userid =?;",[newPassword,result[0].userid], (err) =>{
                    if (err) {
                        response.status(500).send(err);
                    }
                    else{ 
                        response.status(200).send("Password has been updated!");
                    }
                })
            }
            else{
                response.send("Invalid username or password!");
            }
        })
    }
    else{
        response.send('Please input username and password!');
    }
}

export const deleteUser = (req,response)=>{
    let username = req.body.username;
    con.query("DELETE FROM user WHERE username=?",[username], (err) =>{
        if (err) {
            response.status(500).send("err");
        }
        else {
            response.status(200).send(" User has been successfuly deleted");
        }
    })
}

export const hello = ((req, response)=>{
    response.send("HELLO")
  })
  
  const SERCRET_KEY = "03eb5833ba03fe3baf2e438003f2cb83def2de7580f630cd127f27039c93120815a8d899a85553b59202acce413298cdd3a5c653308dcdae7f6bb8622ff60cb7"
  
  
  export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(authHeader)
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, SERCRET_KEY, (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
  }
  
  
  export function generateAccessToken(username) {
      return jwt.sign(username, SERCRET_KEY, { expiresIn: '3600s' });
    }
  
  export const token = ('/jwt', (req, response) => {
    const token = generateAccessToken({username: req.body.username})
    console.log(req.body)
    response.json(token)
  })
  