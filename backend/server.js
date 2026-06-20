import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env.local"
});

const app = express();

app.use(cors());

app.use(express.json());

console.log(
  "Database Password Loaded:",
  process.env.REACT_APP_DB_PASSWORD
    ? "YES"
    : "NO"
);

const pool = new pg.Pool({

  host:
    "localhost",

  port:
    5432,

  database:
    "mi_garhwali",

  user:
    "postgres",

  password:
    process.env.REACT_APP_DB_PASSWORD

});

pool
.connect()

.then(()=>{

console.log(
"PostgreSQL Connected"
);

})

.catch((err)=>{

console.log(
"DB Error:",
err
);

});



app.get(
"/",

(req,res)=>{

res.send(
"Backend Alive"
);

}
);



app.post(
"/users",

async(req,res)=>{

try{

console.log(
"Incoming:",
req.body
);

const {

google_id,
email,
display_name="",
profile_pic=""

}
=
req.body;

if(
!google_id
||
!email
){

return res
.status(400)
.send(
"Missing fields"
);

}

await pool.query(

`

INSERT INTO users(

google_id,
email,
display_name,
profile_pic

)

VALUES(

$1,
$2,
$3,
$4

)

ON CONFLICT(email)

DO UPDATE

SET

display_name=
EXCLUDED.display_name,

profile_pic=
EXCLUDED.profile_pic

`,

[
google_id,
email,
display_name,
profile_pic
]

);

console.log(
"Inserted"
);

res.send(
"ok"
);

}

catch(err){

console.log(
err
);

res
.status(500)
.send(
err.message
);

}

});



app.listen(
5000,

()=>{

console.log(
"Backend running on port 5000"
);

});