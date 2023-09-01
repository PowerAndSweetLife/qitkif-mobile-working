const BASE_URL = 'https://qitkif.com/';
// 192.168.0.105
// const BASE_URL = 'https://qitkif.com/';

export function base_url(uri) {
  return BASE_URL + uri;
}
export function api_url(uri) {
  return BASE_URL + 'api/' + uri;
}
export function public_url(uri) {
  return BASE_URL + 'public/' + uri;
}

export function ws_url() {
  return 'ws://192.168.0.116:9001';
  // return 'wss://qitkif.com/ws2/';
}

// const DOMAIN_URL = 'http://192.168.0.105/qitkif-api-node/';
// const SUBDOMAIN = 'http://192.168.0.105:3000/';

// export function base_url(uri) {
//   return DOMAIN_URL + uri;
// }
// export function api_url(uri) {
//   return SUBDOMAIN + uri;
// }
// export function public_url(uri) {
//   return DOMAIN_URL + 'public/' + uri;
// }
