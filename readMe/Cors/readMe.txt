1. you can reject cors request in two ways from the server: 

  a. Sending an Access-Control-Allow-Origin header that doesn’t match the Origin header
  
  b. Removing the Access-Control-Allow-Origin header entirely


2. What is Preflight request, it is a request that browser sends to server in certain situations, before the real request, and
    if the server doesn't applied Cors policy or doesn't send correct response to the preflight request, the real request will be 
    rejected.

3. Preflight requests exist in two situation: 

      a. the request method is not GET or POST

      b. the request header has custom additional field(s) (these applies to all methods)


4. each preflight request has three feature in header:

      a. HTTP OPTION method

      b. it has origin

      c. It has Access-Control-Request-Method header

5. To respond to preflight request you have to define, Access-Control-Allow-Methods (always) and 
    Access-Control-Allow-Headers (If we had custom headers)


6. To reject preflight requests:

    a. Leave out the Access-Control-Allow-Origin header (if the requested method is not a simple method).

    b. Return a value in Access-Control-Allow-Methods that doesn’t match the AccessControl-Request-Method header.
    
    c. If the preflight request has an Access-Control-Request-Headers header:
        – Leave out the Access-Control-Allow-Headers header.
        – Return a value in the Access-Control-Allow-Headers header that doesn’t match the Access-Control-Request-Headers header.


7. To use cookies in CORS, the browser should send the cookie header in request, and the server should repond with 

      res.set('Access-Control-Allow-Credentials', 'true');