# AutomDash

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### Start AutomDash on development server

- start vagrant PostgreSql server
- cd ~/dev/vagrant_postgresql/pg-app-dev-vm
- vagrant up
- instruction are in this directory for logging into PostgreSql instance
- Start AutomDash backend express server and AutomDash frontend web service:
- cd ~/dev/git/ircommand 
- ./run_autom_dash.sh
- Montoring
- tail -f ircommand/autom-dash/server_orm/nohup.out

### Start AutomDash running locally on Raspberry Pi

- ssh in as 'pi' user
- Download install_autom_dash.sh
- sudo ./install_autom_dash.sh
- sudo su - 'aduser'
- cd ~/ircommand
- Start RestfulLearnIR service:
- nohup ./RestfulLearnIR.py > /tmp/RestfulLearnIR.out 2>&1 &
- Start AutomDash backend express server and AutomDash frontend web service:
- ./run_autom_dash.sh
- Montoring
- tail -f /tmp/RestfulLearnIR.out
- tail -f ircommand/autom-dash/server_orm/nohup.out
- psql --host=localhost -U aduser -d automdash --password
