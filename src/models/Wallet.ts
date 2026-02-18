
import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity("wallets")
export class Wallet {
    @PrimaryColumn()
    id: string

    @Column()
    ownerId: string

    @Column()
    ownerType: string

    @Column()
    assetId: string

    @Column()
    createTs: Date
}
