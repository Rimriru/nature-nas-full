interface ILink {
  title: string;
  to: string;
  route?: string;
  couldBeEdited: boolean;
  type?: 'param' | '';
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

interface SidebarLink extends Link {
  linkMgraphs?: number;
}

export type { ILink, Link, LinkGroup, SidebarLink };
