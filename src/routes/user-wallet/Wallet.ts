import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createUser, getUserById, getUserList } from '../../data-access/UserRepository';
import { UserT } from '../../types/user/User';
import { getWalletBalanceById, getWalletById } from '../../data-access/WalletRepository';
import { WalletT } from '../../types/wallet/Wallet';
import { Wallet } from '../../models/Wallet';
import { initiateTransaction } from '../../services/Transaction';
import { getSystemWallet } from '../../services/SystemUser';

const router = express.Router({ mergeParams: true });


const getUserWalletBalanceRouter = async (req: Request, res: Response) => {
    try {
        const { userId, walletId }: { userId: string, walletId: string } = req.params as any;

        const wallet = await getWalletById(walletId);
        console.log("The wallet is ", wallet);
        if (!wallet?.assetId) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        if (wallet?.ownerId !== userId) {
            console.log("here", wallet.ownerId, userId)
            return res.status(404).json({ messsage: "wallet not found" })
        }

        const walletBalance = await getWalletBalanceById(walletId);
        return res.status(200).json({ balance: walletBalance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not get wallet balance" });
    }
}

const addUserBalanceRouter = async (req: Request, res: Response) => {
    try {
        const { userId, walletId }: { userId: string, walletId: string } = req.params as any;
        const { amount, transactionId }: { amount: number, transactionId: string } = req.body;

        if (!amount || typeof (amount) != 'number' || amount <= 0) {
            return res.status(400).json({ message: "Invalid body: amount" });
        }

        if (!transactionId || typeof (transactionId) != 'string') {
            return res.status(400).json({ message: "Invalid body: transactionId" });
        }
        const wallet: Wallet = (await getWalletById(walletId))!;
        if (!wallet?.assetId) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        if (wallet.ownerId != userId) {
            return res.status(404).json({ messsage: "wallet not found" })
        }

        const systemWallet = await getSystemWallet();

        const response = await initiateTransaction({
            fromWalletId: systemWallet.id,
            toWalletId: walletId,
            amount,
            transactionId
        })

        if ((response as any)?.duplicate) {
            return res.status(200).json({ duplicate: true, transactionId });
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not purchase credit" });
    }
}

const spendFromWalletRouter = async (req: Request, res: Response) => {
    try {

        const { userId, walletId }: { userId: string, walletId: string } = req.params as any;
        const amount = req.body.amount;

        if (!amount || typeof (amount) != 'number' || amount <= 0) {
            return res.status(400).json({ message: "Invalid body: amount" });
        }

        const wallet: Wallet = (await getWalletById(walletId))!;

        if (!wallet?.assetId) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        if (wallet.ownerId != userId) {
            return res.status(404).json({ messsage: "wallet not found" })
        }

        const userBalance = await getWalletBalanceById(walletId);

        if (userBalance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }


        const systemWallet = await getSystemWallet();
        const systemTransactionId = uuidv4()
        const response = await initiateTransaction({
            fromWalletId: walletId,
            toWalletId: systemWallet.id,
            amount,
            transactionId: systemTransactionId
        })

        if ((response as any)?.duplicate) {
            return res.status(200).json({ duplicate: true, transactionId: systemTransactionId });
        }

        return res.status(200).json(response);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not spend from wallet" })
    }
}

// const getBonusByUserIdRouter = async (req: Request, res: Response) => {
//     try {
//         const { userId, walletId }: { userId: string, walletId: string } = req.params as any;
//         const { reason, amount }: { reason: string, amount: number } = req.body;

//         if (!(reason.toLowerCase() == "referral")) {
//             return res.status(400).json({ message: "Invalid body: reason" });
//         }

//         const wallet: Wallet = (await getWalletById(walletId))!;
//         if (!wallet?.assetId) {
//             return res.status(404).json({ message: "Wallet not found" });
//         }
//         if (wallet.ownerId != userId) {
//             return res.status(404).json({ messsage: "wallet not found" })
//         }

//         const systemWallet = await getSystemWallet();
//         const systemTransactionId = "referral_" + uuidv4()
//         const response = await initiateTransaction({
//             fromWalletId: systemWallet.id,
//             toWalletId: walletId,
//             amount,
//             transactionId: systemTransactionId
//         })

//         if ((response as any)?.duplicate) {
//             return res.status(200).json({ duplicate: true, transactionId: systemTransactionId });
//         }

//         return res.status(200).json(response);

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Could not get referral bonus" })
//     }
// }

router.get("/:walletId/balance", getUserWalletBalanceRouter)
router.post("/:walletId/top-up", addUserBalanceRouter)
router.post("/:walletId/purchase", spendFromWalletRouter)
// router.post("/:walletId/bonus", getBonusByUserIdRouter)

export default router;