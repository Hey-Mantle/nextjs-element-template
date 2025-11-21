# syntax=docker.io/docker/dockerfile:1

# Builder image for the web app.
#
ARG BASE_IMAGE
ARG NODEJS_IMAGE
FROM ${BASE_IMAGE} AS builder

ARG NEXT_PUBLIC_NODE_ENV
ENV NEXT_PUBLIC_NODE_ENV=${NEXT_PUBLIC_NODE_ENV}
ARG NEXT_PUBLIC_MANTLE_URL
ENV NEXT_PUBLIC_MANTLE_URL=${NEXT_PUBLIC_MANTLE_URL}
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ARG NEXT_PUBLIC_MANTLE_EXTENSION_ID
ENV NEXT_PUBLIC_MANTLE_EXTENSION_ID=${NEXT_PUBLIC_EXTENSION_ID}
ARG NEXT_PUBLIC_MANTLE_APP_API_URL
ENV NEXT_PUBLIC_MANTLE_APP_API_URL=${NEXT_PUBLIC_MANTLE_APP_API_URL}
ARG NEXT_PUBLIC_MANTLE_APP_TOKEN
ENV NEXT_PUBLIC_MANTLE_APP_TOKEN=${NEXT_PUBLIC_MANTLE_APP_TOKEN}
ENV AUTH_TRUST_HOST=true
ARG AUTH_URL
ENV AUTH_URL=${AUTH_URL}
ARG AUTH_SECRET
ENV AUTH_SECRET=${AUTH_SECRET}
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

# These are needed for the build to succeed.
# The specific values are less important, but should NOT be real production values.
# WARNING: These can be seen by anyone with access to the docker image. Do NOT put sensitive values here.
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy

COPY --chown=nodejs:nodejs . .

# Run the build with cache mounts
RUN --mount=type=cache,id=next-cache,target=/app/.next/cache \
    --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm run build

# Runtime image for the web app.
#
FROM ${NODEJS_IMAGE} AS runner

# Configure the git commit label.
ARG GIT_COMMIT
LABEL git_commit=$GIT_COMMIT

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG TZ
ENV TZ=${TZ}

RUN apk add --no-cache libc6-compat bash
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nodejs

WORKDIR /app

# Copy only necessary files with correct ownership
# Copy the built application from the builder stage
COPY --chown=nodejs:nodejs --from=builder /app/.next/standalone ./
COPY --chown=nodejs:nodejs --from=builder /app/.next/static ./.next/static
COPY --chown=nodejs:nodejs --from=builder /app/public ./public

USER nodejs

# Run the web app as the default command.
CMD ["node", "server.js"]

