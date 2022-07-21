import c from "crypto";

var token  =  c.randomBytes(64).toString('hex')

console.log(token)

