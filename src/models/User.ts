
import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity("users")
export class User {
    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    createTs: Date

}
