export const PRODUCT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23eef2f7'/%3E%3Cpath d='M240 183h160l40 52v128H200V235l40-52Z' fill='%23cbd5e1'/%3E%3Cpath d='m200 235 120 68 120-68M320 303v60' fill='none' stroke='%2394a3b8' stroke-width='14' stroke-linejoin='round'/%3E%3Ctext x='320' y='420' text-anchor='middle' font-family='Arial,sans-serif' font-size='28' fill='%2364748b'%3ENo image available%3C/text%3E%3C/svg%3E";

export const useProductImageFallback = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
};
