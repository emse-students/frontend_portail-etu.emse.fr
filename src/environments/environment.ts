// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   cas_login_url: 'https://cas.emse.fr',
//   api_login_url: 'http://portail-test-api.emse.fr/index.php/login',
//   api_url: 'http://portail-test-api.emse.fr/index.php/api',
//   api_uri: 'http://portail-test-api.emse.fr/index.php/api',
//   api_suffix: '/index.php/api',
//   img_url: 'http://portail-test-api.emse.fr/img',
//   production: false
// };
export const environment = {
  cas_login_url: 'https://cas.emse.fr',
  api_login_url: 'http://localhost/api/login',
  api_url: 'http://localhost/api/api',
  api_uri: 'api',
  api_suffix: '/api/api',
  img_url: 'http://localhost/api/img',
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
