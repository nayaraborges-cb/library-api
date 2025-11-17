import { IsDate, IsNumber, IsString } from "class-validator"

export class CreateBookDto {
    @IsNumber()
    readonly id: number;

    @IsString()
    readonly title: string;

    @IsString()
    readonly author: string;

    @IsString()
    readonly genre: string;

    @IsNumber()
    readonly publication: number;

    @IsString()
    readonly resume: string;
}
