import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable} from "typeorm";
import {Category} from "./Category";
import {Lesson} from "./Lesson";

@Entity()
export class Course {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seqNo: number;

    @Column("text")
    url: string;

    @Column("text")
    iconUrl: string;

    @Column("text")
    description: string;

    @Column("text")
    longDescription: string;

    @Column("text")
    category: string;

    @Column()
    promo: boolean;

    @OneToMany(type => Lesson, lesson => lesson.course)
    lessons: Lesson[];
}
