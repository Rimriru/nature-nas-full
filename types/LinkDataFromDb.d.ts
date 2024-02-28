type Group = 'about' | 'structure' | 'news' | 'publications' | 'research' | 'service';

type Link = {
  _id?: String;
  title: String;
  to: String;
  group: Group;
  route?: String;
};

export type { Link, Group };
