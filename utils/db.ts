import {createPool} from "mysql2/promise";
import 'dotenv/config';

export const pool = createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    namedPlaceholders: true,
    decimalNumbers: true,
})