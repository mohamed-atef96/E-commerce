const expressJwt = require('express-jwt');

function ath(){
    return expressJwt({
        secret:process.env.key,
        algorithms:["HS256"]
    }).unless({
        path:[
            {url: /\/product(.*)/ ,method:["GET","OPTIONS"]},
            {url: /\/category(.*)/ ,method:["GET","OPTIONS"]},
            "/auth/signIn",
            "/auth/signUp"
        ]
    })   

};

module.exports = ath