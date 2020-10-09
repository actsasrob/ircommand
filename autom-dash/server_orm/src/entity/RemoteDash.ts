import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User";

@Entity()
export class RemoteDash {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seqNo: number;

    @Column("text")
    layout: string;

    @Column("text")
    iconUrl: string;

    @Column()
    name: string;

    @ManyToOne(type => User, user => user.remoteDashes)
    user: User;
}
