interface NewLinkRequestBody {
  title: string;
  to: string;
  groupId: string;
}

interface PatchLinkRequestBody {
  title: string;
  to: string;
}

export { NewLinkRequestBody, PatchLinkRequestBody };
