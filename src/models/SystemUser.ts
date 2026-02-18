
import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity("system_users")
export class SystemUser {
    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    createTs: Date
}
