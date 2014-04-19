#!/bin/bash

if [ ! -f ./Dockerfile ]; then
    echo
    echo "You should execute this script from the directory containing Dockerfile. Aborting"
    echo
    exit 2
fi

usage() {
    cat <<EOF >&2

Usage: $0 -n <name> [-v <version>] [-r <repository>] [-p (push to repo)] [-h]

    Defaults:
        version: last git tag
        repository: $docker_repo

EOF
    exit 1
}

docker_name=""
docker_version=""
docker_repo="dev.siclic.fr:5000"
pushit=false

while getopts ":n:v:r:ph" opt; do
    case $opt in
        n) docker_name=$OPTARG;;
        v) docker_version=$OPTARG;;
        r) docker_repo=$OPTARG;;
        p) pushit=true;;
        h) usage;;
        \?) echo "Invalid option: -$OPTARG"; usage;;
        :) echo "Option -$OPTARG requires an argument."; usage;;
    esac
done

[ -z "$docker_name" ] && usage

if [ -z "$docker_version" ]; then
    echo "Trying to determine version from last git tag"
    git_last_rev=$(git rev-list --tags --max-count=1)
    git_last_tag=$(git describe --tags $git_last_rev)
    if [ -z "$git_last_tag" ]; then
        echo "Failed getting git tag"
        usage
    else
        echo "Done."
        docker_version=$git_last_tag
    fi
fi

echo "Building docker $docker_repo/$docker_name"
sudo docker build -t $docker_repo/$docker_name .
echo
echo "Tagging with version $docker_version"
image_id=$(sudo docker images | grep $docker_repo/$docker_name | grep latest | awk '{print $3}')
sudo docker tag $image_id $docker_repo/$docker_name:$docker_version
echo
if $pushit; then
    echo "Pushing $docker_repo/$docker_name:latest to repo"
    sudo docker push $docker_repo/$docker_name:latest
    echo
    echo "Pushing $docker_repo/$docker_name:$docker_version to repo"
    sudo docker push $docker_repo/$docker_name:$docker_version
    echo
fi
echo "All done !"
