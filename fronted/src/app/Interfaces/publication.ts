export interface Publication {
  id: number;
  user_id: number;
  time_posted: Date;
  content: string | null;
  image: string | null;
}
