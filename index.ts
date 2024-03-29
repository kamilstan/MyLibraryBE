import express, {Router} from "express";
import cors from "cors";
import "express-async-errors";
import {handleError, ValidationError} from "./utils/errors";
import rateLimit from "express-rate-limit";
import {bookRouter} from "./routers/book.router";
import {userRouter} from "./routers/user.router";
import cookieParser from "cookie-parser";



const app = express()

app.use(cors({
    origin: "http://localhost:3000",
}))
app.use(express.json());
app.use(cookieParser());

app.use(rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes))
}));

const router = Router();

router.use('/book', bookRouter);
router.use('/user', userRouter);

app.use('/api', router);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log("Listening on port http://localhost:3001")
})