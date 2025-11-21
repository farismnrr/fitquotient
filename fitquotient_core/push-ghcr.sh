#!/usr/bin/env bash
set -euo pipefail

# Build and push to GitHub Container Registry (GHCR)
# Usage:
#   export CR_PAT=ghp_xxx            # or export GITHUB_TOKEN=ghp_xxx
#   ./push-ghcr.sh [tag]
# Default tag: latest


TAG=${1:-latest}

OWNER=${GITHUB_OWNER:-${GHCR_NAMESPACE:-${GHCR_USERNAME:-farismnrr}}}
IMAGE_NAME=fitquotient_core
IMAGE=ghcr.io/${OWNER}/${IMAGE_NAME}:${TAG}
TOKEN="${CR_PAT:-${GITHUB_TOKEN:-${GHCR_PAT:-${GITHUB_PAT_TOKEN:-${GITHUB_PAT:-}}}}}"

if [ -z "${TOKEN}" ]; then
  if [ -f ".env" ]; then
    echo "No token in environment — sourcing .env for credentials (be careful with secrets in repo)."
    set -a
    source .env
    set +a
    TOKEN="${CR_PAT:-${GITHUB_TOKEN:-${GHCR_PAT:-${GITHUB_PAT_TOKEN:-${GITHUB_PAT:-}}}}}"
    OWNER=${GITHUB_OWNER:-${GHCR_NAMESPACE:-${GHCR_USERNAME:-${OWNER}}}}
  fi
fi

if [ -z "${TOKEN}" ]; then
  cat <<EOF
No GitHub token found.
Provide a Personal Access Token (PAT) with `write:packages` scope using one of:

  export CR_PAT=ghp_...            # recommended
  export GITHUB_TOKEN=ghp_...      # alternative
  or put the token into a local `.env` as `GITHUB_PAT_TOKEN` / `CR_PAT` / `GITHUB_TOKEN`

Create a PAT at: https://github.com/settings/tokens
EOF
  exit 1
fi

USERNAME=${GITHUB_OWNER:-${GHCR_USERNAME:-${GITHUB_USERNAME:-farismnrr}}}

echo "Logging in to ghcr.io as ${USERNAME}..."
echo "${TOKEN}" | docker login ghcr.io -u "${USERNAME}" --password-stdin

echo "Building ${IMAGE}..."
# Determine Dockerfile: optional second argument, or prefer Dockerfile, then Dockerfile.core
DOCKERFILE_ARG=${2:-}
if [ -n "${DOCKERFILE_ARG}" ]; then
  DOCKERFILE="${DOCKERFILE_ARG}"
  echo "Using Dockerfile from arg: ${DOCKERFILE}"
elif [ -f Dockerfile ]; then
  DOCKERFILE=Dockerfile
  echo "Using Dockerfile: ${DOCKERFILE}"
elif [ -f Dockerfile.core ]; then
  DOCKERFILE=Dockerfile.core
  echo "Using fallback Dockerfile: ${DOCKERFILE}"
else
  echo "No Dockerfile found (tried 'Dockerfile' and 'Dockerfile.core'). Pass a Dockerfile path as second arg." >&2
  exit 1
fi

IMAGE_DESCRIPTION="FitQuotient Core — NestJS API service for FitQuotient platform"

LABEL_FLAGS=()
LABEL_FLAGS+=(--label "org.opencontainers.image.description=${IMAGE_DESCRIPTION}")
LABEL_FLAGS+=(--label "org.opencontainers.image.title=${IMAGE_NAME}")
LABEL_FLAGS+=(--label "org.opencontainers.image.version=${TAG}")

echo "Running docker build with labels: ${LABEL_FLAGS[*]}"
docker build -f "${DOCKERFILE}" -t "${IMAGE}" "${LABEL_FLAGS[@]}" .

echo "Pushing ${IMAGE}..."
docker push "${IMAGE}"

echo "Finished: pushed ${IMAGE}"


