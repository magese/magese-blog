---
title: CentOS7安装Redis6
date: 2021-03-22 10:36:37
updated: 2021-03-22 10:36:37
categories: 技术
tags:
  - Redis
  - Linux
  - CentOS
index_img: https://images.magese.com/2021-03-22.redis.banner.png
banner_img: https://images.magese.com/2021-03-22.redis.banner.png
---

# CentOS7安装Redis6

> REmote DIctionary Server(Redis) 是一个由 Salvatore Sanfilippo 写的 key-value 存储系统，是跨平台的非关系型数据库。
> Redis 是一个开源的使用 ANSI C 语言编写、遵守 BSD 协议、支持网络、可基于内存、分布式、可选持久性的键值对(Key-Value)存储数据库，并提供多种语言的 API。
> Redis 通常被称为数据结构服务器，因为值（value）可以是字符串(String)、哈希(Hash)、列表(list)、集合(sets)和有序集合(sorted sets)等类型。
> [官网地址](https://redis.io/)

## 1. 下载并解压安装包

官网查找最新的安装包[https://redis.io/download]()
```
wget https://download.redis.io/releases/redis-6.2.1.tar.gz
tar -zxvf redis-6.2.1.tar.gz -C /usr/local/redis
```

## 2. 编译redis
```
cd /usr/local/redis
make
```

## 3. 安装并指定安装目录
```
make install PREFIX=/usr/local/redis
```

## 4. 修改配置文件
将 `/usr/local/redis/redis.conf` 配置文件复制到 `/usr/local/redis/bin/` 中
```
cp /usr/local/redis/redis.conf /usr/local/redis/bin/
```
修改配置文件：
```
# 开放所有IP连接
bind * -::*
# 开启守护线程模式
daemonize yes
# 设置连接密码
requirepass {yourpass}
```

## 5. 启动并设置开机启动
添加开机启动服务
```
vi /etc/systemd/system/redis.service
```

添加以下内容：
```
[Unit]
Description=redis-server
After=network.target
[Service]
Type=forking
ExecStart=/usr/local/redis/bin/redis-server /usr/local/redis/bin/redis.conf
PrivateTmp=true
[Install]
WantedBy=multi-user.target
```

设置开机启动并启动
```
systemctl daemon-reload
systemctl start redis.service
systemctl enable redis.service
```

## 6. 创建redis命令软连接测试连接
```
ln -s /usr/local/redis/bin/redis-cli /usr/bin/redis
redis
auth {yourpass}
ping
```
![console](https://images.magese.com/2021-03-22.redis.01.png)

## 7. 服务常用操作命令
```
# 启动redis服务
systemctl start redis.service
# 停止redis服务
systemctl stop redis.service
# 重新启动服务
systemctl restart redis.service
# 查看服务当前状态
systemctl status redis.service
# 设置开机自启动
systemctl enable redis.service
# 停止开机自启动
systemctl disable redis.service
```
