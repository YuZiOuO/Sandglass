import { Column, PrimaryColumn } from "typeorm";

export class GoogleAuth {
    @PrimaryColumn()
    uid:string

    @Column()
    googleRefreshToken:string
}
