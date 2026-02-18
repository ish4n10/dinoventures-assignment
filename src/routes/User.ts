import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createUser, createUserWithManager, getUserById, getUserList } from '../data-access/UserRepository';
import { UserT } from '../types/user/User';
import walletRouter from './user-wallet/Wallet';
import { getWalletsByOwnerId } from '../data-access/WalletRepository';
import { executeTransactionWithManager, initiateTransaction } from '../services/Transaction';
import { getSystemWallet } from '../services/SystemUser';
import { dbSource } from '../data-access/Database';


const router = express.Router({ mergeParams: true });

const addUserRouter = async (req: Request, res: Response) => {
    try {
        const { name, referralUserId, referralWalletId } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const user = await dbSource.transaction(async (manager) => {
            const newUser = await createUserWithManager(manager, {
                id: uuidv4(),
                name,
                createTs: new Date(),
            });

            if (referralUserId && referralWalletId) {
                const systemWallet = await getSystemWallet();
                await executeTransactionWithManager(manager, {
                    fromWalletId: systemWallet.id,
                    toWalletId: referralWalletId,
                    amount: 100,
                    transactionId: "referral_" + uuidv4()
                });
            }

            return newUser;
        });

        return res.status(201).json(user)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Could not create user" })
    }
}

const getUserByIdRouter = async (req: Request, res: Response) => {
    try {
        const userId: string = req.params.userId as string;
        const user: UserT | null = await getUserById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const userWalletList = await getWalletsByOwnerId(userId, "user");
        const response = { ...user, wallets: userWalletList }
        return res.status(200).json(response)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Could not get user" })
    }
}

const getUserListRouter = async (req: Request, res: Response) => {
    try {
        const userList = await getUserList();
        return res.status(200).json({ users: userList })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not get user list" })
    }
}
router.get("/", getUserListRouter)

router.post("/", addUserRouter)
router.get("/:userId", getUserByIdRouter)
router.use("/:userId/wallet", walletRouter)

export default router;

