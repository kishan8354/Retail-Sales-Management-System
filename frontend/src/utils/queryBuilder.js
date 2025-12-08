// frontend/utils/queryBuilder.js
// export function buildQuery(state) {
//   const q = {};
//   if (state.search) q.search = state.search;

//   // send arrays directly so axios produces repeated params (preferred)
//   if (state.region && state.region.length) q.region = state.region;
//   if (state.gender && state.gender.length) q.gender = state.gender;
//   if (state.category && state.category.length) q.category = state.category;
//   if (state.tags && state.tags.length) q.tags = state.tags;
//   if (state.payment && state.payment.length) q.payment = state.payment;

//   if (state.ageMin !== undefined && state.ageMin !== null) q.ageMin = state.ageMin;
//   if (state.ageMax !== undefined && state.ageMax !== null) q.ageMax = state.ageMax;

//   if (state.startDate) q.startDate = state.startDate;
//   if (state.endDate) q.endDate = state.endDate;

//   if (state.sortBy) q.sortBy = state.sortBy;
//   if (state.order) q.order = state.order;

//   q.page = state.page || 1;
//   q.limit = state.limit || 10; // allow override; default 10

//   return q;
// }
// code -----2
// frontend/utils/queryBuilder.js
export function buildQuery(state) {
  const q = {};
  if (state.search) q.search = state.search;

  // pass arrays directly so axios serializes repeated params
  if (state.region && state.region.length) q.region = state.region;
  if (state.gender && state.gender.length) q.gender = state.gender;
  if (state.category && state.category.length) q.category = state.category;
  if (state.tags && state.tags.length) q.tags = state.tags;
  if (state.payment && state.payment.length) q.payment = state.payment;

  if (state.ageMin !== undefined && state.ageMin !== null && state.ageMin !== '') q.ageMin = state.ageMin;
  if (state.ageMax !== undefined && state.ageMax !== null && state.ageMax !== '') q.ageMax = state.ageMax;

  if (state.startDate) q.startDate = state.startDate;
  if (state.endDate) q.endDate = state.endDate;

  if (state.sortBy) q.sortBy = state.sortBy;
  if (state.order) q.order = state.order;

  q.page = state.page || 1;
  q.limit = state.limit || 10;

  return q;
}
