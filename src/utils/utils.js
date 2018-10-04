export function get_as_map(items, key) {
  // Given an array of items, return a map to those items (using the specified key).
  return items.reduce(function(acc, item) {
    acc[item[key]] = item;
    return acc
  }, {})
}