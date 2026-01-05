## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 数据库

### 连接池

`DATABASE_URL` 是连接池的 URL，用于连接到 Supabase。

### 直接连接

`DIRECT_URL` 是直接连接的 URL，用于执行数据库迁移。
### 初始化

```bash
# 初始化数据库
$ npm run db:init


$ npx prisma generate
```

### 迁移

```bash
# 迁移数据库
$ npm run db:migrate

$ npx prisma migrate dev --name init_invitation
```

### 更新

```bash
# 更新数据库
$ npm run db:update

$ npx prisma migrate dev --name update_invitation
```