import {Router} from "express";
import {UserRecord} from "../records/user.record";


export const userRouter = Router()

    .get('/search/:lastname?', async (req, res) => {
        const users = await UserRecord.findAll(req.params.lastname ?? '')
        res.json(users)
    })

    .get('/:id', async (req, res) => {
        const user = await UserRecord.getOne(req.params.id)
        res.json(user)
    })

    .post('/', async (req, res) => {
        const user = new UserRecord(req.body);
        await user.insert()
        res.json(user)
    })

