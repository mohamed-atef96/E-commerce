const expressJwt = require("express-jwt");

function ath() {
  return expressJwt({
    secret: process.env.key,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public(.*)/, method: ["GET", "OPTIONS"] },
      { url: /\/product(.*)/, method: ["GET", "OPTIONS"] },
      { url: /\/category(.*)/, method: ["GET", "OPTIONS"] },
      "/auth/signIn",
      "/auth/signUp",
    ],
  });
}
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}

module.exports = ath;
