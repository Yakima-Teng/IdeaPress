# IdeaPress

NodeJS构建的内容发布系统（前台部分），使用next.js9+，为同构项目，同时支持服务端渲染（SSR）和客户端渲染。

## 项目介绍

由于前台项目面向大众用户，考虑到兼容性，前台系统不使用Ant-Design（兼容到IE9）、Material-UI（兼容到IE11）这类UI库，而是使用Bootstrap3（兼容到IE8）。

## 兼容性

前台部分兼容到IE8（含）。

## 常用命令

```bash
# 安装依赖
npm i

# 开发
npm run dev

# 构建/部署
npm run start
```

注：建议使用pm2进行项目的启动与维护。

## License

MIT协议。免费开源，可以随意使用，但因使用而产生的问题请自行负责。
