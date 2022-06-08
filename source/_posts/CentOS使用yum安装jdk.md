---
title: CentOS使用yum安装jdk
excerpt: CentOS 使用 `yum` 安装jdk，并配置环境变量。
date: 2022-03-15 19:20:21
updated: 2022-03-15 19:20:21
categories: 技术
tags:
  - Java
  - Linux
  - CentOS
index_img: https://images.magese.com/blog/e8da06ea88866e49
banner_img: https://images.magese.com/blog/e8da06ea88866e49
---


# CentOS使用yum安装jdk


## 1. 使用`yum`搜索jdk安装包

```
yum search java | grep jdk
```

复制需要的jdk版本，此处以jdk8为例：

![console](https://images.magese.com/blog/24db56140a6ea604)


## 2. 使用`yum`安装jdk

```
yum install java-1.8.0-openjdk-devel.x86_64
```

输入 `y` 确认安装：

![console](https://images.magese.com/blog/353e6512cac36455)

安装完成

![console](https://images.magese.com/blog/f6682951b2d45c4a)


## 3. 查看并复制安装目录

```
ll /usr/lib/jvm
```

![console](https://images.magese.com/blog/e73dda1ed24907b5)

```
java-1.8.0-openjdk-1.8.0.312.b07-2.el8_5.x86_64
```


## 4. 配置环境变量

修改 `profile` 配置文件：

```
vi /etc/profile
```

将以下内容粘贴至文件末尾，注意 `JAVA_HOME` 填写上一步复制的jdk目录：

```
#set java environment
JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.312.b07-2.el8_5.x86_64
JRE_HOME=$JAVA_HOME/jre
CLASS_PATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JRE_HOME/lib
PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin
export JAVA_HOME JRE_HOME CLASS_PATH PATH
```

刷新配置，使其生效：

```
source /etc/profile
```


## 5. 测试查看jdk版本

```
java -version
```

![console](https://images.magese.com/blog/e8da06ea88866e49)

