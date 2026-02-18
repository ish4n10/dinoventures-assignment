import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity("transaction_requests")
export class TransactionRequest {
    @PrimaryColumn()
    id: string

    @Column()
    transactionId: string

    @Column()
    createTs: Date
}