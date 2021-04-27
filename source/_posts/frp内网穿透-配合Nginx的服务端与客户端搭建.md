---
title: frp内网穿透-配合Nginx的服务端与客户端搭建
excerpt: frp 是一个专注于内网穿透的高性能的反向代理应用，支持 TCP、UDP、HTTP、HTTPS 等多种协议。可以将内网服务以安全、便捷的方式通过具有公网 IP 节点的中转暴露到公网。
date: 2021-03-16 15:00:37
updated: 2021-03-16 15:00:37
categories: 技术
tags:
  - frp
  - Nginx
  - 内网穿透
index_img: https://images.magese.com/2021-03-16.frp.banner.jpg
banner_img: https://images.magese.com/2021-03-16.frp.banner.jpg
---

# frp内网穿透-配合Nginx的服务端与客户端搭建

> frp 是一个专注于内网穿透的高性能的反向代理应用，支持 TCP、UDP、HTTP、HTTPS 等多种协议。可以将内网服务以安全、便捷的方式通过具有公网 IP 节点的中转暴露到公网。
> 
> [frp官方文档](https://gofrp.org/docs)


## 版本说明

- frp: `v0.35.1`
- Nginx: `1.18.0`
- Server服务端: `CentOS 7.6`
- Client客户端: `Windows 10`


## 下载frp

前往GitHub frp release页面下载对应版本的frp压缩包

[GitHub地址](https://github.com/fatedier/frp/releases)
![](https://images.magese.com/2021-03-16.frp.01.png)


## 服务端安装frp

### 1. 使用工具或rz命令上传压缩包至服务端

### 2. 解压并重命名

```shell
# 解压至指定目录
tar -zxvf frp_0.35.1_linux_amd64.tar.gz -C /usr/local/

# 修改文件夹名称
cd /usr/local/
mv frp_0.35.1_linux_amd64 frp
```

### 3. 修改服务端配置文件`frps.ini`

```shell
vi frp/frps.ini
```

配置文件示例：

```
[common]
bind_port = 7000
vhost_http_port = 7100
vhost_https_port = 7443
subdomain_host = xxx.example.com

dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = admin
```

> 配置参数详情参考[官方文档](https://gofrp.org/docs/reference/server-configures/)


### 4. 设置frps后台运行及开机启动

创建systemd配置文件

```shell
vi /etc/systemd/system/frps.service
```

写入以下内容：

```
[Unit]
Description=frps daemon

[Service]
Type=simple
ExecStart=/usr/local/frp/frps -c /usr/local/frp/frps.ini

[Install]
WantedBy=multi-user.target
```

启动并设为开机运行

```shell
systemctl start frps
systemctl enable frps
```


## 设置Nginx反向代理

### 1. 添加Server配置至Nginx

```
server {
    listen       80;
    server_name  *.xxx.example.com xxx.example.com;

    charset utf-8;

    location / {
            proxy_pass http://127.0.0.1:7100; 
            proxy_set_header Host $host:80;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            proxy_connect_timeout 7d;
            proxy_send_timeout 7d;
            proxy_read_timeout 7d;
    }
}
```

### 2. 前往域名控制台增加解析记录

![](https://images.magese.com/2021-03-16.frp.02.png)


## 客户端安装frp

### 1. 直接解压`frp_0.35.1_windows_amd64.zip`

### 2. 进入目录修改`frpc.ini`配置文件

配置文件示例：

```
[common]
server_addr = xxx.xxx.xxx.xxx
server_port = 7000
admin_port = 7070
admin_user = admin
admin_pwd = admin

[web-a]
type = http
local_ip = 127.0.0.1
local_port = 8080
subdomain = a

[web-b]
type = http
local_ip = 127.0.0.1
local_port = 8081
subdomain = b

[desktop]
type = tcp
local_ip = 127.0.0.1
local_port = 3389
remote_port = 3389
custom_domains = xxx.example.com
```

> 配置参数详情参考官方文档：
> [客户端配置](https://gofrp.org/docs/reference/client-configures/)
> [代理配置](https://gofrp.org/docs/reference/proxy/)

### 3. 设置后台运行与开机启动

下载WinSw，下载地址：[WinSw](https://github.com/kohsuke/winsw/releases)
将其重命名为`winsw`并copy至与`frpc.exe`同级目录下。

并在该目录下新建一个文档`winsw.xml`：

```xml
<service>  
  <id>frp</id>  
  <name>frp</name>  
  <description>用frp发布本地电脑网站到外网</description>  
  <executable>frpc</executable>  
  <arguments>-c frpc.ini</arguments>  
  <logmode>reset</logmode>
</service>
```

在当前目录下以管理员身份打开cmd控制台，输入命令安装服务：
```
winsw install
```

使用`Win + R`输入`services`打开服务面板，可以看到frp服务已经安装，启动并设置为自动启动即可：
![](https://images.magese.com/2021-03-16.frp.03.png)

卸载服务命令：
```
winsw uninstall
```

**至此已经完成全部安装步骤，接下来可以测试效果。**


## 查看运行状态

### 客户端

打开浏览器输入`http://localhost:7070`打开客户端控制台，输入客户端配置`frpc.ini`中的账号密码，查看客户端运行状态：
![](https://images.magese.com/2021-03-16.frp.04.png)

### 服务端

输入`xxx.example.com:7500`打开服务端控制台，输入服务端配置`frps.ini`中的账号密码，查看服务端运行状态：
![](https://images.magese.com/2021-03-16.frp.05.png)
