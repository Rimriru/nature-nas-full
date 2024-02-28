interface NewLinkRequestBody {
  title: string;
  to: string;
  group: string;
}

interface PatchLinkRequestBody {
  title: string;
  to: string;
}

export { NewLinkRequestBody, PatchLinkRequestBody };
