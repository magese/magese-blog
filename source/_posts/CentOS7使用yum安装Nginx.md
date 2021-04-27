---
title: CentOS7使用yum安装Nginx
excerpt: Nginx (engine x) 是一个高性能的HTTP和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务。
date: 2021-03-17 14:31:13
updated: 2021-03-17 14:31:13
categories: 技术
tags:
  - Nginx
  - Linux
  - CentOS
  - yum
index_img: https://images.magese.com/2021-03-17.nginx.banner.png
banner_img: https://images.magese.com/2021-03-17.nginx.banner.png
---

# CentOS7使用yum安装Nginx


> Nginx (engine x) 是一个高性能的HTTP和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务。Nginx是由伊戈尔·赛索耶夫为俄罗斯访问量第二的Rambler.ru站点（俄文：Рамблер）开发的，第一个公开版本0.1.0发布于2004年10月4日。
> 
> [官网地址](https://nginx.org/)


## 1. 添加yum源
```shell
rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
```

## 2. 查看是否添加成功
```shell
yum search nginx
```

## 3. 安装 Nginx
```shell
yum install nginx -y
```

## 4. 启动 Nginx
```shell
systemctl start nginx.service
```

## 5. 查看 Nginx 状态
```shell
systemctl status nginx.service
```

## 6. 可以通过访问 IP 或域名来查看 Nginx
![Nginx Page](https://images.magese.com/2021-03-17.nginx.01.png)

## 7. 设置开机自启动
```shell
systemctl enable nginx.service
```

## 8. Nginx 重新加载配置
```shell
nginx -s reload
```

## 9. Nginx 重启
```shell
systemctl restart nginx.service
```

## 10. 查看 Nginx 运行状态
```shell
ps aux | grep nginx
```

## 11. Nginx 配置
- 全局配置文件：`/etc/nginx/nginx.conf`
- 配置文件目录：`/etc/nginx/conf.d/`
- 网站默认站点配置：`/etc/nginx/conf.d/default.conf`
- 网站文件默认目录：`/usr/share/nginx/html`
- 指定配置文件启动：`nginc -c /etc/nginx/nginx.conf`
