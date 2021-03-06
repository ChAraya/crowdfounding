// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  token_auth_config: {
    apiBase: 'http://localhost:3000'
  },
  API_ENDPOINT: 'http://localhost:3000',  //'http://ec2-18-188-7-66.us-east-2.compute.amazonaws.com:80',
  UI_ENDPOINT: 'http://localhost:4200',
  AppName: 'Emprendo por mi Región'
};
