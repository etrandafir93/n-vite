
### Build Image

- `mvn clean install`
- `docker build -t n-vite:1.2.3 .`

### Upload to Google Registry

- `gcloud auth login`
- `gcloud config set project n-vite`
- `gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://europe-southwest1-docker.pkg.dev`


- `docker tag n-vite:1.2.3 europe-southwest1-docker.pkg.dev/n-vite/nvite-registry/n-vite:1.2.3`
- `docker push europe-southwest1-docker.pkg.dev/n-vite/nvite-registry/n-vite:1.2.3`


### Local Development
- login to gcloud and grant access to the application: `gcloud auth application-default login`



