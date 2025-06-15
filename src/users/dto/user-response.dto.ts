import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  full_name: string;
  organization: string;
  role: string;
  bio: string;
  avatar_url: string;
  favorite_genres: string[];
  created_at: Date;
  updated_at: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.full_name = user.full_name;
    this.organization = user.organization;
    this.role = user.role;
    this.bio = user.bio;
    this.avatar_url = user.avatar_url;
    this.favorite_genres = user.favorite_genres;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
  }
}
