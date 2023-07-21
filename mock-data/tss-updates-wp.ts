import { Post } from "../models/WPPost";

export const tssUpdatesWp: Post[] = [
  {
    id: 1,
    date: "2023-07-19",
    date_gmt: "2023-07-19",
    guid: {
      rendered: "https://example.com/post/1"
    },
    modified: "2023-07-19",
    modified_gmt: "2023-07-19",
    slug: "post-1",
    status: "publish",
    type: "post",
    link: "https://example.com/post/1",
    title: {
      rendered: "Post 1 Title"
    },
    content: {
      rendered: "This is the content of post 1.",
      protected: false
    },
    excerpt: {
      rendered: "This is the excerpt of post 1.",
      protected: false
    },
    author: 1,
    featured_media: 1,
    comment_status: "open",
    ping_status: "open",
    sticky: false,
    template: "",
    format: "standard",
    meta: [],
    categories: [1, 19],
    tags: [20],
    _links: {
      self: [
        {
          href: "https://example.com/wp-json/wp/v2/posts/1"
        }
      ],
      collection: [
        {
          href: "https://example.com/wp-json/wp/v2/posts"
        }
      ],
      about: [
        {
          href: "https://example.com/wp-json/wp/v2/types/post"
        }
      ],
      author: [
        {
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/users/1"
        }
      ],
      replies: [
        {
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/comments?post=1"
        }
      ],
      "version-history": [
        {
          count: 2,
          href: "https://example.com/wp-json/wp/v2/posts/1/revisions"
        }
      ],
      "predecessor-version": [
        {
          id: 0,
          href: "https://example.com/wp-json/wp/v2/posts/1/revisions/0"
        }
      ],
      "wp:attachment": [],
      "wp:term": [
        {
          taxonomy: "category",
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/categories?post=1"
        },
        {
          taxonomy: "post_tag",
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/tags?post=1"
        }
      ],
      curies: [
        {
          name: "wp",
          href: "https://example.com/wp-json/wp/v2/rels/{rel}",
          templated: true
        }
      ]
    }
  },
  {
    id: 2,
    date: "2023-07-18",
    date_gmt: "2023-07-18",
    guid: {
      rendered: "https://example.com/post/2"
    },
    modified: "2023-07-18",
    modified_gmt: "2023-07-18",
    slug: "post-2",
    status: "publish",
    type: "post",
    link: "https://example.com/post/2",
    title: {
      rendered: "Post 2 Title"
    },
    content: {
      rendered: "This is the content of post 2.",
      protected: false
    },
    excerpt: {
      rendered: "<p>This is the excerpt of post 2.</p>",
      protected: false
    },
    author: 2,
    featured_media: 2,
    comment_status: "open",
    ping_status: "open",
    sticky: false,
    template: "",
    format: "standard",
    meta: [],
    categories: [19],
    tags: [20, 40],
    _links: {
      self: [
        {
          href: "https://example.com/wp-json/wp/v2/posts/2"
        }
      ],
      collection: [
        {
          href: "https://example.com/wp-json/wp/v2/posts"
        }
      ],
      about: [
        {
          href: "https://example.com/wp-json/wp/v2/types/post"
        }
      ],
      author: [
        {
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/users/2"
        }
      ],
      replies: [
        {
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/comments?post=2"
        }
      ],
      "version-history": [
        {
          count: 2,
          href: "https://example.com/wp-json/wp/v2/posts/2/revisions"
        }
      ],
      "predecessor-version": [
        {
          id: 0,
          href: "https://example.com/wp-json/wp/v2/posts/2/revisions/0"
        }
      ],
      "wp:attachment": [],
      "wp:term": [
        {
          taxonomy: "category",
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/categories?post=2"
        },
        {
          taxonomy: "post_tag",
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/tags?post=2"
        }
      ],
      curies: [
        {
          name: "wp",
          href: "https://example.com/wp-json/wp/v2/rels/{rel}",
          templated: true
        }
      ]
    }
  },
  {
    id: 3,
    date: "2023-07-17",
    date_gmt: "2023-07-17",
    guid: {
      rendered: "https://example.com/post/3"
    },
    modified: "2023-07-17",
    modified_gmt: "2023-07-17",
    slug: "post-3",
    status: "publish",
    type: "post",
    link: "https://example.com/post/3",
    title: {
      rendered: "Post 3 Title"
    },
    content: {
      rendered: "This is the content of post 3.",
      protected: false
    },
    excerpt: {
      rendered: "This is the excerpt of post 3.",
      protected: false
    },
    author: 1,
    featured_media: 3,
    comment_status: "open",
    ping_status: "open",
    sticky: false,
    template: "",
    format: "standard",
    meta: [],
    categories: [2, 3],
    tags: [10, 30],
    _links: {
      self: [
        {
          href: "https://example.com/wp-json/wp/v2/posts/3"
        }
      ],
      collection: [
        {
          href: "https://example.com/wp-json/wp/v2/posts"
        }
      ],
      about: [
        {
          href: "https://example.com/wp-json/wp/v2/types/post"
        }
      ],
      author: [
        {
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/users/1"
        }
      ],
      replies: [
        {
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/comments?post=3"
        }
      ],
      "version-history": [
        {
          count: 2,
          href: "https://example.com/wp-json/wp/v2/posts/3/revisions"
        }
      ],
      "predecessor-version": [
        {
          id: 0,
          href: "https://example.com/wp-json/wp/v2/posts/3/revisions/0"
        }
      ],
      "wp:attachment": [],
      "wp:term": [
        {
          taxonomy: "category",
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/categories?post=3"
        },
        {
          taxonomy: "post_tag",
          embeddable: true,
          href: "https://example.com/wp-json/wp/v2/tags?post=3"
        }
      ],
      curies: [
        {
          name: "wp",
          href: "https://example.com/wp-json/wp/v2/rels/{rel}",
          templated: true
        }
      ]
    }
  }
];
