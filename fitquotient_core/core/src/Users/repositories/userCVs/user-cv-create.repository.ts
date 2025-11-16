import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserCvEntity } from '@users/entities';
import { CreateUserException } from '../repository.error';
import { IUserCvRepositoryContext } from '@users/context/user-cvs';

@Injectable()
export class UserCvCreateRepository
  implements Partial<IUserCvRepositoryContext>
{
  private userCvRepository: Repository<UserCvEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.userCvRepository = this.dataSource.getRepository(UserCvEntity);
  }

  async createUserCv(userCv: UserCvEntity): Promise<string> {
    const userCvQuery = this.userCvRepository.create(userCv);
    const result = await this.userCvRepository.save(userCvQuery);

    if (!result?.id) {
      throw new CreateUserException();
    }

    return result.id;
  }
}
