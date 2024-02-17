# IdeaPress

[官网](https://www.verysystems.com)

IdeaPress是一个由 Node（Nuxt3） + MySQL （Sequelize） 构建的内容管理系统（CMS）。包含以下模块/功能：

- [x] 登录/注册
- [x] 路由权限校验
- [x] SEO设置（整站、首页）
- [x] 网站设置（站点标题、ICP备案信息、版权信息等）
- [x] 文章管理
- [x] 文章分类管理
- [x] Markdown文档渲染
- [x] 菜单管理
- [x] 轮播图管理
- [x] 通用设置 => 广告位设置
- [x] 通用设置 => 首页Banner设置
- [ ] 用户/会员管理
- [ ] 产品管理
- [ ] 支付
- [ ] 订单管理

## 项目预览

![homepage](https://www.verysystems.com/images/page-home.png)

![edit post](https://www.verysystems.com/images/page-edit-post.png)

![setting](https://www.verysystems.com/images/page-setting.png)

## 前端兼容性

兼容到 IE 11。

## 服务端环境

Node: v16.14.2

## 使用说明

首次启动程序后，访问 **/start** 页面，填写网站标题、管理员账号信息，提交后即可正常使用网站。

![](./attachments/page-start.png)

[//]: # (## 项目表结构)

[//]: # ()
[//]: # (涉及？张表：)

[//]: # ()
[//]: # (相关ER图（实体关系图，entity-relationship diagram）如下：)

[//]: # ()
[//]: # (略。)

## 常用命令

```bash
# 安装依赖包
npm run ready

# lint检测
npm run lint

# lint检测 + 自动修复
npm run lint:fix

# 构建正式产物（用于启动部署）
npm run build

# 启动产物
npm run start

# 将构建产物部署到远端并启动
npm run deploy
```

## License

本产品开源。可免费用于非商业用途。

请勿用于非正规场景。使用本产品产生的任何问题由使用者自负。
