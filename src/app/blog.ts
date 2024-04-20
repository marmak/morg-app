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
  blog_id: number;
  blog_name: string;
  post_title: string;
  post_link: string;
  item_count: number;
  published: Date;
  status: number;
}


export interface  BlogInfo {
  blog: any,
  last_read: Date,
  items: any[]
};

export interface LastReadUpdate {
  blogId: number,
  lastRead: Date
}
