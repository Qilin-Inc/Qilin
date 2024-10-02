import { Injectable } from '@nestjs/common';
import { CreateClerkAuthDto } from './dto/create-clerk-auth.dto';
import { UpdateClerkAuthDto } from './dto/update-clerk-auth.dto';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthService {

  async getUser() {
    const user = await clerkClient.users.getUserList();
    return user;
  }
  create(createClerkAuthDto: CreateClerkAuthDto) {
    return 'This action adds a new clerkAuth';
  }

  findAll() {
    return `This action returns all clerkAuth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clerkAuth`;
  }

  update(id: number, updateClerkAuthDto: UpdateClerkAuthDto) {
    return `This action updates a #${id} clerkAuth`;
  }

  remove(id: number) {
    return `This action removes a #${id} clerkAuth`;
  }
}
