const addressValidator = require("../dist/checkAddress.js").default;
const address = "0xdd8F0b65030C122078A17401262d3e3224c1Ca59";
const  fakeAddress = "0xdd8F0b65030C122078A17401262d3e3224c1Ca5";

test("address validator should show valid", () => {
  const isValid = addressValidator(address);
  expect(isValid.valid).toBe(true)
  expect(isValid.value).toBe(address);
  expect(isValid.address).toBe(address);
  const isNotValid = addressValidator(fakeAddress);
  expect(isNotValid.valid).toBe(false)
  expect(isNotValid.value).toBe(fakeAddress);
  expect(isNotValid.address).toBe(undefined);
})