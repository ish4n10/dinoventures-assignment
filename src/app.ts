
import "dotenv/config";
import "reflect-metadata";
import express, { Request, Response } from 'express';
import { dbSource } from "./data-access/Database";
import userRouter from "./routes/User";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.get('/', (req: Request, res: Response) => {
    res.send('test');
});


app.use("/user", userRouter);


dbSource.initialize().then(async () => {
    app.listen(port, () => {
        console.log(`Server is running`);
    });
}).catch(error => console.log(error));
