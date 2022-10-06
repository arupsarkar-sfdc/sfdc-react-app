const express = require('express');
const path = require('path'); // NEW

const jsforce = require('jsforce')
const session = require('express-session')



// Load and check config
require('dotenv').config();
if (!(process.env.loginUrl && process.env.consumerKey && process.env.consumerSecret && process.env.callbackUrl && process.env.apiVersion && process.env.sessionSecretKey)) {
  console.error('Cannot start app: missing mandatory configuration. Check your .env file.');
  process.exit(-1);
}

console.log('consumer key : ', process.env.consumerKey)

// Instantiate Salesforce client with .env configuration
const oauth2 = new jsforce.OAuth2({
  loginUrl: process.env.loginUrl,
  clientId: process.env.consumerKey,
  clientSecret: process.env.consumerSecret,
  redirectUri: process.env.callbackUrl
})

const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist'); // NEW
const HTML_FILE = path.join(DIST_DIR, 'index.html'); // NEW


// Enable server-side sessions
app.use(
  session({
    secret: process.env.sessionSecretKey,
    cookie: { secure: process.env.isHttps === 'true' },
    resave: false,
    saveUninitialized: false
  })
)


/**
 *  Attemps to retrieves the server session.
 *  If there is no session, redirects with HTTP 401 and an error message
 */
 function getSession(request, response) {
  const session = request.session;
  if (!session.sfdcAuth) {
    response.status(401).send('No active session');
    return null;
  }
  return session;
}

function resumeSalesforceConnection(session) {
  return new jsforce.Connection({
    oauth2: oauth2,
    instanceUrl: session.sfdcAuth.instanceUrl,
    accessToken: session.sfdcAuth.accessToken,
    version: process.env.apiVersion
  });
}

const mockResponse = 
[{
  id:"https://login.salesforce.com/id/00Dx0000000BV7z/005x00000012Q9P",
  issued_at:"1278448384422",
  instance_url:"https://na1.salesforce.com",
  signature:"SSSbLO/gBhmmyNUvN18ODBDFYHzakxOMgqYtu+hDPsc=",
  access_token:"00Dx0000000BV7z!AR8AQP0jITN80ESEsj5EbaZTFG0RNBaT1cyWk7TrqoDjoNIWQ2ME_sTZzBjfmOE6zMHq6y8PIW4eWze9JksNEkWUl.Cju7m4"
}];
app.use(express.static(DIST_DIR)); // NEW
app.get('/api', (req, res) => {
  console.log('Got a ping from client')
  res.send(mockResponse);
});

app.get('/', (req, res) => {
 res.sendFile(HTML_FILE); // EDIT
});


/**
 * Login endpoint
 */
 app.get('/auth/login', (request, response) => {
  // Redirect to Salesforce login/authorization page
  response.redirect(oauth2.getAuthorizationUrl({ scope: 'api refresh_token' }))
})

app.get('/auth/logout', (req, res) => {
  const session = getSession(req, res);
  if (session == null) return;

  // Revoke OAuth token
  const conn = resumeSalesforceConnection(session);
  conn.logout((error) => {
    if (error) {
      console.error('Salesforce OAuth revoke error: ' + JSON.stringify(error));
      res.status(500).json(error);
      return;
    }

    // Destroy server-side session
    session.destroy((error) => {
      if (error) {
        console.error('Salesforce session destruction error: ' + JSON.stringify(error));
      }
    });

    // Redirect to app main page
    return res.redirect('/');
  });  
})

app.get('/auth/token', (req, res) => {
  const session = getSession(req, res)
  if (session == null) {
    return
  }
  const conn = resumeSalesforceConnection(session);
  if(conn) {

    console.log(conn.accessToken)
    res.send([{token_received: true}])
  }    
})

/**
 * Login callback endpoint (only called by Salesforce)
 */
 app.get('/auth/callback', (request, response) => {
  if (!request.query.code) {
    response.status(500).send('Failed to get authorization code from server callback.')
    return
  }

  // Authenticate with OAuth
  const conn = new jsforce.Connection({
    oauth2: oauth2,
    version: process.env.apiVersion
  });
  conn.authorize(request.query.code, (error, userInfo) => {
    if (error) {
      console.log('Salesforce authorization error: ' + JSON.stringify(error));
      response.status(500).json(error);
      return;
    }

    console.log('access token from salesforce: ', conn.accessToken)
    console.log('instance url from salesforce: ', conn.instanceUrl)
    // Store oauth session data in server (never expose it directly to client)
    request.session.sfdcAuth = {
      instanceUrl: conn.instanceUrl,
      accessToken: conn.accessToken
    };
    // Redirect to app main page
    return response.redirect('/index.html')
  })
})


app.get('/api/query', (req, res) => {
  const session = getSession(req, res)
  if (session == null) {
    return
  }  
  const query = req.query.q
  console.log('Query submitted ', query)
  if (!query) {
    res.status(400).send('Missing query parameter.');
    return;
  }
  const conn = resumeSalesforceConnection(session)
  conn.query(query, (error, result) => {
    if (error) {
      console.error('Salesforce data API error: ' + JSON.stringify(error))
      res.status(500).json(error)
      return
    } else {
      console.log('query results : ', result)
      res.send(result)
      return
    }    
  })  
})

app.listen(port, function () {
 console.log('App listening on port: ' + port);
})