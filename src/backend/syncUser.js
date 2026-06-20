export async function syncUser(user){

if(!user)
return;

try{

console.log(
"RAW USER:",
user
);

const payload={

google_id:

user.google_id ||

user.email ||

"",


email:

user.email ||

"",


display_name:

user.name ||

user.displayName ||

"",


profile_pic:

user.avatar ||

user.photoURL ||

""

};

console.log(
"Sending payload:",
payload
);

const res=

await fetch(

"http://localhost:5000/users",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:
JSON.stringify(
payload
)

}

);

console.log(
await res.text()
);

}

catch(err){

console.log(
err
);

}

}