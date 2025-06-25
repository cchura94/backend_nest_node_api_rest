import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntidadComercial } from "../../entidad-comercial/entities/entidad-comercial.entity";
import { User } from "../../users/entities/user.entity";
import { Movimiento } from "./movimiento.entity";

@Entity('notas')
export class Nota {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique: true})
    codigo_nota: string;

    @Column({type: 'date'})
    fecha_emision: Date;

    @Column()
    tipo_nota: string; // 'compra' || 'venta' 

    @ManyToOne(() => EntidadComercial, {eager: true})
    entidad_comercial: EntidadComercial;

    @ManyToOne(() => User, {eager: true})
    user: User;

    @Column({type: 'decimal', precision: 12, scale: 2, nullable: true})
    subtotal: number;

    @Column({type: 'decimal', precision: 12, scale: 2, nullable: true})
    impuestos: number;
    
    @Column({type: 'decimal', precision: 12, scale: 2, nullable: true})
    descuento_total: number;

    @Column({type: 'decimal', precision: 12, scale: 2})
    total_calculado: number;

    @Column({length: 50})
    estado_nota: string;

    @Column({type: 'text', nullable: true})
    observaciones: string;

    // movimientos    
    @OneToMany(() => Movimiento, mov => mov.nota)
    movimientos: Movimiento[];

}
