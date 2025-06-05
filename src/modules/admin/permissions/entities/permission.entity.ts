import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    nombre: string;

    @Column({nullable: true})
    descripcion: string;

    @Column({nullable: true})
    action: string;

    @Column({nullable: true})
    subject: string;

}
