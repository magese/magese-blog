---
title: 小米路由器+TrueNAS虚拟机OpenWrt旁路由搭建
excerpt: 分布式存储中间件，都涉及一个关键技术，就是高可用。比如我们常用的mysql集群，zookeeper集群，kafka集群等，都需保证多节点服务，当某些节点不可用时，不影响整个系统的服务提供。
date: 2024-02-01 14:42:08
updated: 2024-06-07 15:45:55
categories: 
  - NAS
tags:
  - NAS
  - OpenWrt
index_img: https://oss.magese.com/blog/6f8c289a81342376
banner_img: https://oss.magese.com/blog/6f8c289a81342376
---

#

## 前言

迫于TrueNAS和许多的NAS服务以及个人PC都需要科学上网，一个个走代理过于麻烦，家里的古董路由器的功能有限，于是便动了搞一个旁路由的想法。

整体的网络架构也非常简单，只是在原有的基础上增加了一个OpenWrt的虚拟机。

家里的设备列表大概如下：电信光猫，主路由小米AX1800，TrueNAS服务器，桌面PC一台，WI-FI设备若干。


## 网络拓扑图

![](https://oss.magese.com/blog/6f8c289a81342376)


## TrueNAS安装OpenWrt虚拟机

### 一、下载固件

市面上的OpenWrt固件非常多，选一个适合自己硬件的就可以，我的NAS是x86架构的，选择用了k9大佬的固件：[Github地址](https://github.com/kiddin9/OpenWrt_x86-r2s-r4s-r5s-N1)。

下载完成后将固件压缩包放至NAS存储中。

### 二、安装镜像

首先在 TrueNAS 的 datasets 中创建一个 Zvol 存储，大小在 2G 以上就行，具体如图所示：

![TrueNAS-Zvol](https://oss.magese.com/blog/ee7c6361b2951b40)

然后登录 TrueNAS 的 SSH ，CD 到镜像目录下，使用命令将刚刚下载的镜像写入创建的 Zvol 中：
```shell
dd if=openwrt-11.19.2023-x86-64-generic-squashfs-combined-efi.img of=/dev/zvol/root/vm/OPENWRT_K9 bs=1M
```

至此镜像就算安装完毕了。


### 三、修改TrueNAS网络为桥接

在全局的网络接口处添加一个网桥，让网络走了桥接再走物理的网卡接口，具体配置如下：

![Bridge](https://oss.magese.com/blog/b1544f532307de1c)


### 四、创建TrueNAS虚拟机

#### 1. 操作系统 - Operating System

系统类型选择 Linux ，启动模式选择 UEFI ，其它选项随意就好

![Operating System](https://oss.magese.com/blog/83fc6113215940f9)


#### 2. CPU内存 - CPU and Memory

根据 NAS 的配置来填写，我这里是填的是 2 2 2， 1 1 1 也够用了，内存最好在 2G 以上。

![CPU and Memory](https://oss.magese.com/blog/9932863dfc999541)


#### 3. 磁盘 - Disks

选择已存在的镜像，磁盘类型选择 VirtIO ，zvol 就选择我们之前创建并刷了镜像的那个即可。

![Disks](https://oss.magese.com/blog/5714d86dec7e0956)

#### 4. 网络接口 - Network Interface

适配类型选择 VirtIO ，连接网卡选择之前配置的网桥 br0 。

![Network Interface](https://oss.magese.com/blog/c150da6af6be0b46)


#### 5. 其余配置 - Other

安装包不需要选择，留空即可，其余配置保持默认即可。

![Other](https://oss.magese.com/blog/22342c6403de1cfd)


### 五、配置OpenWrt

使用 TrueNAS 虚拟机的显示功能，可以看到已经启动成功，可以使用以下命令修改 root 的登录密码（可选）：

```shell
passwd
```

![openwrt ssh](https://oss.magese.com/blog/a24ebe6ae03ce0d8)

接着修改ip及网关配置：

```shell
vi /etc/config/network
```

在 lan 口处增加以下配置：

```shell
config interface 'lan'
        option device 'br-lan'
        option proto 'static'
        option ip6assign '60'
        option ipaddr '192.168.31.234' # openwrt的静态局域网IP
        option netmask '255.255.255.0' # 子网掩码
        option gateway '192.168.31.1' # 主路由小米AX1800的网关
        list dns '192.168.31.1' # 主路由小米AX1800的DNS
```

![network](https://oss.magese.com/blog/a3e043717d9df17e)

配置完成后即可在内网使用浏览器打开 OpenWrt 的后台页面：[http://192.168.31.234](http://192.168.31.234)

![openwrt admin](https://oss.magese.com/blog/a67065904f3258d6)


登录后选择 网络 -> 防火墙 -> 常规设置 ，将 **启用 SYN-flood 防御** 选项取消勾选，并把 出站数据/入站数据/转发 都设置为 **接受**

![setting1](https://oss.magese.com/blog/bc36ad736d1f3500)

继续设置下方的区域设置，首先编辑 `LAN -> WAN` ，勾选 **IP动态伪装** ，涵盖的网络选择 **lan**

![setting2](https://oss.magese.com/blog/263fe7f84c8f7a55)

继续编辑 `WAN -> ACCEPT` ，具体配置如下图：

![setting3](https://oss.magese.com/blog/6848710c2eee5b80)

至此 OpenWrt 算是初步设置完成，我们回到主路由以及NAS等其它设备，设置 OpenWrt 为旁路由。


## 设置OpenWrt为旁路由

### Windows

打开`网络和Internet设置`设置 IPv4 网络，IP 设置为本机 DHCP 分配的 IP 地址，子网掩码与主路由保持一致，默认网关填 OpenWrt 的 IP ：

```properties
IP 地址=192.168.31.92
子网掩码=255.255.255.0
默认网关=192.168.31.234
首选 DNS 服务器=192.168.31.234
备用 DNS 服务器=233.5.5.5
```

![setting](https://oss.magese.com/blog/6848710c2eee5b80)


### iPhone

连接 WiFi 后点击右边的感叹号，选择配置 IPv4，选择手动配置，IP 填写为 DHCP 分配的 IP 地址，路由器填写为 OpenWrt 的 IP ：

```properties
IP 地址=192.168.31.111
子网掩码=255.255.255.0
路由器=192.168.31.234
```

![iphone_setting](https://oss.magese.com/blog/2a7a609f79d980b7)


### TrueNAS

选择 `Network` 标签，点击 `Global Configuration` 的 `Settings` ，
在 `DNS Servers` 的 `Nameserver1` 和 `Default Gateway` 的 `IPv4 Default Gateway` 填写 OpenWrt 的 IP ，
其它 `DNS Servers` 填入任意DNS服务器即可：

![truenas_setting](https://oss.magese.com/blog/8f1aa9d0975355c2)


## 总结

至此就算配置好了所有的设备使用旁路由进行网络连接，可以愉快的使用各设备进行上网测试，如果需要科学上网，可以在 OpenWrt 安装 PassWall 等插件进行配置，欢迎各位大佬在评论区交流~

### 参考文档

> [OpenWrt旁路由设置教程:超详细解析+教程 - 科学上网](https://www.iyio.net/2023/04/241127.html)
> [Truenas iKuai主路由 OpenWrt旁路由搭建 - Jacks Blog](https://blog.dreamtobe.cn/nas_main_bypass_router_build/#旁路由OpenWrt搭建)
