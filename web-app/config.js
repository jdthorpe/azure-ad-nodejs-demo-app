const tenantName = process.env.tenantName;
const tenantID = process.env.tenantID;
const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const appURI = process.env.appURI;

exports.creds = {
    identityMetadata: `https://login.microsoftonline.com/${tenantName}.onmicrosoft.com/.well-known/openid-configuration`,
    identityMetadata: identityMetadata,
    clientID: clientID,
    responseType: 'code',
    responseMode: 'form_post',
    redirectUrl: 'http://localhost:3000/auth/openid/return',
    allowHttpForRedirectUrl: true, // change to false for production
    clientSecret: clientSecret,
    validateIssuer: true,
    loggingNoPII: false,
    isB2C: false,
    issuer: 'https://sts.windows.net/' + tenantID + '/',
    passReqToCallback: false,
    useCookieInsteadOfSession: true,
    cookieEncryptionKeys: [
        { 'key': '12345678901234567890123456789012', 'iv': '123456789012' },
        { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
    ],
    scope: null,
    loggingLevel: 'info',
    nonceLifetime: null,
    nonceMaxAmount: 5,
    clockSkew: null,
};

exports.destroySessionUrl = 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=http://localhost:3000';
exports.resourceURL = appURI;