export const BUSINESS_AREAS = [
  { id: "civil", label: "토목" },
  { id: "paving", label: "지반조성포장" },
  { id: "landscape", label: "조경" },
  { id: "waterproofing", label: "습식(방수)" },
  { id: "painting", label: "도장" },
  { id: "maintenance", label: "유지보수" },
] as const;

export type BusinessAreaId = (typeof BUSINESS_AREAS)[number]["id"];

export const BUSINESS_AREA_NAMES = BUSINESS_AREAS.map(({ label }) => label);
export const BUSINESS_AREA_LIST = BUSINESS_AREA_NAMES.join(", ");
export const BUSINESS_AREA_SUMMARY = BUSINESS_AREA_NAMES.join(" · ");
