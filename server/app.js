const express = require("express");
const path = require("path"); // NEW

const jsforce = require("jsforce");
const session = require("express-session");
const pino = require("pino");
const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

// Load and check config
require("dotenv").config();
if (
  !(
    process.env.loginUrl &&
    process.env.consumerKey &&
    process.env.consumerSecret &&
    process.env.callbackUrl &&
    process.env.apiVersion &&
    process.env.sessionSecretKey
  )
) {
  logger.error(
    "Cannot start app: missing mandatory configuration. Check your .env file."
  );
  process.exit(-1);
}

let event_name = [];

// Instantiate Salesforce client with .env configuration
const oauth2 = new jsforce.OAuth2({
  loginUrl: process.env.loginUrl,
  clientId: process.env.consumerKey,
  clientSecret: process.env.consumerSecret,
  redirectUri: process.env.callbackUrl,
});

const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, "../dist"); // NEW
const HTML_FILE = path.join(DIST_DIR, "index.html"); // NEW

// Enable server-side sessions
app.use(
  session({
    secret: process.env.sessionSecretKey,
    cookie: { secure: process.env.isHttps === "true" },
    resave: false,
    saveUninitialized: false,
  })
);

/**
 *  Attemps to retrieves the server session.
 *  If there is no session, redirects with HTTP 401 and an error message
 */
function getSession(request, response) {
  const session = request.session;
  if (!session.sfdcAuth) {
    response.status(401).send("No active session");
    return null;
  }
  return session;
}

function resumeSalesforceConnection(session) {
  return new jsforce.Connection({
    oauth2: oauth2,
    instanceUrl: session.sfdcAuth.instanceUrl,
    accessToken: session.sfdcAuth.accessToken,
    version: process.env.apiVersion,
    refreshToken: session.sfdcAuth.refreshToken,
  });
}

const mockResponse = [
  {
    id: "https://login.salesforce.com/id/00Dx0000000BV7z/005x00000012Q9P",
    issued_at: "1278448384422",
    instance_url: "https://na1.salesforce.com",
    signature: "SSSbLO/gBhmmyNUvN18ODBDFYHzakxOMgqYtu+hDPsc=",
    access_token:
      "00Dx0000000BV7z!AR8AQP0jITN80ESEsj5EbaZTFG0RNBaT1cyWk7TrqoDjoNIWQ2ME_sTZzBjfmOE6zMHq6y8PIW4eWze9JksNEkWUl.Cju7m4",
  },
];
app.use(express.static(DIST_DIR)); // NEW
app.get("/api", (req, res) => {
  logger.info(`Got a ping from client`);
  res.send(mockResponse);
});

app.get("/", (req, res) => {
  res.sendFile(HTML_FILE); // EDIT
});

/**
 * Login endpoint
 */
app.get("/auth/login", (request, response) => {
  // Redirect to Salesforce login/authorization page
  response.redirect(
    oauth2.getAuthorizationUrl({ scope: "api id web refresh_token" })
  );
});

app.get("/auth/logout", (req, res) => {
  const session = getSession(req, res);
  if (session == null) return;

  // Revoke OAuth token
  const conn = resumeSalesforceConnection(session);
  conn.logout((error) => {
    if (error) {
      logger.error("Salesforce OAuth revoke error: " + JSON.stringify(error));
      res.status(500).json(error);
      return;
    }

    // Destroy server-side session
    session.destroy((error) => {
      if (error) {
        logger.error(
          "Salesforce session destruction error: " + JSON.stringify(error)
        );
      }
    });

    // Redirect to app main page
    return res.redirect("/");
  });
});

/**
 * Login callback endpoint (only called by Salesforce)
 */
app.get("/auth/callback", (request, response) => {
  if (!request.query.code) {
    response
      .status(500)
      .send("Failed to get authorization code from server callback.");
    return;
  }

  // Authenticate with OAuth
  const conn = new jsforce.Connection({
    oauth2: oauth2,
    version: process.env.apiVersion,
  });
  conn.authorize(request.query.code, (error, userInfo) => {
    if (error) {
      logger.info("Salesforce authorization error: " + JSON.stringify(error));
      response.status(500).json(error);
      return;
    }
    logger.info(`access token from salesforce: ${conn.accessToken}`);
    logger.info(`instance url from salesforce: ${conn.instanceUrl}`);
    logger.info(`refresh token from salesforce: ${conn.refreshToken}`);
    // Store oauth session data in server (never expose it directly to client)
    request.session.sfdcAuth = {
      instanceUrl: conn.instanceUrl,
      accessToken: conn.accessToken,
      refreshToken: conn.refreshToken,
    };
    // Redirect to app main page
    return response.redirect("/");
  });
});

app.get("/api/query", (req, res) => {
  const session = getSession(req, res);
  if (session == null) {
    return;
  }
  const query = req.query.q;
  logger.info(`Query submitted : ${query}`);
  if (!query) {
    res.status(400).send("Missing query parameter.");
    return;
  }
  const conn = resumeSalesforceConnection(session);
  conn.query(query, (error, result) => {
    if (error) {
      logger.error("Salesforce data API error: " + JSON.stringify(error));
      res.status(500).json(error);
      return;
    } else {
      logger.info(`query results : ${result}`);
      res.send(result);
      return;
    }
  });
});

/**
 * Server Side Event: SSE - START
 */
app.get("/auth/token", async (req, res) => {
  try {
    if (req.headers.accept === "text/event-stream") {
      await sendEvent(req, res);
    }
  } catch (error) {
    logger.error(`Error accessing token : ${error}`);
  }
});

const writeEvent = (res, sseId, data) => {
  res.write(`id: ${sseId}\n`);
  res.write(`data: ${data}\n\n`);
};

const sendEvent = (req, res) => {
  const session = getSession(req, res);
  if (session == null) {
    return;
  }
  const conn = resumeSalesforceConnection(session);
  res.writeHead(200, {
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
  });
  const sseId = new Date().toDateString();
  if (conn.accessToken) {
    writeEvent(res, sseId, "LoggedIn");
  } else {
    writeEvent(res, sseId, "NotLoggedIn");
  }
};
/**
 * Server Side Event: SSE - END
 */

/**
 * Event to be tracked - Start
 */

app.get("/api/event", async (req, res) => {
  try {
    logger.info(`Event param to be tracked - ${req.query.eventParam}`);

    const session = getSession(req, res);
    if (session == null) {
      return;
    }
    const conn = resumeSalesforceConnection(session);
    if (conn) {
      event_name = []
      //assign the key to event_name for tracking PE
      const newEvents = {
        id: conn.accessToken,
        event_value: req.query.eventParam,
      }

      event_name.push(newEvents)
    }
    //await sendEventStream(req, res, req.query.eventParam)
    res.send([{ result: "Submitted" }]);
  } catch (error) {
    logger.error(`Error in /api/event ${error}`);
  }
});

/**
 * Event to be tracked - End
 */

/*
 * Events Stream - START
 */

app.get("/api/events", async (req, res) => {
  try {
    logger.info(`Inside /api/events - start`);
    logger.info(`Event to be tracked in server ${event_name[0].id}`);
    res.writeHead(200, {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    });
    res.flushHeaders();
    if (req.headers.accept === "text/event-stream") {
      logger.info(`Inside /api/events - if clause`);
      await sendEventStream(req, res);
    }
  } catch (error) {
    logger.error(`Error accessing token : ${error}`);
  }
});

const writeEventStream = (res, sseId, data) => {
  try {
    logger.info(`Inside writeEventStream - start`);
    res.write(`id: ${sseId}\n`);
    res.write(`data: ${data}\n\n`);
    logger.info(`Inside writeEventStream - end`);
  } catch (error) {
    logger.error(`Error writing event stream ${error}`);
  }
};

const sendEventStream = (req, res) => {
  try {
    logger.info(`id name logging ${event_name[0].id}`);
    logger.info(`event name logging ${event_name[0].event_value}`);

    const session = getSession(req, res);
    if (session == null) {
      return;
    }
    const conn = resumeSalesforceConnection(session);
    logger.info(`${conn}`);
    conn.streaming
      .topic(`/event/${event_name[0].event_value}`)
      .subscribe((message) => {
        const payload = JSON.stringify(message);
        console.info(`${payload}`);

        const sseId = Date.now().toString();
        logger.info(`${sseId}`);
        writeEventStream(res, sseId, payload);
      });
  } catch (error) {
    logger.error(`Error sending event stream ${error}`);
  }
};
/*
 * Events Stream - END
 */

app.listen(port, function () {
  logger.info(`App listening on port: ${port}`);
});
