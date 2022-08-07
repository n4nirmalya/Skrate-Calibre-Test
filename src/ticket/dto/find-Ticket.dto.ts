import { IsNotEmpty, IsString } from "class-validator";

export class FindByStatusDto {
    @IsString()
    @IsNotEmpty()
    readonly status: string;
}
export class FindByTitleDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;
}
export class FindByPriorityDto {
    @IsString()
    @IsNotEmpty()
    readonly priority: string;
}
export class FindById {
    @IsString()
    @IsNotEmpty()
    readonly _id: string;
}

