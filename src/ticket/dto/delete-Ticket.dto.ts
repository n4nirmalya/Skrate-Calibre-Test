import { IsNotEmpty, IsString } from "class-validator";

export class DeleteTicketDto {
    @IsString()
    @IsNotEmpty()
    readonly ticketId: string;
}