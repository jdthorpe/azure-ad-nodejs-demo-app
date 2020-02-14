# Web app / Web API with azure AD demo

## Usage
 
Start the web-app and web-api and then visit `localhost:3000`. Adapted from
the
[active-directory-node-webapi](https://github.com/Azure-Samples/active-directory-node-webapi)
exmaple app and [this
course](https://app.pluralsight.com/library/courses/microsoft-azure-nodejs-secure-services-applications-update/table-of-contents).

Note that the environment varialbes are set with powershell syntax below.  Adjust for your terminal accordingly

### run the web app locally

Set environment variables:

```ps1
$env:tenantName = "myAzureTenantName"
$env:tenantID = "12341234-1234-1234-12341234123412341"
$env:clientID = "1324asdf-1234-asdf-1234asdfasdfasdfa"
$env:clientSecret = "thesecretyoucreatedforyourapp123"
$env:appURI = "https://myAPIregistrationURI"
```

Then run the app:

```ps1
cd web-app
npm install
npm start
```

### run the web app locally with docker

Set environment variables as above then build and run the docker container:

_**Note that** the only reason to do this is to test out the docker build, since the api running in a lonely docker container has no way to call out to the API that might be running in another the docker container or from the command line_

```ps1
cd web-app
docker build . -t web-app
docker run --rm -it -e tenantName -e tenantID -e clientID -e clientSecret -e appURI -p 3000:3000 web-app
```

### run the API app locally

Set environment variables taken from the overview blade of the **web-api** registration:

```ps1
$env:tenantName = "myAzureTenantName"
$env:tenantID = "12341234-1234-1234-12341234123412341"
$env:clientID = "abcdabcd-abcd-abcd-abcdabcdabcdabcda"
$env:audience = "https://myAPIregistrationURI"
```

Then run the app:

```ps1
cd api-server
npm install
npm start
```

### run the API app locally with docker

Set environment variables as above then build and run the docker container:

```ps1
cd api-server
docker build . -t web-api
docker run --rm -it -e tenantID -e clientID -e audience -p 5000:5000 web-api
```

### run the web-app and the web-api locally (docker-compose)

Update the environment varialbe definitions in the `docker-compse.yml` file with the values above, and run:

```ps1
docker-compose build
docker-compose up
```
