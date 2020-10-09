import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Course} from "./Course";

@Entity()
export class Lesson {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    description: string;

    @Column()
    duration: string;

    @Column()
    seqNo: number;

    @ManyToOne(type => Course, course => course.lessons)
    course: Course;

}
