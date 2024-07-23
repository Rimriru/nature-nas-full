interface ILink {
  title: string;
  to: string;
  route?: string;
  couldBeEdited: boolean;
}

interface Link extends ILink {
  _id: string;
}

interface LinkGroup {
  _id: string;
  title: string;
  group: string;
  links: Link[];
}

export type { ILink, Link, LinkGroup };
