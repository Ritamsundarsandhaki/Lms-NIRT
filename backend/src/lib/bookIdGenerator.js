import Counter from "../models/counter.model.js";

export const generateNextBookId = async () => {
  const updated = await Counter.findOneAndUpdate(
    { name: "bookId" },
    { $inc: { number: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  let prefix = updated.prefix || "AA";
  let number = updated.number;

  if (number > 999999) {
    number = 0;
    prefix = incrementPrefix(prefix);
    await Counter.findOneAndUpdate(
      { name: "bookId" },
      { prefix, number },
      { new: true }
    );
  }

  return `${prefix}-${number.toString().padStart(6, "0")}`;
};

const incrementPrefix = (prefix) => {
  let chars = prefix.split("");
  if (chars[1] === "Z") {
    chars[1] = "A";
    chars[0] = String.fromCharCode(chars[0].charCodeAt(0) + 1);
  } else {
    chars[1] = String.fromCharCode(chars[1].charCodeAt(0) + 1);
  }
  return chars.join("");
};
