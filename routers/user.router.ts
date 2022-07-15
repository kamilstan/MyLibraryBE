import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {ValidationError} from "../utils/errors";
import {hashPwd} from "../utils/has-pwd";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import {verifyJWT} from "../utils/verifyJWT";

export const userRouter = Router()

    .get('/search/:lastname?', async (req, res) => {
        const users = await UserRecord.findAll(req.params.lastname ?? '')
        res.json(users)
    })

    .get('/:id', async (req, res) => {
        const user = await UserRecord.getOne(req.params.id)
        res.json(user)
    })

    .post('/register', async (req, res) => {
        const user = new UserRecord({
            ...req.body,
            password: await hashPwd(req.body.password),
        })
        await user.insert()
        const {id, email} = user;
        res.json({id, email})
    })

    .patch('/login', async (req, res) => {
        const user = await UserRecord.getOneWithEmail(req.body.email);
        if(!user) {
            throw new ValidationError("There is no such user.")
        }

        if(hashPwd(req.body.password) !== user.password) {
            throw new ValidationError("Wrong password!")
        }

        const payload = {
            "email": user.email,
            "id": user.id,
        } ;

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET ,{expiresIn: '5m'});
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET ,{expiresIn: '1d'});
        user.currentTokenId = refreshToken === null ? null : refreshToken;
        await user.update();

        res.cookie('refreshToken', refreshToken, {
            // httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.json({accessToken, refreshToken});
    })


    .delete('/logout', async(req, res) => {

        const {refreshToken} = req.body;
        if(!refreshToken) {
            throw new ValidationError("There is no such token.")
        };
        const user = await UserRecord.getOneWithToken(refreshToken);
        if(!user) {
            throw new ValidationError("There is no such user.")
        }
        user.currentTokenId = null;
        await user.update();
        res.clearCookie('refreshToken');
        return res.sendStatus(200);

    })


    .delete('/:id', async (req, res) => {
        const user = await UserRecord.getOne(req.params.id);

        if(!user) {
            throw new ValidationError('There is no such user.')
        }
        await user.delete();
        res.end();
    })

    // .patch('/book/:userId', async (req, res) => {
    //     const user = await UserRecord.getOne(req.params.userId);
    //
    //     if (user === null) {
    //         throw new ValidationError('There is no such user.');
    //     }
    //
    //     const book = (req.body as SetBookForUserReq).bookId === '' ? null : await BookRecord.getOne(req.body.bookId);
    //
    //     if (book) {
    //         if (book.count <= await book.countGivenBooks()) {
    //             throw new ValidationError('The book is already taken.');
    //         }
    //     }
    //
    //     user.bookId = book === null ? null : book.id
    //
    //     await user.update();
    //
    //     res.json(user);
    // });

