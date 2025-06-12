
export const extractHDUrlsFromCustomization = (customization: any) => {
  if (!customization) {
    return {
      hdRectoUrl: null,
      hdVersoUrl: null
    };
  }

  // Structure unifiée ou ancienne structure
  return {
    hdRectoUrl: customization.hdRectoUrl || customization.visual_front_url || null,
    hdVersoUrl: customization.hdVersoUrl || customization.visual_back_url || null
  };
};
