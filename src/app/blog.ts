export interface BlogResult {
  blogs: Blog[];
  items: BlogItem[];
}

export interface Blog {
  blog_id: number;
  blog_name: string;
  item_count: number;
}
export interface BlogItem {
  id: number;
  blog_name: string;
  post_title: string;
  item_count: number;
}
