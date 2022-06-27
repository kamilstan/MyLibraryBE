import {createPool} from "mysql2/promise";

export const pool = createPool({
    host: "localhost" ,
    user: "root" ,
    password: "root",
    database: "my_library",
    namedPlaceholders: true,
    decimalNumbers: true,
})