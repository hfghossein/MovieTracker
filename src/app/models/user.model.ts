import { Movie } from './movie.model';

export interface User {
  username: string;
  password: string;
  role: 'admin' | 'user';
  myList?: Movie[];
}
