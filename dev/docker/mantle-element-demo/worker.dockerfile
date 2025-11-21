# syntax=docker.io/docker/dockerfile:1

# Builder image for the worker and consumer components.
#
ARG BASE_IMAGE
ARG NODEJS_IMAGE
FROM ${BASE_IMAGE}

ARG GIT_COMMIT
LABEL git_commit=$GIT_COMMIT

COPY --chown=nodejs:nodejs . .

USER nodejs

# Default to a bash shell since this is used for several different components.
# It's expected that the user will override this with the appropriate command.
CMD ["/bin/bash"]

