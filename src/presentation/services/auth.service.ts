import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";

export class AuthService {
  constructor() {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest("Email already exist");
    try {
      const user = new UserModel(registerUserDto);
      //*Encriptar la contraseña
      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();
      //*JWT
      const { password, ...userEntity } = UserEntity.fromObject(user);
      return {
        user: userEntity,
        token: "ABC",
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest("User not exist");

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );
    if (!isMatching) throw CustomError.badRequest("Password is not valid");

    const { password, ...rest } = UserEntity.fromObject(user);

    return {
      user: rest,
      token: "ABC",
    };
  }
}
