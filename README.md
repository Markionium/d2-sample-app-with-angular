# d2-sample-app-with-angular

Note: Verified that it runs against the following (The demo and dev servers on `http://apps.dhis2.org/dev` and `http://apps.dhis2.org/demo` currently contain a bug that breaks the schema endpoint, notified the api developer of the bug.)
```
Version:
2.21-SNAPSHOT
Build revision:
19724
```

### Getting started

#### Step 1: Clone the project
```sh
git clone https://github.com/Markionium/d2-sample-app-with-angular.git
```

#### Step 2: Move into project dir
```sh
cd d2-sample-app-with-angular
```

#### Step 3: Install dependencies
```sh
npm install
```

#### Step 4: Run the project
```sh
npm start
```

### Step 5: Add http://localhost:9000 to the CORS whitelist
Add the value `http://localhost:9000` to the whitelist by navigating to the following url for your instance
`https://apps.dhis2.org/dev/dhis-web-maintenance-settings/systemAccessSettings.action`

#### Step 6
Open `http://localhost:9000` in your browser. You should find a simple basic indicator searchlist.
