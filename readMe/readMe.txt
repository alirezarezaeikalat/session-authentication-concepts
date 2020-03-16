1.Autentication: verifying identity (401 unauthorized)
  Autorization: verifying permissions (403 Forbidden)

2. Authentication:

	a. stateful(session using cookie)
	
	b. stateless(token using JWT or OAuth)


3. Flow of session(stateful):
	1. user submit login credential (e.g. email and password)
	2. server verifies the credentials against DB
	3. server create temp user session (typically is a string)
	4. server put session id into cookie
	5. user sends the cookie with each request.
	6. sever validates it against session store.
	7. when the user logout, server destroys the session and clear the cookie.

    sessions normally are stored in server side, (usually in Redis or Mongo)
    and after that the session id will be placed in the cookies

4. Cookies are set with Set-Cookie header by the server in the browser.
    example of cookie (Set-Cookie: SESS_ID=jkfadkafja...; Domain=example.com
    Path=/)

    Attributes in Cookies:
      a. Domain, Path and Expiration (When a cookie expired we call it
      session cookie)

    Flags in Cookies:
      a. HttpOnly (can not be read with js on the client side)
      b. Secure (can only sent over encrypted HTTPS channels)
      c. SameSite (can only be sent from same domain)

5. When we use cookies we are expose ourselves to CSRF 
(cross sire request forgery) attacks:
A user who is authenticated by a cookie saved in the user's web browser 
could [unknowingly] send an HTTP request to a site that trusts the user and 
thereby causes an unwanted action.


6. Flow of Token(stateless):
	1. user submit login credential
	2. server verifies the credentials against DB
	3. server generate s a temporary token and embeds user data in it.
	4. server responds back with token (in header or body)
	5. user stores the token in client storage (It could be local storage
  or session storage).
      data in the localstorage doesn't expire, data in sessionStorage is cleared
      when the page session ends. local storage is like no sql database in browser
      
	6. user sends the token with each request.
	7. sever validates it 
	8. when use logout, the token is cleared from user storage.

  Tokens are not stored in server sides.
  Tokens can be opaque or self-contained
  Tokens exposed to XSS attacks

7. Example of Json Web Tokens: 
    Content-type: application/json
    Authorization: Bearer kljf,dlahj;afd...

  JWT are in three parts: header(meta information), payload, signature

  we can decode the JWT so payloads can be decoded and read so we should not
  put any sensitive data in it, and we should use short time for it.


