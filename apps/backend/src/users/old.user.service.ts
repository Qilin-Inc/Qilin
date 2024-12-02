import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './user.dto';

@Injectable()
export class userServiceOld {
  private users = [
    {
      place: 1,
      name: 'Rens',
      stats: '42 - 21',
      winrate: '64%',
      kda: '1.23',
      rank: 'Challenger',
    },
    {
      place: 2,
      name: 'Edwin',
      stats: '42 - 21',
      winrate: '64%',
      kda: '1.23',
      rank: 'Challenger',
    },
    {
      place: 3,
      name: 'FlyWithMe',
      stats: '20 - 21',
      winrate: '49%',
      kda: '5.23',
      rank: 'Challenger',
    },
    {
      place: 4,
      name: 'BigBob007',
      stats: '20 - 21',
      winrate: '49%',
      kda: '5.23',
      rank: 'Grandmaster',
    },
  ];

  getusers() {
    return this.users;
  }

  createuser(userDto: CreateUserDto) {
    const newuser = { place: this.users.length + 1, ...userDto };
    this.users.push(newuser);
    return newuser;
  }
}
