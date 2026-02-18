
import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity("assets")
export class AssetType {
    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    createTs: Date
}
