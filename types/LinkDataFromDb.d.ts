type Link = {
  _id?: string;
  title: string;
  to: string;
  route?: string;
};

interface LinkGroup {
  _id: string;
  title: string;
  group: string;
  links: Link[];
}

export type { Link, LinkGroup };
