import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

interface User {
  id: number;
  username: string;
  email: string;
  // Add other demographic fields here
  premium_user: boolean;
}

@Injectable()
export class AppService {
  private users: User[] = [];

  // Get all users (Super Admin only)
  getAllUsers(): User[] {
    return this.users;
  }

  // Get user by ID (Super Admin, or own profile for Premium/Regular users)
  getUserById(id: number, currentUser: User): User {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (currentUser.id !== user.id && !this.isSuperAdmin(currentUser)) {
      throw new ForbiddenException('Access denied');
    }
    return user;
  }

  // Create user (Super Admin only)
  createUser(userData: Omit<User, 'id'>, currentUser: User): User {
    if (!this.isSuperAdmin(currentUser)) {
      throw new ForbiddenException('Only Super Admin can create users');
    }
    const newUser = { ...userData, id: this.users.length + 1 };
    this.users.push(newUser);
    return newUser;
  }

  // Update user (Super Admin for all, Premium/Regular for own profile)
  updateUser(id: number, userData: Partial<User>, currentUser: User): User {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    if (!this.isSuperAdmin(currentUser) && currentUser.id !== id) {
      throw new ForbiddenException('Access denied');
    }

    if (!this.isSuperAdmin(currentUser) && 'premium_user' in userData) {
      throw new ForbiddenException('Cannot update premium status');
    }

    this.users[userIndex] = { ...this.users[userIndex], ...userData };
    return this.users[userIndex];
  }

  // Delete user (Super Admin only)
  deleteUser(id: number, currentUser: User): void {
    if (!this.isSuperAdmin(currentUser)) {
      throw new ForbiddenException('Only Super Admin can delete users');
    }
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(userIndex, 1);
  }

  // Helper method to check if user is Super Admin
  private isSuperAdmin(user: User): boolean {
    // Implement your logic to determine if a user is a Super Admin
    // For example, you could have a role field in the User interface
    return false; // Placeholder
  }
}
