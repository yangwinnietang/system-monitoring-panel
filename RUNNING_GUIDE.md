# 系统监控面板 - 运行说明

## 📋 目录

- [环境要求](#环境要求)
- [安装步骤](#安装步骤)
- [开发环境运行](#开发环境运行)
- [生产环境部署](#生产环境部署)
- [配置说明](#配置说明)
- [常见问题](#常见问题)
- [故障排除](#故障排除)

## 环境要求

### 系统要求

- **操作系统**: Windows 10/11, macOS, Linux
- **内存**: 至少 4GB RAM (推荐 8GB 或以上)
- **存储**: 至少 1GB 可用空间

### 软件要求

- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0
- **Git**: >= 2.0.0 (用于克隆代码仓库)

### 验证环境

在终端中运行以下命令验证环境：

```bash
# 检查 Node.js 版本
node -v

# 检查 npm 版本
npm -v

# 检查 Git 版本
git --version
```

## 安装步骤

### 1. 获取源代码

#### 从 GitHub 克隆 (推荐)

```bash
# 克隆项目到本地
git clone https://github.com/yangwinnietang/system-monitoring-panel.git

# 进入项目目录
cd system-monitoring-panel
```

#### 下载 ZIP 文件

1. 访问项目页面: https://github.com/yangwinnietang/system-monitoring-panel
2. 点击 "Code" 按钮
3. 选择 "Download ZIP"
4. 解压下载的文件
5. 进入解压后的目录

### 2. 安装依赖

```bash
# 安装项目依赖
npm install
```

安装过程可能需要几分钟时间，具体取决于网络速度。

### 3. 验证安装

```bash
# 检查项目依赖是否正确安装
npm list --depth=0
```

## 开发环境运行

### 启动开发服务器

```bash
# 启动开发服务器
npm run dev
```

默认情况下，开发服务器将在以下地址运行:
- **本地地址**: http://localhost:5173/
- **网络地址**: http://[你的本地IP]:5173/

### 访问应用

1. 打开浏览器
2. 访问 http://localhost:5173/
3. 你应该能看到系统监控面板的主界面

### 开发服务器选项

#### 自定义端口

如果默认端口 5173 被占用，可以通过以下方式修改端口：

**方法 1: 命令行参数**

```bash
# 使用自定义端口启动
npm run dev -- --port 3000
```

**方法 2: 环境变量**

```bash
# Windows (PowerShell)
$env:PORT = 3000
npm run dev

# Windows (CMD)
set PORT=3000
npm run dev

# Linux/macOS
PORT=3000 npm run dev
```

#### 启用 HTTPS

```bash
# 启用 HTTPS
npm run dev -- --https
```

### 开发工具

#### 代码检查

```bash
# 运行 ESLint 检查代码质量
npm run lint
```

#### 自动修复代码问题

```bash
# 自动修复可修复的代码问题
npm run lint -- --fix
```

### 开发模式特性

- **热模块替换 (HMR)**: 修改代码后自动刷新页面
- **源代码映射**: 在浏览器中直接调试 TypeScript 源代码
- **错误覆盖**: 在浏览器中显示编译错误

## 生产环境部署

### 构建生产版本

```bash
# 构建生产版本
npm run build
```

构建完成后，所有生产文件将位于 `dist` 目录中。

### 预览生产版本

```bash
# 预览生产版本
npm run preview
```

默认情况下，预览服务器将在 http://localhost:4173/ 运行。

### 部署选项

#### 1. 静态服务器部署

**使用 Node.js 的 serve 包**

```bash
# 全局安装 serve
npm install -g serve

# 启动静态服务器
serve -s dist -l 3000
```

**使用 Nginx**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # 处理 SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 2. 容器化部署

**创建 Dockerfile**

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**构建和运行 Docker 容器**

```bash
# 构建 Docker 镜像
docker build -t system-monitoring-panel .

# 运行 Docker 容器
docker run -d -p 8080:80 --name monitoring-panel system-monitoring-panel
```

#### 3. 云服务部署

**Vercel 部署**

1. 登录 Vercel (https://vercel.com)
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. 选择 system-monitoring-panel 项目
5. 配置构建设置:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 点击 "Deploy"

**Netlify 部署**

1. 登录 Netlify (https://netlify.com)
2. 点击 "New site from Git"
3. 连接 GitHub 仓库
4. 选择 system-monitoring-panel 项目
5. 配置构建设置:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. 点击 "Deploy site"

## 配置说明

### 环境变量

创建 `.env` 文件在项目根目录:

```env
# 应用配置
VITE_APP_TITLE=系统监控面板
VITE_APP_VERSION=1.0.0

# API 配置
VITE_API_BASE_URL=http://localhost:3000/api

# 功能开关
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_NOTIFICATIONS=true
```

### 自定义配置

#### 修改端口

编辑 `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 自定义端口
    host: true,  // 允许网络访问
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

#### 代理配置

编辑 `vite.config.ts` 添加代理:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

## 常见问题

### Q: 安装依赖时出现权限错误

**A**: 尝试以下解决方案:

```bash
# 清除 npm 缓存
npm cache clean --force

# 使用 --no-bin-links 标志
npm install --no-bin-links

# 或者使用 yarn
npm install -g yarn
yarn install
```

### Q: 开发服务器启动失败，端口被占用

**A**: 查找占用端口的进程并终止它:

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <进程ID> /F

# macOS/Linux
lsof -i :5173
kill -9 <进程ID>
```

### Q: 构建失败，出现类型错误

**A**: 尝试以下解决方案:

```bash
# 清除构建缓存
rm -rf dist
rm -rf node_modules/.vite

# 重新安装依赖
npm install

# 重新构建
npm run build
```

### Q: 生产环境中图表不显示

**A**: 检查以下几点:

1. 确保所有静态资源正确部署
2. 检查浏览器控制台是否有错误信息
3. 确保服务器正确配置了 MIME 类型
4. 检查是否启用了 CSP (内容安全策略) 并正确配置

### Q: 生产环境中路由刷新 404

**A**: 这是 SPA 应用的常见问题，需要配置服务器重写规则:

**Nginx 配置**:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache 配置**:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 故障排除

### 日志分析

#### 开发环境日志

开发服务器的日志会直接显示在终端中，包括:

- 编译错误和警告
- 热模块替换状态
- 服务器启动信息

#### 生产环境日志

生产环境的日志分析:

```bash
# 查看服务器访问日志
tail -f /var/log/nginx/access.log

# 查看服务器错误日志
tail -f /var/log/nginx/error.log
```

### 浏览器开发者工具

使用浏览器开发者工具 (F12) 进行调试:

1. **Console 标签页**: 查看 JavaScript 错误和日志
2. **Network 标签页**: 检查网络请求和响应
3. **Elements 标签页**: 检查 DOM 结构和样式
4. **Application 标签页**: 查看本地存储和缓存

### 性能优化

#### 构建优化

```bash
# 分析构建包大小
npm install -g vite-bundle-analyzer
npm run build -- --mode analyze
```

#### 生产环境优化

1. 启用 Gzip 压缩
2. 配置适当的缓存策略
3. 使用 CDN 分发静态资源
4. 优化图片和字体文件

### 联系支持

如果遇到无法解决的问题，请通过以下方式获取支持:

- **GitHub Issues**: https://github.com/yangwinnietang/system-monitoring-panel/issues
- **邮箱**: 1930863755@qq.com

---

*最后更新时间: 2025-09-20*