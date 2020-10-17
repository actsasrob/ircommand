import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";
import {User} from "./User";
import {RemoteDash} from "./RemoteDash";

@Entity()
export class LearnIR {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seqNo: number;

    @Column()
    location: string;

    @Column()
    address: string;

    @ManyToOne(type => User, user => user.learnIRs)
    user: User;

    @OneToMany(type => RemoteDash, remoteDash => remoteDash.learnIR)
    remoteDashes: RemoteDash[];
}
