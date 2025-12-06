export function buildQuery(state) {
  const q = {};
  if (state.search) q.search = state.search;
  if (state.region && state.region.length) q.region = state.region.join(",");
  if (state.gender && state.gender.length) q.gender = state.gender.join(",");
  if (state.ageMin !== undefined) q.ageMin = state.ageMin;
  if (state.ageMax !== undefined) q.ageMax = state.ageMax;
  if (state.category && state.category.length) q.category = state.category.join(",");
  if (state.tags && state.tags.length) q.tags = state.tags.join(",");
  if (state.payment && state.payment.length) q.payment = state.payment.join(",");
  if (state.startDate) q.startDate = state.startDate;
  if (state.endDate) q.endDate = state.endDate;
  if (state.sortBy) q.sortBy = state.sortBy;
  if (state.order) q.order = state.order;
  q.page = state.page || 1;
  q.limit = 10;
  return q;
}
