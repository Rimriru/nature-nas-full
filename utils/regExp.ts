const IMAGE_LINK_REG_EXP = /^(http|https):\/\/[^\s/$.?#].[^\s]*\.(?:png|jpg|jpeg)$/;
const PAGE_LINK_REG_EXP = /^\/(?!\/|-$)[a-z]+(?:-[a-z]+)*$/;

export { IMAGE_LINK_REG_EXP, PAGE_LINK_REG_EXP };
