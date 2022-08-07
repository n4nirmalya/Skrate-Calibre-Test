import { IsString, IsNotEmpty } from "class-validator";

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;
    @IsString()
    @IsNotEmpty()
    readonly description: string;
    @IsString()
    @IsNotEmpty()
    readonly priority: string;
}