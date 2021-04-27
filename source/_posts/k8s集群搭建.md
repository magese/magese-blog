---
title: k8s集群搭建
date: 2020-12-24 23:34:02
updated: 2020-12-24 23:34:02
categories: 技术
tags: 
  - k8s
  - Docker
  - DevOps
index_img: https://images.magese.com/kubernetes.io_.png
banner_img: https://images.magese.com/kubernetes.io_.png
---


# k8s集群搭建

## 官方文档
> [kubernetes](https://kubernetes.io/)

## 1.服务器准备

#### 关闭防火墙

```shell
sudo systemctl stop firewalld
sudo systemctl disable firewalld
```

#### 关闭selinux

```shell
sudo sed -i 's/enforcing/disabled/' /etc/selinux/config
sudo setenforce 0
```

#### 关闭swap

```shell
# 临时
sudo swapoff -a
# 永久
sudo sed -ri 's/.*swap.*/#&/' /etc/fstab
# 验证，swap必须为0
free -g
```

#### 添加主机名与IP对应关系

```shell
# 查看hostname
hostname
# 修改hostname
hostnamectl set-hostname <newhostname>
# 修改hosts文件
vi /etc/hosts
# 添加对应关系
172.31.47.250 k8s-node1
172.31.47.227 k8s-node2
172.31.33.10  k8s-node3
```

#### 将桥接的IPv4流量传递到iptables的链

```shell
sudo bash -c "cat > /etc/sysctl.d/k8s.conf" << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
# 应用配置
sudo sysctl --system
```

#### 问题

```shell
# 提示只读文件系统，运行一下命令
mount -o remount rw /
# 查看时间（可选）
date
yum install -y ntpdate
# 同步最新时间
ntpdate time windows.com
# 修改时区
timedatectl set-timezone Asia/Shanghai
```

## 2.安装Docker、kubelet、kubeadm、kubectl

#### 卸载之前的docker

```shell
sudo yum remove docker \
docker-client \
docker-client-latest \
docker-common \
docker-latest \
docker-latest-logrotate \
dokcer-engine

sudo systemctl stop docker
sudo yum list installed |grep docker
sudo rpm -qa |grep docker
sudo yum -y remove docker-ce.x86_64
sudo yum -y remove docker-ce-cli-19.03.12-3.el7.x86_64
sudo yum -y remove containerd.io.x86_64
```

#### 安装Docker-CE

```shell
# 安装必须的依赖
sudo yum install -y yum-utils \
device-mapper-persistent-data \
lvm2
# 设置docker repo的yum源
sudo yum-config-manager \
--add-repo \
https://download.docker.com/linux/centos/docker-ce.repo
# 安装docker，以及docker-cli
sudo yum install -y docker-ce docker-ce-cli containerd.io
# 配置docker加速（可选）
sudo mkdir -p /etc/docker
sudo tee /etc/docker/deamon.json <<-'EOF'
{
	"registry-mirrors":["https://82m9ar63.mirror.aliyuncs.com"]
}
EOF
sudo systemctl deamon-reload
sudo systemctl restart docker
# 配置开机启动
sudo systemctl enable docker
```

#### 添加阿里云yum源

```shell
sudo bash -c "cat > /etc/yum.repos.d/kubernetes.repo" << EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

#### 安装kubeadm，kubelet和kubectl

```shell
# 查看版本
yum list | grep kube
# 指定版本安装
sudo yum install -y kubelet-1.17.3 kubectl-1.17.3 kubeadm-1.17.3 kubernetes-cni-1.17.3
# 启动及开机启动
sudo systemctl enable kubelet
sudo systemctl start kubelet
```

## 3.部署Kubernetes Master

#### master节点初始化

```
sudo kubeadm init \
--apiserver-advertise-address=172.31.47.250 \
--image-repository registry.aliyuncs.com/google_containers \
--kubernetes-version v1.17.3 \
--service-cidr=10.96.0.0/16 \
--pod-network-cidr=10.244.0.0/16
```

#### 使用kubectl工具

```shell
# 复制如下命令直接执行
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

```shell
# 查看kubelet日志
journalctl -u kubelet
# 加入master节点
sudo kubeadm join 172.31.47.250:6443 --token 2rjr7s.f0y0o01jsxkxdyxg \
    --discovery-token-ca-cert-hash sha256:aaa76d36dc6046a673a445ac3ea30274e98a5fa1e8100d1994484920b6f3050f
```

## 4.安装Pod网络插件(CNI)

#### 安装插件

```shell
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```

#### 查看是否部署成功

```shell
kubectl get pods -n kube-system
```

#### 再次查看node

```shell
kubectl get node
```



## 5.卸载

```
sudo kubeadm reset
sudo rpm -qa|grep kube*|xargs sudo rpm --nodeps -e
sudo docker images -qa|xargs sudo docker rmi -f
sudo rm -rf $HOME/.kube
```





