import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../model/user.model';

@Injectable()
export class UserDao {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findById(idUser: number): Promise<User | null> {
    return this.userModel.findByPk(idUser);
  }

  async findByUuid(uuid: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { uuid },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userModel.create(user);
  }

  async update(idUser: number, user: Partial<User>): Promise<number> {
    const [affectedRows] = await this.userModel.update(user, {
      where: { idUser },
    });

    return affectedRows;
  }

  async delete(idUser: number): Promise<void> {
    await this.userModel.destroy({
      where: { idUser },
    });
  }
}
