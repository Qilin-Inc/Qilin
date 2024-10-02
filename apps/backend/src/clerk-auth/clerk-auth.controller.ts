import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClerkAuthService } from './clerk-auth.service';
import { CreateClerkAuthDto } from './dto/create-clerk-auth.dto';
import { UpdateClerkAuthDto } from './dto/update-clerk-auth.dto';
import { ClerkAuthGuard } from './clerk-auth.gaurd';

@Controller('clerk-auth')
export class ClerkAuthController {
  constructor(private readonly clerkAuthService: ClerkAuthService) {}

  @Get()
  @UseGuards(ClerkAuthGuard)
  async getUser() {
    return this.clerkAuthService.getUser();
  }

  @Post()
  create(@Body() createClerkAuthDto: CreateClerkAuthDto) {
    return this.clerkAuthService.create(createClerkAuthDto);
  }

  @Get()
  findAll() {
    return this.clerkAuthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clerkAuthService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClerkAuthDto: UpdateClerkAuthDto) {
    return this.clerkAuthService.update(+id, updateClerkAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clerkAuthService.remove(+id);
  }
}
