import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserCvEntity } from '@users/entities';

@Injectable()
export class UserCvGetRepository {
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
}
