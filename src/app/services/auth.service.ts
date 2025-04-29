import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs'; // Import BehaviorSubject to track changes

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User | null = null;
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();  // Observable to emit changes

  constructor(private userService: UserService) {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.currentUserSubject.next(this.currentUser); // Notify the current value when initialized
    }
  }

  login(username: string, password: string): boolean {
    // Allow hardcoded admin
    if (username === 'admin' && password === 'admin') {
      const adminUser: User = {
        username: 'admin',
        password: 'admin',
        role: 'admin',
        myList: []
      };
      this.currentUser = adminUser;
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      this.currentUserSubject.next(adminUser);
      return true;
    }
  
    const users = this.userService.getUsers(); 
    const user = users.find(
      u =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password
    );
  
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
  
    return false;
  }
  
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null); // Notify that user has logged out
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  updateCurrentUser(updatedUser: User): void {
    const users = this.userService.getUsers();
    const index = users.findIndex(u => u.username === updatedUser.username);

    if (index !== -1) {
      users[index] = updatedUser;
      this.userService.saveUsers(users);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUser = updatedUser;
      this.currentUserSubject.next(updatedUser); // Notify subscribers of updated user
    }
  }

  // Notify components when myList changes
  notifyUserListChange(): void {
    this.currentUserSubject.next(this.currentUser); // Re-emits the current user data
  }

}
