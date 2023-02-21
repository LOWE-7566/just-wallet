import Type from "@validitor/main/type";
export const alphanumeric = new Type("alphanumeric", "number|string");
alphanumeric.setComparason((variable) => {
    return typeof variable === "string" || typeof variable === "number";
});
