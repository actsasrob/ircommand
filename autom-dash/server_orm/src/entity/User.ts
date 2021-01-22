import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {RemoteDash} from "./RemoteDash";
import {LearnIR} from "./LearnIR";
import {IRSignal} from "./IRSignal";

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    passwordDigest: string;

    @Column()
    email: string;

    @OneToMany(type => LearnIR, learnIR => learnIR.user)
    learnIRs: LearnIR[];

    @OneToMany(type => IRSignal, IRSignal => IRSignal.user)
    IRSignals: IRSignal[];

    @OneToMany(type => RemoteDash, remoteDash => remoteDash.user)
    remoteDashes: RemoteDash[];
}
