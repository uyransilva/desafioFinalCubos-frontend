export function setLocalItem(key, value) {
  return localStorage.setItem(key, value);
}
export function getLocalItem(key, value) {
  return localStorage.getItem(key, value);
}
export function removeLocalItem(key, value) {
  return localStorage.removeItem(key, value);
}
export function clearLocalItem() {
  return localStorage.clear();
}
