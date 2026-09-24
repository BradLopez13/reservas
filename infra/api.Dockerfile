FROM node:24-alpine
RUN corepack enable
WORKDIR /repo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY packages/contracts/package.json packages/contracts/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --filter @reservas/api...
COPY packages/contracts packages/contracts
COPY apps/api apps/api
WORKDIR /repo/apps/api
EXPOSE 3000
CMD ["sh", "-c", "pnpm db:migrate && pnpm db:seed && pnpm exec tsx src/index.ts"]
