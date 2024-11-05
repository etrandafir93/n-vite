## N-Vite

Our platform enables couples to create and share elegant, 
customizable electronic wedding invitations, complete with personalized designs and interactive features. 

It also offers tools to manage guest lists, track RSVPs, and streamline communication, 
making wedding planning simpler and more eco-friendly.

Here is a [spreadsheet checklist](https://docs.google.com/spreadsheets/d/1p1IBNcukyfj4lw2CZX7oXG4OgLBP_xVST_9aSGrVU08/edit?usp=sharing) with all the supported functionalities, including testcases, [bugs](https://github.com/etrandafir93/n-vite/issues?q=is%3Aissue+is%3Aopen+label%3ABUG) and [improvements](https://github.com/etrandafir93/n-vite/issues?q=is%3Aissue+is%3Aopen+label%3Aimprovement).

<br/>
<p align="center">
  <img src="./src/main/resources/static/icons/n-vite-logo.png"/>
</p>
<br/>

### Development

#### Start Application Locally
- login to gcloud and grant access to the application: `gcloud auth application-default login`

#### Build Image

- `mvn clean install`
- `docker build -t n-vite:1.2.3 .`

#### Upload to Google Registry

- `gcloud auth login`
- `gcloud config set project n-vite`
- `gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://europe-southwest1-docker.pkg.dev`


- `docker tag n-vite:1.2.3 europe-southwest1-docker.pkg.dev/n-vite/nvite-registry/n-vite:1.2.3`
- `docker push europe-southwest1-docker.pkg.dev/n-vite/nvite-registry/n-vite:1.2.3`




