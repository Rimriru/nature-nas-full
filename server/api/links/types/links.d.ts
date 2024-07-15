interface NewLinkRequestBody {
  title: string;
  to: string;
  groupId: string;
  type?: 'param' | '';
}

interface PatchLinkRequestBody {
  title: string;
  to: string;
  type?: 'param' | '';
}

export { NewLinkRequestBody, PatchLinkRequestBody };
