// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   casLoginUrl: 'https://cas.emse.fr',
//   apiLoginUrl: 'http://portail-test-api.emse.fr/index.php/login',
//   apiUrl: 'http://portail-test-api.emse.fr/index.php/api',
//   apiUri: 'http://portail-test-api.emse.fr/index.php/api',
//   apiSuffix: '/index.php/api',
//   imgUrl: 'http://portail-test-api.emse.fr/img',
//   production: false
// };
export const environment = {
  casLoginUrl: 'https://cas.emse.fr',
  apiLoginUrl: 'http://192.168.0.11/api/login',
  apiUrl: 'http://192.168.0.11/api/api',
  apiUri: 'api',
  apiSuffix: '/api/api',
  imgUrl: 'http://192.168.0.11/api/img',
  excelUrl: 'http://192.168.0.11/api/excel',
  home: 'http://192.168.0.11/',
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
