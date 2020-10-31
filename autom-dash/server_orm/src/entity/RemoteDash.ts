import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User";
import {LearnIR} from "./LearnIR";

@Entity()
export class RemoteDash {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seqNo: number;

    @Column("text")
    layout: string;

    @Column("text")
    components: string;

    @Column("text")
    iconUrl: string;

    @Column()
    name: string;

    @ManyToOne(type => LearnIR, learnIR => learnIR.remoteDashes)
    learnIR: LearnIR;;

    @ManyToOne(type => User, user => user.remoteDashes)
    user: User;
}
