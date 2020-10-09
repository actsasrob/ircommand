import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User";

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

    @ManyToOne(type => User, user => user.remoteDashes)
    user: User;
}
