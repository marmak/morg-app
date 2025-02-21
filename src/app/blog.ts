export interface BlogResult {
  blogs: Blog[];
  items: BlogItem[];
}

// blog and blog item are about the same thing
// we have Blog and BlogItem
export interface Blog {
  blog_id: number;
  blog_name: string;
  item_count: number;
}

// TODO: mess?
export interface BlogItem {
  id: number;
  blog_id: number;
  blog_name: string;
  post_title: string;
  post_link: string;
  item_count: number;
  published: Date;
  status: number;
  unread: boolean;
  link: string;
  title: string;
}


export interface BlogInfo {
  blog: any,
  last_read: Date,
  items: BlogItem[]
}

export interface LastReadUpdate {
  blogId: number,
  lastRead: Date
}

export type BlogSearchResult = {
  id: number,
  name: string
}
