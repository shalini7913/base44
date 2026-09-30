export function getReturnTo() {
  return localStorage.getItem('resq_return_to') || '/';
}

export function setReturnTo(path) {
  localStorage.setItem('resq_return_to', path);
}
