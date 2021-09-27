//////// oauth book //////////////
1. in OAuth, the end user delegates some part of their authority to access the protected resource to the client application to act
on their behalf. To make that happen, OAuth introduces another component into the system: the --authorization server--.

2. The authorization server (AS) is trusted by the protected resource to issue special purpose security credentials—called --OAuth access tokens--`to clients.

3. Tokens are heart of the OAuth 2.0 protocol

    a. The Resource Owner indicates to the Client that they would like the Client to act on their behalf (for example, “Go load my photos from that service so I can
        print them”).
    b. The Client requests authorization from the Resource Owner at the Authorization Server.
    c. The Resource Owner grants authorization to the Client.
    d. The Client receives a Token from the Authorization Server.
    e. The Client presents the Token to the Protected Resource.

4. Following an OAuth 2.0 authorization grant in detail:


    a.  a web client, this takes the form of an HTTP redirect to the authorization server’s --authorization endpoint--:

            HTTP/1.1 302 Moved Temporarily
            x-powered-by: Express
            Location: http://localhost:9001/authorize?response_type=code&scope=foo&client
            _id=oauth-client-1&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2Fcallback&
            state=Lwt50DDQKUB8U7jtfLQCVGDL9cnmwHH1
            Vary: Accept
            Content-Type: text/html; charset=utf-8
            Content-Length: 444
            Date: Fri, 31 Jul 2015 20:50:19 GMT
            Connection: keep-alive

            [ATTENTION]
            pay attention to: 
            
            --response_type=code--, (defines the --authorization grant-- or oauth flow, here the authorization grant is authorization code)
            --scope= -- : The client’s request can include an indication of what kind of access it’s looking for (known as the OAuth scope)
            --client_id= --, (The authorization server gives the client the unique client id)
            --redirect_uri= --,
            --state= -- (This state is a random string that is generated at first by client app, and save it, untill the authorization server send request to callback url, 
                        the client should save this state to prevent from sending request to token end point by just going to callback uri by hackers)
    
    b. This redirect to the browser causes the browser to send an HTTP GET to the authorization server endpoint:

            GET /authorize?response_type=code&scope=foo&client_id=oauth-client
            -1&redirect_uri=http%3A%2F%2Flocalhost%3A9000%
            2Fcallback&state=Lwt50DDQKUB8U7jtfLQCVGDL9cnmwHH1 HTTP/1.1
            Host: localhost:9001
            User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0)
            Gecko/20100101 Firefox/39.0
            Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
            Referer: http://localhost:9000/
            Connection: keep-alive

    c. Next, the authorization server will usually require the user to authenticate, The user’s authentication passes directly between the user (and their browser) and
        the authorization server; it’s never seen by the client application. The authorization server is free to use any authentication method.
    
    d. HTTP 302 Found
        Location: http://localhost:9000/oauth_callback?code=8V1pr0rJ&state=Lwt50DDQKU
        B8U7jtfLQCVGDL9cnmwHH1
    
    e. This in turn causes the browser to issue the following request back to the client:
        GET /callback?code=8V1pr0rJ&state=Lwt50DDQKUB8U7jtfLQCVGDL9cnmwHH1 HTTP/1.1
        Host: localhost:9000

        [ATTENTION]
        We get this code, since we are using authorization code grant type (--response_type=code)



    f. Now that the client has the code, it can send it back to the authorization server on its --token endpoint-- to get the access and referesh token

        POST /token
        Host: localhost:9001
        Accept: application/json
        Content-type: application/x-www-form-encoded
        Authorization: Basic b2F1dGgtY2xpZW50LTE6b2F1dGgtY2xpZW50LXNlY3JldC0x
        grant_type=authorization_code&
        redirect_uri=http%3A%2F%2Flocalhost%3A9000%2Fcallback&code=8V1pr0rJ




    g. The authorization server takes in this request and, if valid, --issues a token--.
        The authorization server performs a number of steps to ensure the request is legitimate: 
            
            a. First, it validates the client’s credentials (passed in the Authorization header here) to determine which client is requesting access.
            b. it reads the value of the code parameter from the body and looks up any information it has about that authorization code, including which client made the 
                initial authorization request, which user authorized it, and what it was authorized for. If the authorization code is valid, has not
                been used previously, and the client making this request is the same as the client that made the original request, the authorization server generates 
                and returns a new access token for the client.

        This token is returned in the HTTP response as a JSON object. The response can also include a
        refresh token (used to get new access tokens without asking for authorization again)
       
        HTTP 200 OK
        Date: Fri, 31 Jul 2015 21:19:03 GMT
        Content-type: application/json
        {
        “access_token”: “987tghjkiu6trfghjuytrghj”,
        “token_type”: “Bearer”
        }


//////////////////////////////// Build simple OAuth client application //////////////////////

5. Client and Authorization server need to know few thing about each other:

        Client information: 
        {
            client_id:
            client_secret:
            scope:
            redirect_uri:
        }

        Server information:
        {
            authorization_endpoint:
            token_endpoint:
        }

6. When we click on the button in our client app for authorization, our client app redirect the user to authorization server:

        app.get('/authorize', function(req, res){
            var authorizeUrl = buildUrl(authServer.authorizationEndpoint, {
            response_type: 'code',
            client_id: client.client_id,
            redirect_uri: client.redirect_uris[0]
            });
            res.redirect(authorizeUrl);
        });

7. When the authorization server authenticate the user, the authorization server redirects the user to /callback in client app:

    app.get('/callback', function(req, res){
        var code = req.query.code;
        var form_data = qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: client.redirect_uris[0]
        });
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encodeClientCredentials(client.client_id,
                client.client_secret)
        };
        
        var tokRes = request('POST', authServer.tokenEndpoint,
            {
                body: form_data,
                headers: headers
            }
        );
        res.render(‘index’, {access_token: body.access_token});
    });

        // The response is look like this:
            {
                "access_token": "987tghjkiu6trfghjuytrghj",
                "token_type": "Bearer"
            }

8. The kind of OAuth access token that we have is known as a bearer token, which means that whoever holds the token can present it to the protected resource. The
        OAuth Bearer Token Usage specification actually gives three ways to send the token value:
            
            a. As an HTTP Authorization header (prefred way)
            b. As a form-encoded request body parameter
            c. As a URL-encoded query parameter

    to make request to resource server:

        app.get('/fetch_resource', function(req, res){
            if (!access_token) {
                res.render('error', {error: 'Missing access token.'});
                return;
            }
            var headers = {
                'Authorization': 'Bearer ' + access_token
            };
            var resource = request('POST', protectedResource,
                {headers: headers}
            );
        });

9. If the access token is expired, we can use referesh token to get new access token (pay attention to grant_type):

        var form_data = qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        });
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encodeClientCredentials(client.client_id,
            client.client_secret)
        };
        var tokRes = request('POST', authServer.tokenEndpoint, {
            body: form_data,
            headers: headers
        });

////////////////////////// Build simple resource server /////////////////

10. The only responsibility of resource server is to take the bearer token, validates it and return the resource.
    since most of the times there are multiple urls that we must protect, we can use middleware to for different urls:

        var getAccessToken = function(req, res, next) {
            var inToken = null;

            // token from header
            var auth = req.headers['authorization'];
            if (auth && auth.toLowerCase().indexOf('bearer') == 0) {
                inToken = auth.slice('bearer '.length);
            }
            // token from form body
            } else if (req.body && req.body.access_token) {
                inToken = req.body.access_token;
            } else if (req.query && req.query.access_token) {
                inToken = req.query.access_token
            }
            // after parsing the token, we should validate it against datastore, in our example the resource server has access to the datastore of the 
            // authorization server
            nosql.one(function(token) {
                if (token.access_token == inToken) {
                    return token;
                }
            }, function(err, token) {
                if (token) {
                    console.log("We found a matching token: %s", inToken);
                } else {
                    console.log('No matching token was found.');
                }
                req.access_token = token;
                next();
                return;
        });

11. Then we can use this middleware in our actions

12. What if your API isn’t serving static resources with a simple yes/no gateway in front of them? Many APIs are designed such that different actions on the API require
    different access rights.

    a. Different scopes for different actions:
        



















1. pattern for using oauth:     (Delegated authorization)

    yelp(example of app)            ----->                  accounts.google.com    
    (connect with google)      (client gives:  
                                1. Redirect URI     (user add user and pass for google)
                                2.response type: code           |
                                3.it also give the scope:
                                (email, profile, google apis)   |
                                4.client id                 |                                       
                                                                |
                                                                |
                                                                |
                                                    google notif, that yelp wants to 
we go to the yelp.com/callback      <------         access your ...
    (in this address we have                                    (yes or no)
    code, we get it in the query strings, that we can exchange for access token
    we have to send client id and client secret with code
    to get the access token, we do this in back channel)
    after getting access token, we get info from resource 
    server by passing the access token as well as client id and secret in back channel to resource server                          

[ATTENTION]
access token is related to the scopes that the client ask for

2. oauth terminology:

    a. Resource owner: it is fancy word for user
    b. Client: is the app that want to use information (like yelp in this app)
    c. Authorization server: in this example is accounts.google.com (security token service)
    d. Resource server: in this example is google contact API
    e. Authorization grant: it is the grant that we get when we click on yes
    f. Redirect URI(callback): it is the callback that we go to after giving the access
    g. Access token: the client after getting the permission, get this to 
                        do whatever it want to do.
    h. scope: this is define, how much info that client can have this scope is
                        going to be in the access token.

    [ATTENTION]
    The authorization server has a list of scopes that it understand, for example Contact.read, Contact.write, and ...
    the client asks for certain scopes and the authorization server generate the consent pop up based on these asked scopes by
    client. 

[ATTENTION]
in callback URI, the handler function, Exchange authorization code for 
access token.

3. There is reason that we first get a code and then exchagne it in the callback URI
    with access token. in here we are going to explain this: 

    we have two channel in network that we can transfer data in it:

        a. back channel (highly secure channel): request from a back end of server
            to another sever in https protocol 
        b. front channel (less secure channel): request from a browser

    in the process of oauth we use both of this, all of the process is in front
    channel (even the authorization server sends the code in the callback url
    inside query string), except the proccess of changing the code for access token.
    in this proccess your backend server, sends code to authorization server and 
    get the access token.

4. The reason that back channel is safe, it is because of that besides the code 
    that authorization server give us, our server has a code (for example a client
    ID and client secret) that we have to sends it in the backend beside the code,
    and this api key is neccessary for transfering data between severs.

    post to authorization server:

        Post www.googleapis.com/oauth2/v4/token
        code=<code you get>
        clientId=<your client id>
        client_secret=<your secret>
        grant_type=authorization_code

    
    response from authorization server: 
        
        {
            access_token: <>
            expires_in: <>
            token_type: <Bearer>
        }


5. different oauth flows: 

    a. Authorization code: this is the one that we've described (front channel + back
    channel)

    b. Implicit (front channel only) this is like fully react app, because you don't
    have backend. (we add response type: token)

    c. Resource owner password credential (backchannel only)

    d. Client credential (back channel only): for machine to machine 

[OAUTh cares about scopes, not the required information for login, there is no standard for this, Every implementation is a
little different, and there is no set of standard scopes]
6. As you can see, oauth is for authorization, not authentications, in oauth we 
   check for the permission and scope to access something, and it is not designed
   for authentication and adding a user. so OpenID is another layer on 
   oauth 2.0 for making it useful for authentication:

7. What openID connect adds:

        a. ID token (it has the information of the user that is required for sign up)
        b. UserInfo end point for getting more user information (if the information in the id token is not enough, you can get
                                                                more information from this end point)
        c. standard set of scopes
        d. Standardize implementation

8. OpenId connect workflow:

    [Important]
    a. the flow of OpenID is just like oauth, but the scope will changed to openid profile. (openid profile is standard)

    [ATTENTION]
    b. after sending the authorization code to authorization server, we also get ID token(JWT) as well as access token, and the client
    (application) can use id token to find out who is the user.
    
    c. we can use access token to get even more info about the user from the UserInfo end point.


9. Using openid in a typical website that has separate identity:

    when you request for login to the identity (authorization server) it gives back
    access token and token id and you can set the id token information to 

10. for native mobile apps, we have to use openID connect code flow beside 
    PKCE (proof key for code key exchange) there is library app off that abstract all this


11. Use cases of OpenID connect:


            a. Web application with backend server:

                                                        OpenID connect(code flow)
                    login form with google button     ------------------->                  Authorization server
                                                      <-------------------
                                                      back to web app with authorization
                                                      code, exchange for Id token and access token
                                |
                                |
                                |
                                put session ID in user cookie

            b. Native mobile app:


                                                        OpenID connect(code flow + PKCE)
                    login form with google button     ------------------->                  Authorization server
                                                      <-------------------
                                                      back to web app with authorization
                                                      code, exchange for Id token and access token
                                |
                                |
                                |
                                put session ID in user cookie
