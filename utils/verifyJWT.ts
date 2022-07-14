import jwt from "jsonwebtoken";
import 'dotenv/config';
import {NextFunction, Request, Response} from "express";

export const verifyJWT = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    console.log(authHeader); //Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, data) => {
            if(err) return res.sendStatus(403);
            res.locals.jwt = data;
            next();
        }
    )
}