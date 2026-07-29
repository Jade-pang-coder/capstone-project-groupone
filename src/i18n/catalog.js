const normalizeKey = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

export const getLocalizedCategoryName = (t, category) => {
  const key = normalizeKey(category?.slug || category?.name);
  return t(`catalog.categories.${key}`, {
    defaultValue: category?.name || "",
  });
};

export const getLocalizedProduct = (t, product) => {
  const key = normalizeKey(product?.sku);
  return {
    name: t(`catalog.products.${key}.name`, {
      defaultValue: product?.name || product?.product_name || "",
    }),
    description: t(`catalog.products.${key}.description`, {
      defaultValue: product?.description || "",
    }),
  };
};
