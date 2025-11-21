# syntax=docker.io/docker/dockerfile:1

# Base image for the other components.
#
# Partially based on https://github.com/vercel/next.js/blob/canary/examples/with-docker-multi-env/docker/production/Dockerfile
ARG NODEJS_IMAGE
FROM ${NODEJS_IMAGE} AS base

# Configure environment variables needed for the build.
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG TZ
ENV TZ=${TZ}

# Install system dependencies.
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat bash python3 make g++ git netcat-openbsd bind-tools iputils openssl bash

# Create non-root user and set up directories
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nodejs

# Set the working directory and change ownership
WORKDIR /app

# Install and cache NPM dependencies, to avoid doing a full install on every build.
COPY --chown=nodejs:nodejs package.json package-lock.json ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm install

# different layer from the last step for better caching
COPY --chown=nodejs:nodejs prisma ./prisma
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npx prisma generate

