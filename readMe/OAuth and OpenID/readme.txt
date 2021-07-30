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
