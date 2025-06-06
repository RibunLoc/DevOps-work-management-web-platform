import { UpdateUserDto } from "./update-user.dto";

export interface AdminUpdateUserDto extends UpdateUserDto {
  role?: string;
}