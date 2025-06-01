import { UserModel } from "../../data";
import { CustomError, RegisterUserDto } from "../../domain";

export class AuthService {
  constructor() {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;

    const existUser = await UserModel.findOne({ email: email });
    if (existUser) throw CustomError.badRequest("Email already exist");

    return 'todo ok!'
  }
}
