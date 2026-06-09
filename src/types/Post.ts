export interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  imageUrl?: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;

  category?: string | null;
  categoryId?: number | null;
  categoryRel?: {
    id: number;
    name: string;
  } | null;
}