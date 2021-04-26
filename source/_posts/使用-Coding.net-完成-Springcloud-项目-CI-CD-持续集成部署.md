---
title: 使用 coding.net 完成 Springcloud 项目 CI/CD 持续集成部署
date: 2021-04-26 10:07:56
updated: 2021-04-26 10:07:56
categories: 技术
tags:
  - coding.net
  - CI/CD
  - Dokcer
  - Springcloud
  - Jenkins
index_img: https://images.magese.com/2021-04-26.coding.banner.png
banner_img: https://images.magese.com/2021-04-26.coding.banner.png
---

# 使用 Coding.net 完成项目 CI/CD 持续集成部署

## 一、项目准备

准备一个用于 CI/CD 的 Springcloud 项目

![项目结构](https://images.magese.com/2021-04-26.coding.01.png)

> - api-common: 项目通用依赖、配置与工具类模块
> - api-gateway: springcloud-gateway 路由模块
> - api-auth: spring-security 鉴权模块
> - api-web: WEB-API 业务模块

并在需要打包的模块根目录中添加 `Dockerfile`

![Dockerfile](https://images.magese.com/2021-04-26.coding.02.png)

例如 gateway 模块：

```
FROM magese-docker.pkg.coding.net/api.magese.com/docker/openjdk:8

EXPOSE 8000

COPY /api-gateway/target/api-gateway.jar api-gateway.jar

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dfile.encoding=UTF-8", "-jar", "api-gateway.jar"]

```


## 二、创建项目

在 [coding.net](https://coding.net) 选择创建 Devops 项目
![创建项目](https://images.magese.com/2021-04-26.coding.03.png)


## 三、新建制品库

在刚刚创建好的项目中新建 Docker 制品库
![新建制品库](https://images.magese.com/2021-04-26.coding.04.png)


## 四、新建构建计划

在之前创建的项目中新建持续构建计划

### 1. 选择新建构建计划

选择 Java + Spring + Docker 模板
![新建构建计划](https://images.magese.com/2021-04-26.coding.05.png)

### 2. 代码仓库

根据代码储存的仓库选择对应的仓库
![选择代码仓库](https://images.magese.com/2021-04-26.coding.06.png)

### 3. 编辑构建

取消单元测试，编译构建暂不做改动
![编译构建](https://images.magese.com/2021-04-26.coding.07.png)

### 4. Docker镜像

构建 Docker 镜像暂不做修改，Docker 制品库选择之前创建好的制品库
![Docker镜像](https://images.magese.com/2021-04-26.coding.08.png)

### 5. 部署到远端服务

启用部署到远端服务器，填入对应的字段
![部署到远端服务](https://images.magese.com/2021-04-26.coding.09.png)

最后确认创建即可


## 五、修改环境变量

在刚刚新建好的构建计划选择设置
![设置](https://images.magese.com/2021-04-26.coding.10.png)

选择变量与缓存
![设置](https://images.magese.com/2021-04-26.coding.11.png)

全部变量配置如下：

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| `DOCKER_BUILD_CONTEXT` | . | Docker 构建上下文环境 |
| `DOCKER_IMAGE_VERSION` | ${GIT_LOCAL_BRANCH:-branch} | Docker 镜像版本-${GIT_COMMIT} |
| `DOCKER_REPO_NAME` | docker | 当前项目下的 Docker 制品仓库名 |
| `DOCKER_USERNAME` | 	docker-********** | Docker制品库用户名 |
| `DOCKER_PASSWORD` | **************** | Docker制品库密码 |
| `GATEWAY_IMAGE_NAME` | api-gateway | 模块gateway镜像名称 |
| `WEB_IMAGE_NAME` | api-web | 模块web镜像名称 |
| `AUTH_IMAGE_NAME` | api-auth | 模块auth镜像名称 |
| `REMOTE_HOST` | 120.**.***.33 | 远程服务地址 |
| `REMOTE_SSH_PORT` | 22 | 远程服务端口 |
| `REMOTE_USER_NAME` | root | SSH 用户名 |
| `REMOTE_CRED` | **************** | SSH 登录凭据 |
| `DOCKER_COMPOSE_PATH` | ~/docker-compose.yml | docker-compose 配置路径 |


Docker 制品库的用户名密码可在制品仓库获取
![制品仓库](https://images.magese.com/2021-04-26.coding.12.png)


## 六、修改 Jenkins 流水线文件 (重点)

选择流程配置-文本编辑器
![文本编辑器](https://images.magese.com/2021-04-26.coding.13.png)


### 1. 拉取代码

这一步无需做修改
```groovy
stage('从仓库中拉取代码') {
  steps {
    checkout([$class: 'GitSCM', 
    branches: [[name: GIT_BUILD_REF]],
    userRemoteConfigs: [[
      url: GIT_REPO_URL,
      credentialsId: CREDENTIALS_ID
    ]]])
  }
}
```

### 2. 编译打包

项目使用的 Maven 编译，所以将这一步修改为 Maven 命令，并跳过测试与文档构建
```groovy
stage('编译打包') {
  steps {
    sh 'mvn clean package -Dmaven.javadoc.skip=true -Dmaven.test.skip=true'
  }
}
```

### 3. 登录 Docker 制品库

将原有的 `stage('构建镜像并推送到 CODING Docker 制品库')` 整个删掉，修改为
```groovy
stage('登录 Docker 制品库') {
  steps {
    sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD} ${CODING_DOCKER_REG_HOST}"
  }
}
```

### 4. 构建 & 推送

因为构建的项目是 Springcloud ，有多个子模块，所以需要多次打包推送


> 命令说明：
> `docker build`: <small>构建 Docker 镜像，`-t` 指定镜像名称，`-f` 指定 Dockerfile 的路径， `DOCKER_BUILD_CONTEXT` 指定构建镜像时的上下文环境。</small>
> `docker images`: <small>查看镜像列表。</small>
> `docker tag`: <small>给本地镜像打标签。</small>
> `docker push`: <small>推送本地镜像到远程仓库中。</small>


```groovy
stage('构建推送 api-gateway 模块') {
  steps {
    sh """
        docker build -t ${GATEWAY_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -f /root/workspace/${GATEWAY_IMAGE_NAME}/Dockerfile ${DOCKER_BUILD_CONTEXT}
        docker images ${GATEWAY_IMAGE_NAME}
        docker tag ${GATEWAY_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} magese-docker.pkg.coding.net/api.magese.com/docker/${GATEWAY_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
        docker push magese-docker.pkg.coding.net/api.magese.com/docker/${GATEWAY_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
    """
  }
}

stage('构建推送 api-web 模块') {
  steps {
    sh """
        docker build -t ${WEB_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -f /root/workspace/${WEB_IMAGE_NAME}/Dockerfile ${DOCKER_BUILD_CONTEXT}
        docker images ${WEB_IMAGE_NAME}
        docker tag ${WEB_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} magese-docker.pkg.coding.net/api.magese.com/docker/${WEB_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
        docker push magese-docker.pkg.coding.net/api.magese.com/docker/${WEB_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
    """
  }
}

stage('构建推送 api-auth 模块') {
  steps {
    sh """
        docker build -t ${AUTH_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -f /root/workspace/${AUTH_IMAGE_NAME}/Dockerfile ${DOCKER_BUILD_CONTEXT}
        docker images ${AUTH_IMAGE_NAME}
        docker tag ${AUTH_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} magese-docker.pkg.coding.net/api.magese.com/docker/${AUTH_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
        docker push magese-docker.pkg.coding.net/api.magese.com/docker/${AUTH_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
    """
  }
}
```

### 5. 部署

修改`stage("部署到远端服务")`，使用 docker-compose 进行部署

> 命令说明：
> `docker-compose down`: <small>停止并删除配置文件中指定的镜像容器，`-f` 指定 docker-compose.yml 配置文件路径，`--rmi all` 删除配置文件中指定的镜像列表。</small>
> `docker-compose up`: <small>启动配置文件中指定的镜像容器，`-f` 指定 docker-compose.yml 配置文件路径，`-d` 表示后台运行。</small>

```groovy
stage('部署') {
  steps {
    script {
      def remoteConfig = [:]
      remoteConfig.name = "my-remote-server"
      remoteConfig.host = "${REMOTE_HOST}"
      remoteConfig.port = "${REMOTE_SSH_PORT}".toInteger()
      remoteConfig.allowAnyHosts = true

      withCredentials([
        sshUserPrivateKey(
          credentialsId: "${REMOTE_CRED}",
          keyFileVariable: "privateKeyFilePath"
        )
      ]) {
        // SSH 登陆用户名
        remoteConfig.user = "${REMOTE_USER_NAME}"
        // SSH 私钥文件地址
        remoteConfig.identityFile = privateKeyFilePath

        sshCommand(
          remote: remoteConfig,
          command: "docker-compose -f ${DOCKER_COMPOSE_PATH} down --rmi all",
          sudo: true,
        )

        sshCommand(
          remote: remoteConfig,
          command: "docker-compose -f ${DOCKER_COMPOSE_PATH} up -d",
          sudo: true,
        )

        echo "Deploy success! Go to http://api.magese.com/doc.html for a preview."
      }
    }
  }
}
```

## 七、修改触发规则

修改触发规则，当代码提交或合并到 `master` 分支时自动进行构建、部署

> ![触发规则](https://images.magese.com/2021-04-26.coding.14.png)
`^refs/((heads/master)|(tags/.*))`


## 八、服务器配置

### 1. Docker 环境

服务器需要有 docker 相关的环境，docker 安装可参考：
> [CentOS Docker 安装](https://www.runoob.com/docker/centos-docker-install.html)

### 2. Docker Compose 环境

因部署使用的是 `docker-compose.yml` 配置文件形式，所以需要安装 Docker Compose 环境：
```
curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-Linux-x86_64" -o /usr/local/bin/docker-compose
```

如需安装其它版本，查看Github发行版本页：
> [Github 最新发行版本](https://github.com/docker/compose/releases)

修改权限：
```shell
chmod +x /usr/local/bin/docker-compose
```

创建软链：
```shell
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

测试是否安装成功：
```
docker-compose --version
docker-compose version 1.29.1, build c34c88b2
```

### 3. 添加 docker-compose.yml 配置文件

配置文件说明：

| 配置名 | 说明 |
| ---- | ---- |
| `services` | 服务列表，可配置多个 |
| `container_name` | 容器名称 |
| `image` | 使用的 docker 镜像 |
| `env_file` | 环境变量配置文件 |
| `environment` | 环境变量 |
| `ports` | 端口映射 |
| `volumes` | 目录挂载 |

```yaml
version: '3.5'
services:
  api-gateway:
    container_name: api-gateway
    image: magese-docker.pkg.coding.net/api.magese.com/docker/api-gateway:master
    env_file:
      - ./master.env
    environment:
      - JAVA_TOOL_OPTIONS=-Xms256m -Xmx256m -Xmn128m
    ports:
      - "8000:8000"
    volumes:
      - /usr/local/magese/magese-api/logs:/usr/local/magese/magese-api/logs
      - /etc/timezone:/etc/timezone
      - /etc/localtime:/etc/localtime

  api-web:
    container_name: api-web
    image: magese-docker.pkg.coding.net/api.magese.com/docker/api-web:master
    env_file:
      - ./master.env
    environment:
      - JAVA_TOOL_OPTIONS=-Xms512m -Xmx512m -Xmn256m
    ports:
      - "8001:8001"
    volumes:
      - /usr/local/magese/magese-api/logs:/usr/local/magese/magese-api/logs
      - /etc/timezone:/etc/timezone
      - /etc/localtime:/etc/localtime

  api-auth:
    container_name: api-auth
    image: magese-docker.pkg.coding.net/api.magese.com/docker/api-auth:master
    env_file:
      - ./master.env
    environment:
      - JAVA_TOOL_OPTIONS=-Xms256m -Xmx256m -Xmn128m
    ports:
      - "8002:8002"
    volumes:
      - /usr/local/magese/magese-api/logs:/usr/local/magese/magese-api/logs
      - /etc/timezone:/etc/timezone
      - /etc/localtime:/etc/localtime
```

环境配置文件
```properties
spring.profiles.active=master
NACOS_CONFIG_ADDR=http://nacos.magese.com
NACOS_SERVER_ADDR=http://nacos.magese.com:80
NACOS_SERVER_NAMESPACE=master
NACOS_SERVER_DUBBO_ADDR=nacos://nacos.magese.com:80
NACOS_SERVER_DUBBO_NAMESPACE=master-dubbo
```

## 九、测试构建

推送代码触发构建，在 coding 中查看构建过程：
> ![构建过程](https://images.magese.com/2021-04-26.coding.15.png)

全部绿了就表示成功啦！
