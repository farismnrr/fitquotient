import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserCvEntity } from '@users/entities';
import { IUserCvRepositoryContext } from '@users/context/user-cvs';

@Injectable()
export class UserCvGetRepository implements Partial<IUserCvRepositoryContext> {
  private userCvRepository: Repository<UserCvEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.userCvRepository = this.dataSource.getRepository(UserCvEntity);
  }

  async getUserCvById(cvId: string): Promise<UserCvEntity | null> {
    const userCv = await this.userCvRepository.findOne({
      where: { id: cvId, isActive: true },
    });

    return userCv;
  }

  async getUserCvsByUserId(userId: string): Promise<UserCvEntity[]> {
    const cvs = await this.userCvRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return cvs || [];
  }
}
