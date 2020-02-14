// based on the official example at:
// https://github.com/Azure-Samples/active-directory-node-webapi/blob/master/node-server/app.js

const express = require("express");
const passport = require("passport");
const BearerStrategy = require("passport-azure-ad").BearerStrategy;

// INITIALIZE THE APP
const app = express();
app.use(require("morgan")("combined"));

// INITIALIZE AUTHENTICATION
const tenantName = process.env.tenantName;
const tenantID = process.env.tenantID;
const clientID = process.env.clientID;
const audience = process.env.audience;

const options = {
    identityMetadata: `https://login.microsoftonline.com/${tenantName}.onmicrosoft.com/.well-known/openid-configuration`,
    clientID: clientID,
    issuer: "https://sts.windows.net/" + tenantID + "/",
    audience: audience,
    loggingLevel: "info",
    // loggingNoPII: false, // uncomment for insecurely verbose debugging (super helpful when things go wrong)
    validateIssuer: true,
    passReqToCallback: false
};
app.use(passport.initialize());
passport.use(
    new BearerStrategy(options, function(token, done) {
        done(null, {}, token);
    })
);

// Enable CORS for * because this is a demo project
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// This is where your API methods are exposed
app.all(
    "/",
    passport.authenticate("oauth-bearer", { session: false }),
    function(req, res) {
        var claims = req.authInfo;
        console.log("User info: ", req.user);
        console.log("Validated claims: ", claims);
        res.status(200).json({ name: claims["name"] });
    }
);

// Run this
const port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on port " + port);
});
