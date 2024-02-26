type Group = 'about' | 'structure' | 'news' | 'publications' | 'research' | 'service';

type Link = {
  title: String;
  to: String;
  group: Group;
  route?: String;
  createdByAdmin: Boolean;
};

export type { Link, Group };
