Client of portail-etu.emse.fr
===============

This application is the frontend of [portail-etu.emse.fr](https://portail-etu.emse.fr).
It work on top of [backend_portail-etu.emse.fr](https://github.com/CorentinDoue/frontend_portail-etu.emse.fr.git)

Installation
------------

### 1. Clone the project : 
``` bash
$ git clone https://github.com/CorentinDoue/frontend_portail-etu.emse.fr.git
```

### 2. Install the dependencies :
``` bash    
$ yarn
```

### 3. Update `src/environments/*` with your local information :
- `cas_login_url` : The url of the CAS which be call to login
- `api_login_url` : The url of the API which check your CAS authentication, check that the user exist on the database and five back a token
- `api_url` : the endpoint of the API
- `img_url` : the url where the downloaded images are stored
- `production` : a boolean to toogle production mode

### 4. Serve in dev mode locally or build the project
``` bash    
$ yarn start
```
or
``` bash    
$ yarn build
```

Angular information
------------

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.1.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
