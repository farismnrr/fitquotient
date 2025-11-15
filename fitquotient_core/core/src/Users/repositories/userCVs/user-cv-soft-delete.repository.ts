import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserCvEntity } from '@users/entities';
import { IUserCvRepositoryContext } from '@users/context/user-cvs';

@Injectable()
export class UserCvSoftDeleteRepository
  implements Partial<IUserCvRepositoryContext>
{
  private userCvRepository: Repository<UserCvEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.userCvRepository = this.dataSource.getRepository(UserCvEntity);
  }

  async softDeleteUserCv(cvId: string): Promise<boolean> {
    const result = await this.userCvRepository.update(
      { id: cvId, isActive: true },
      { isActive: false },
    );

    return (result.affected ?? 0) > 0;
  }
}
