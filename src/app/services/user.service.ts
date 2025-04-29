// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKey = 'users';
    // Define the BehaviorSubject to hold the user list
    private usersSubject = new BehaviorSubject<User[]>(this.getUsers());
    // Expose it as an observable so other components can subscribe
    users$ = this.usersSubject.asObservable();

  constructor() {
    // Initialize default admin user if not already set
    const users = this.getUsers();
    if (users.length === 0) {
      const defaultAdmin: User = {
        username: 'admin',
        password: 'admin123', // Note: For production, use secure password handling
        role: 'admin',
        myList: []
      };
      this.saveUsers([defaultAdmin]);
    }
  }

  getUsers(): User[] {
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  addUser(newUser: User): boolean {
    const users = this.getUsers();
    if (
      newUser.username.toLowerCase() === 'admin' ||
      users.some((u) => u.username.toLowerCase() === newUser.username.toLowerCase())
    ) {
      return false;
    }

    users.push(newUser);
    this.saveUsers(users);
    this.usersSubject.next(users); // Emit updated user list
    return true;
  }


  updateUser(updatedUser: User): void {
    let users = this.getUsers();
    users = users.map(user => user.username === updatedUser.username ? updatedUser : user);
    this.saveUsers(users);
  }

  removeUser(username: string): void {
    let users = this.getUsers();
    users = users.filter(user => user.username !== username);
    this.saveUsers(users);
  }

  getUserByUsername(username: string): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.username === username);
  } 
  
}


