import { DataSource, Repository } from 'typeorm';
import  {Admin}  from './entities/admin.entity';


export class AdminRepository extends Repository<Admin> {

    // constructor(dataSource: DataSource) {
    //     super(Admin, dataSource.createEntityManager());
    // }
  async findByEmail(email: string): Promise<Admin | undefined> {
    return this.findOne({ where: { email } });
  }

}
