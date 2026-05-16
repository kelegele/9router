# 9router 项目指南

## 分支策略

- 上游仓库：`decolua/9router`，Fork 到 `kelegele/9router`（remote: `my`）
- 本地部署分支：`local`，包含本地定制（update 脚本等）
- 更新流程：`git fetch my master` → `git merge my/master` → `docker pull decolua/9router:latest` → restart
- Docker 镜像仍用官方预构建 `decolua/9router:latest`，不自己编译

## Docker 镜像

- **使用官方预构建镜像** `decolua/9router:latest`，不做本地编译
- 更新就是 `docker pull decolua/9router:latest`，无需 git 拉代码
- 更新文档：见 `DOCKER.md`

## 本地分支

- `local` 分支仅用于追踪本地脚本变更（如 `update.sh`），不参与 Docker 构建

## 更新部署

运行 `bash update.sh` 即可：git sync → docker pull → restart

## 关键教训

### 1. 必须用组合才有自动降级
- 直接在工具里配置 `glm/glm-5.1` 会死磕这个模型，被限流就卡死
- 要用组合（Combo）才会按优先级自动切换：订阅 → 低价 → 免费
- 工具里模型名改成组合名（如 `default`），9Router 自动处理降级

### 2. Docker standalone 的 file tracing 陷阱
- Next.js standalone 只追踪主 server.js 的依赖
- MITM 作为独立进程运行，其依赖不会被自动包含
- 需要手动 COPY 的额外目录：`src/mitm`、`src/shared`、`open-sse`、`node_modules/node-forge`
- MITM require `src/shared/constants/mitmToolHosts.js` 曾因遗漏导致启动失败
