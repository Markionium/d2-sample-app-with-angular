# d2-sample-app-with-angular

Note: Verified that it runs against the following (The demo and dev servers on `http://apps.dhis2.org/dev` and `http://apps.dhis2.org/demo` currently contain a bug that breaks the schema endpoint, notified the api developer of the bug.)
```
Version:
2.21-SNAPSHOT
Build revision:
19724
```

### Getting started

### To check out just the code clone the repo and install the dependencies
```sh
git clone https://github.com/Markionium/d2-sample-app-with-angular.git

npm install
```

### To install the app into your instance download the following zip file and install using the DHIS2 App manager

Note the code assumes that your api is located at `/dhis/api` if this is not the case please adjust the `baseUrl` config in the `app.js` file.

After that zip the whole folder up and install it.

