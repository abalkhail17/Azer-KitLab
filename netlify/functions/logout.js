exports.handler=async(event)=>({statusCode:200,headers:{'Cache-Control':'no-store','Set-Cookie':'kit_auth=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'},body:'OK'});
