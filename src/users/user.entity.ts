import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'username', type: 'character varying', length: 150 })
    username: string;

    @Column({ name: 'email', type: 'character varying' })
    email: string;

    @Column({ name: 'password', type: 'character varying', nullable: true })
    password: string;

    @CreateDateColumn()
    createdAt: any
}