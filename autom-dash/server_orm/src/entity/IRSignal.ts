import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User";

@Entity()
export class IRSignal {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seqNo: number;

    @Column("text")
    signal: string;

    @Column("text")
    iconUrl: string;

    @Column()
    name: string;

    @ManyToOne(type => User, user => user.remoteDashes)
    user: User;
}
