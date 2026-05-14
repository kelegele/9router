# 9router 项目指南

## 分支策略

- 主分支：`master`（远端 `origin/master`）
- 本地部署分支：`local`，包含本地定制（Dockerfile 修改、update 脚本等）
- 更新流程：`git fetch origin master` → `git merge origin/master` → rebuild → restart
- **不要**对 `local` 分支执行 `git pull`，它没有追踪远端

## Docker 镜像

- **使用官方预构建镜像** `decolua/9router:latest`，不做本地编译
- 更新就是 `docker pull decolua/9router:latest`，无需 git 拉代码
- 更新文档：见 `DOCKER.md`

## 本地分支

- `local` 分支仅用于追踪本地脚本变更（如 `update.sh`），不参与 Docker 构建

## 更新部署

运行 `bash update.sh` 即可：git sync → docker pull → restart
