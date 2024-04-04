type Link = {
  _id?: String;
  title: String;
  to: String;
  route?: String;
};

interface LinkGroup {
  _id: string;
  title: string;
  group: string;
  links: Link[];
}

export type { Link, LinkGroup };
