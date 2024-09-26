# Install Docker und Co. on Almalinux

## docker and docker compose
```sh
dnf update -y
dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
dnf install docker-ce docker-ce-cli containerd.io
systemctl start docker
systemctl enable docker
```

### Check if successfully installed
```sh
docker verison
docker compose version
```
