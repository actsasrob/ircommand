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

    @Column("text", { nullable: true })
    alexaIntent: string;

    @Column("text", { nullable: true })
    alexaAction: string;

    @Column("text", { nullable: true })
    alexaComponent: string;

    @Column({ nullable: true })
    alexaDigit: string;

    @Column({ default: false })
    alexaToggle: boolean;

    @ManyToOne(type => User, user => user.IRSignals)
    user: User;
}
