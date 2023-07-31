---
title: 分布式系统之一致性协议 2PC/3PC/Paxos算法介绍
excerpt: 分布式存储中间件，都涉及一个关键技术，就是高可用。比如我们常用的mysql集群，zookeeper集群，kafka集群等，都需保证多节点服务，当某些节点不可用时，不影响整个系统的服务提供。
date: 2023-01-05 11:42:08
updated: 2023-01-05 11:42:08
categories: 技术
tags:
  - 分布式
index_img: https://oss.magese.com/blog/54318c8f3ae6cfae
banner_img: https://oss.magese.com/blog/54318c8f3ae6cfae
---

# 一致性协议 2PC/3PC/Paxos算法介绍

## 一、一致性协议概述

分布式存储中间件，都涉及一个关键技术，就是高可用。比如我们常用的mysql集群，zookeeper集群，kafka集群等，都需保证多节点服务，当某些节点不可用时，不影响整个系统的服务提供。

一致性协议的是为了维护各节点数据的一致性，换句话说，就是使集群里的节点存储的数据是一模一样的。

一致性协议一般分为单主协议与多主协议。

单主协议，即整个分布式集群中只存在一个主节点，比如2PC，3PC，Paxos，Raft，Zab协议等。

多主协议，即整个集群中不只存在一个主节点，比如Gossip，Pow协议等。

单主协议由一个主节点发出数据，传输给其余从节点，能保证数据传输的有序性。而多主协议则是从多个主节点出发传输数据，传输顺序具有随机性，因而数据的有序性无法得到保证，只保证最终数据的一致性。



## 二、一致性协议 2PC/3PC/Paxos算法

为解决分布式一致性问题，在长期的探索研究时间，涌现出一些经典的一致性协议和算法，最著名的是二阶段提交协议（2PC）、三阶段提交协议（3PC）和Paxos算法。


### 2PC和3PC

分布式事务是由多个子事务组成，那么我们可以引入协调者（Coordinator）组件来统一调度管理所有子事务，而子事务可看作为参与者（Participant）。基于此思想，衍生出了二阶段提交协议和三阶段提交协议。



### 2PC（Two-Phase Commit）

即二阶段提交，目前绝大部分的关系型数据库都是采用二阶段提交协议来完成分布式事务处理。

二阶段提交整个流程包括：阶段一提交事务请求，阶段二执行事务提交。

阶段一提交事务请求：协调者向所有参与者发送事务，参与者执行事务操作并反馈给协调者成功与否。

阶段二执行事务提交：协调者根据各参与者的反馈情况，若所有参与者执行事务反馈执行成功，则协调者通知所有协调者提交事务；若任一参与者反馈执行事务失败，则协调者通知所有协调者回滚事务。

2PC的优点：原理简单，实现方便。

2PC的缺点：同步阻塞导致事务性能差，协调者单点问题，网络分区导致脑裂数据不一致



### 3PC（Three-Phase Commit）

即三阶段提交，是2PC的改进版

改进1： 将二阶段提交协议的提交事务请求阶段进一步分为两个阶段，形成了三个阶段组成的事务处理协议：阶段一询问提交事务，阶段二提交事务请求，阶段三执行事务提交

改进2：引入超时机制

阶段一询问提交事务：协调者向所有参与者询问是否可以执行事务，参与者认为可以顺利执行事务则反馈可以并进入预备状态，否则反馈不可以。

阶段二提交事务请求：协调者根据各参与者的反馈情况，若所有参与者阶段一反馈可以，则协调者向所有参与者发送事务，参与者执行事务操作并反馈给协调者成功与否。若任一参与者阶段一反馈不可以或协调者等待参与者反馈超时，则协调者通知所有协调者回滚事务。

阶段三执行事务提交：协调者根据阶段三各参与者的反馈情况，若所有参与者执行事务反馈执行成功，则协调者通知所有协调者提交事务；若任一参与者阶段三反馈执行事务失败等待参与者反馈超时，则协调者通知所有协调者回滚事务。若参与者因各种问题比如网络故障，无法及时接收到协调者的提交事务或回滚事务，参与者会在等待超时后继续执行事务提交。

3PC的优点：相对于2PC，增加询问提交事务阶段从而降低了参与者的阻塞范围，另外加入超时机制能够在协调者单点故障后继续达成一致。

3PC的缺点：加入的超时机制引入了新的问题，那就是若在执行阶段二出现网络分区，协调者与某部分参与者无法通信，在阶段三该部分无法通信的参与者依然进行超时事务提交，很有可能会出现数据不一致。



### Paxos算法

#### Paxos算法简介

2PC和3PC协议因其缺点阻塞且不能保证数据一致性，在实际应用中较少使用。Paxos算法是目前公认的解决分布式一致性问题最有效的算法之一，由莱斯利兰伯特（Leslie Lamport）于1990年提出的一种基于消息传递且有高度容错特性的一致性算法。例如较常用的系统ZooKeeper，Nacos，Consul，Etcd，Kafka，MySQL Group Replication等都是采用Paxos算法或Paxos衍生算法来解决分布式一致性问题。

Paxos算法运行在允许宕机故障的异步系统中，可容忍消息丢失、延迟、乱序以及重复等。它利用超过半数的机制保证了2F+1的容错能力，即2F+1个节点的系统最多允许F个节点同时出现故障。


拜占庭问题：是指拜占庭帝国军队的将军们必须全体一致的决定是否攻击某一支敌军。问题是这些将军在地理上是分隔开来的，只能依靠通讯员进行传递命令，但是通讯员中存在叛徒，它们可以篡改消息，叛徒可以欺骗某些将军采取进攻行动；促成一个不是所有将军都同意的决定，如当将军们不希望进攻时促成进攻行动；或者迷惑某些将军，使他们无法做出决定。Paxos算法的前提假设是不存在拜占庭将军问题，即：信道是安全的（信道可靠），发出的信号不会被篡改。从理论上来说，在分布式计算领域，试图在异步系统和不可靠信道上来达到一致性状态是不可能的。因此在对一致性的研究过程中，都往往假设信道是可靠的。而事实上，大多数系统都是部署在一个局域网中，因此消息被篡改的情况很罕见；另一方面，由于硬件和网络原因而造成的消息不完整问题，只需要一套简单的校验算法即可。因此，在实际工程中，可以假设所有的消息都是完整的，也就是没有被篡改。


Paxos算法将系统中的角色分为提议者 (Proposer)，决策者 (Acceptor)，和最终决策学习者 (Learner)：

 - Proposer：提出提案 (Proposal)。Proposal信息包括提案编号 (Proposal ID) 和提议的值 (Value)。

 - Acceptor：参与决策，回应Proposers的提案。收到Proposal后可以接受提案，若Proposal获得超过半数Acceptor的接受，则称该Proposal被批准。

 - Learner：不参与决策，从Acceptor学习最新达成一致的提案（Value）。

在具体的实现中，一个进程可能同时充当多种角色。比如一个进程可能既是Proposer又是Acceptor又是Learner

一个或多个提议进程 (Proposer) 可以发起提案 (Proposal)，Paxos算法使所有提案中的某一个提案，在所有进程中达成一致。系统中的多数派（即超半数）同时认可该提案，即达成了一致。最多只针对一个确定的提案达成一致。



#### Paxos算法陈述

Paxos算法通过一个决议分为两个阶段（Learn阶段之前决议已经形成）：

 1. 第一阶段：Prepare阶段。Proposer向所有Acceptor发出Prepare请求，Acceptor针对收到的Prepare请求进行Promise承诺。

 2. 第二阶段：Accept阶段。Proposer收到多数Acceptor承诺的Promise后，向Acceptor发出Propose请求，Acceptor针对收到的Propose请求进行批准处理。

 3. 第三阶段：Learn阶段。Proposer在收到多数Acceptor的批准之后，标志着本次批准成功，决议形成，Acceptor将达成的决议发送给所有Learner。



Paxos算法流程中的每条消息描述如下：

 - Prepare: Proposer生成全局唯一且递增的提案编号Proposal ID (可使用时间戳加Server ID)，向所有Acceptor发送Prepare请求，这里无需携带提案内容，只携带Proposal ID即可。

 - Promise: Acceptor收到Prepare请求后，做出“两个承诺，一个应答”。


两个承诺：

 1. 不再接受Proposal ID小于等于（注意：这里是<= ）当前请求的Prepare请求。

 2. 不再接受Proposal ID小于（注意：这里是< ）当前请求的Propose请求。

一个应答：

不违背以前作出的承诺下，回复已经批准过的提案中Proposal ID最大的那个提案的Value和Proposal ID，没有则返回空值。


 - Propose: Proposer 收到多数Acceptor的Promise应答后，从应答中选择Proposal ID最大的提案的Value，作为本次要发起的提案。如果所有应答的提案Value均为空值，则可以自己随意决定提案Value。然后携带当前Proposal ID，向所有Acceptor发送Propose请求。

 - Accept: Acceptor收到Propose请求后，在不违背自己之前作出的承诺下，接受并持久化当前Proposal ID和提案Value。

 - Learn: Proposer收到多数Acceptor的Accept后，决议形成，将形成的决议发送给所有Learner。



#### Paxos算法伪代码

![Basic Paxos](https://oss.magese.com/blog/54318c8f3ae6cfae)


第一阶段

 1. Proposer生成一个全局唯一且递增的提案编号n；

 2. Proposer向所有Acceptors广播Prepare(n)请求；

 3. Acceptor收到Prepare(n)请求，比较n和minProposal，如果n>minProposal，则设置minProposal=n（这里的minProposal机制是说明Acceptor承诺不会再批准任何编号小于n的提案）；并且Acceptor将它曾经已批准过的最大编号的提案中的提案编号acceptedProposal 和 提案值acceptedValue 返回给Proposer；

 4. Proposer接收到过半数回复后，如果发现有acceptedValue返回，将所有回复中编号最大的acceptedProposal中的acceptedValue作为本次提案的value，否则可以任意决定本次提案的value；



第二阶段

 1. Proposer广播Accept (n,value) 到所有节点；

 2. Acceptor比较n和minProposal，如果n>=minProposal，则acceptedProposal=minProposal=n，acceptedValue=value，本地持久化后，返回；否则，返回minProposal。

 3. Proposer接收到过半数请求后，如果发现有返回值result >n，表示有更新的提议，跳转到1；否则value达成一致


注：Acceptor需持久化minProposal, accetpedProposal, acceptedValue



#### Learner获取批准的提案

如何让Learner获取提案，大体有以下几种方案


方案1：

> Acceptor批准了一个提案，就将该提案发送给所有的Learner。
> 
> 优点：可以让Learner尽快地获取被选定的提案
> 
> 缺点：通信次数为两者的乘积，则Acceptor个数和Learner个数的乘积



方案2：

> Acceptor统一发送给一个特定的Learner（主Learner）
> 
> 优点：通信次数大大减少，通信次数为Acceptor和Learner个数总和
> 
> 缺点：主Learner单点故障问题




方案3：

> Acceptor统一发送给一个特定的Learner集合，该集合中的每个Learner都可以再一个提案被选定后通知所有其他的Learner集合。
> 
> 优点：Learner集合个数越多，可靠性越好
> 
> 缺点：通信次数多，通信的复杂度高



#### Basic Paxos

上边我们介绍了Paxos的算法的核心逻辑，我们又叫原始的Paxos算法（Basic Paxos）。

Basic Paxos有三个缺点：

 1. 只描述了对一个提案的决议

 2. 协议形成的prepare阶段，多个Proposer进行提议，发送给所有Acceptor节点，网络开销大的问题

 3. 协议形成的prepare阶段，多个Proposer进行提议，极端情况下可能陷入死循环，无法完成第二阶段，也就是无法选定一个提案。



#### 通过选主Proposer保证Basic Paxos算法的活性

上面Basic Paxos算法运行过程中，有可能会陷入死循环，无法完成第二阶段，也就是最终无法选定一个提案。

为保证Paxos算法流程的活性，避免陷入死循环，必须选择一个主Proposer，并规定只有主Proposer才能提出议案。这样一来，只要主Proposer和过半的Acceptor能够正常进行网络通信，那么肯定会有一个提案被批准（第二阶段的accept）。



#### Multi Paxos
Multi Paxos算法，针对Basic Paxos的缺点进行了优化。Multi Paxos算法在所有Proposer中选举一个主Proposer（又叫为Leader)，由Leader唯一地提交提案给Acceptor进行表决，解决了死循环的问题。在系统中仅有一个Leader进行提案提交的情况下，prepare阶段就可以跳过，从而将两阶段变为一阶段，提高效率。

Leader的选举算法可以使用Basic Paxos算法，依然需要两阶段，可以使用随机时间性保证Basic Paxos算法的活性解决死循环问题。一旦选出leader，后面的提案就不用再经历prepare阶段了。

然而在相关Paxos论文中并没有对Multi Paxos算法有完善细节的解析。实际的实现系统一般采用Multi Paxos算法。



#### Paxos算法的工程实现

我们从理论上讲解了Paxos算法，然而Paxos算法是相对难理解，且没有提供完善的细节基础，所以在实际工程实现的过程中会遇到相当多的细节问题需处理，比如如何选主，如何在保证数据一致性的情况下兼顾稳定性和性能，导致在实现性上有一定的难度。

虽Paxos算法相对难以理解与缺少完善的细节实现基础，但也有相当一部分的工业级系统采用Paxos算法，在一些工程实践上得到了证实，比如Google Chubby是基于Paxos算法实现的一套分布式锁服务系统，阿里巴巴OceanBase是基于Paxos算法实现的的一套分布式数据库系统等等，在实现上需处理较多的细节问题。

在另外一些工业级的系统中，比如Zookeeper采用的ZAB算法，Nacos采用的Raft算法等，都是从Paxos算法衍生精简优化后的一致性算法。



## 小结
二阶段提交协议、三阶段提交协议和Paxos，从不同方面不同程度地解决了分布式数据一致性问题。

二阶段提交协议，解决了分布式事务的原子性问题，保证了分布式事务的多个参与者要么都执行成功，要么都执行失败。但是依然存在一些难以解决诸如同步阻塞，无限期等待和脑裂等问题。

三阶段提交协议则是在二阶段提交协议的基础上，添加了询问提交事务过程和超时机制，从而减少阻塞范围与解决无限期等待问题。但是依然会存在脑裂问题数据不一致。

Paxos算法引入了过半的理念，则少数服从多数。同时，Paxos算法支持分布式节点角色之间的轮换，这极大地避免了分布式单点问题的出现。因为Paxos算法既解决了无限期等待问题，也解决了脑裂数据不一致问题，是目前来说最优秀的分布式一致性协议。

