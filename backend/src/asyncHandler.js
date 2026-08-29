// עוטף מטפל אסינכרוני כך שדחיית promise תגיע ל-error handler של Express
// במקום להפיל את התהליך (Express 4 לא תופס דחיות בעצמו).
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { asyncHandler };
