import pg from "pg";

const pool =
new pg.Pool({

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

export default pool;