import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {BookRecord} from "../records/book.record";
import {ValidationError} from "../utils/errors";
import {SetBookForUserReq} from "../types"
import {hashPwd} from "../utils/has-pwd";
import jwt from "jsonwebtoken";

export const userRouter = Router()

    .get('/search/:lastname?',  async (req, res) => {
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
            email: user.email,
            id: user.id,
        }
        const accessToken = jwt.sign(payload, "secretKey",{expiresIn: '30s'});
        const refreshToken = jwt.sign(payload, "secretKey",{expiresIn: '1d'});
        user.currentTokenId = refreshToken === null ? null : refreshToken;
        await user.update();
        console.log(user);

        res.cookie('refreshToken', refreshToken, {
            // httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.json({accessToken});
    })

    .delete('/logout', async(req, res) => {

        const accessToken = req.cookies.accessToken;
        if(!accessToken) {
            throw new ValidationError("There is no such token.")
        };
        const user = await UserRecord.getOneWithToken(accessToken);
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

