
import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity("ledger")
export class LedgerEntry {
    @PrimaryColumn()
    id: string

    @Column()
    transactionId: string

    @Column()
    walletId: string

    @Column("float")
    amount: number

    @Column()
    createTs: Date
}
