---
title: JAVA-使用InitializingBean实现工厂模式
excerpt: 在实际开发过程中，工厂模式的使用是比较频繁的，而使用 InitializingBean 可以简化工厂处理器类的初始化与注册。
date: 2023-12-01 16:15:55
updated: 2023-12-01 16:15:55
categories: 
  - 技术
tags:
  - JAVA
  - Spring
index_img: https://oss.magese.com/blog/bc5e7f3c93e03577
banner_img: https://oss.magese.com/blog/bc5e7f3c93e03577
---

# 使用InitializingBean实现工厂模式


## 前言

在实际开发过程中，工厂模式的使用是比较频繁的，而使用`InitializingBean`可以简化工厂处理器类的初始化与注册。

下面就简单演示如何创建一个完整的工厂模式。


## 类结构

整体结构如下图所示：

![](https://oss.magese.com/blog/6a6ed3f96bf7f9c2)


**OrderFactory:** 订单工厂类，用于获取处理器以及注册处理器。

**OrderHandler:**  订单处理器接口 Interface，继承 `InitializingBean`，定义处理器的方法。

**AbstractOrderHandler:**  订单处理器抽象实现，实现 `OrderHandler` ，可以给一些接口中的方法定义一个默认实现。

**FlightOrderHandler:**  飞机票订单处理器，继承 `AbstractOrderHandler` ，处理飞机票订单的自定义实现，并将处理器注册至工厂中。

**TrainOrderHandler:**  火车票订单处理器，继承 `AbstractOrderHandler` ，处理火车票订单的自定义实现，并将处理器注册至工厂中。

**HotelOrderHandler:**  酒店订单处理器，继承 `AbstractOrderHandler` ，处理酒店订单的自定义实现，并将处理器注册至工厂中。



## 具体实现

### OrderFactory

```java
/**
 * 订单工厂类
 * 
 * @author Magese
 * @since 2023/11/30 9:40
 */
public class OrderFactory {

    public enum OrderType {
        HOTEL, FLIGHT, TRAIN
    }

    private static final Map<OrderType, OrderHandler> HANDLER_MAP = new HashMap<>();

    /**
     * 获取处理器
     *
     * @param orderType 订单类型枚举
     * @return 订单处理器
     */
    public static OrderHandler getHandler(OrderType orderType) {
        if (HANDLER_MAP.containsKey(orderType)) {
            OrderHandler handler = HANDLER_MAP.get(orderType);
            Log.info("获取处理器：{}", handler.getClass().getName());
            return handler;
        } else {
            throw new UnsupportedOperationException("不支持的处理类型：" + orderType);
        }
    }

    /**
     * 注册处理器
     *
     * @param orderType    订单类型枚举
     * @param orderHandler 订单处理器
     */
    public static void register(OrderType orderType, OrderHandler orderHandler) {
        Log.info("注册处理器：{}", orderHandler.getClass().getName());
        if (HANDLER_MAP.containsKey(orderType)) {
            throw new UnexpectedTypeException("当前处理类型已被注册：" + orderType);
        }
        HANDLER_MAP.put(orderType, orderHandler);
    }
}
```


### OrderHandler

```java
/**
 * 订单处理器接口
 *
 * @author Magese
 * @since 2023/11/30 9:42
 */
public interface OrderHandler extends InitializingBean {
    /**
     * 下单
     *
     * @param request 下单请求
     * @return 订单
     */
    Order order(OrderRequest request);

    /**
     * 支付
     *
     * @param request 支付请求
     * @return 支付结果
     */
    PayResult pay(PayRequest request);

    /**
     * 回调
     *
     * @param request 回调请求
     */
    void callback(CallbackRequest request);
}
```


### AbstractOrderHandler

```java
/**
 * 抽象订单处理器
 *
 * @author Magese
 * @since 2023/12/1 11:22
 */
@Slf4j
public abstract class AbstractOrderHandler implements OrderHandler {
    @Override
    public PayResult pay(PayRequest request) {
        log.info("通用的支付处理");
        return new PayResult();
    }
}
```


### FlightOrderHandler

```java
/**
 * 飞机票订单处理器
 *
 * @author Magese
 * @since 2023/11/30 9:45
 */
@Component
@Slf4j
public class FlightOrderHandler extends AbstractOrderHandler {
    @Override
    public Order order(OrderRequest request) {
        log.info("飞机票下单处理");
        return new Order();
    }

    @Override
    public void callback(CallbackRequest request) {
        log.info("飞机票回调处理");
    }

    @Override
    public void afterPropertiesSet() {
        OrderFactory.register(OrderFactory.OrderType.FLIGHT, this);
    }
}
```


### TrainOrderHandler

```java
/**
 * 火车票订单处理器
 *
 * @author Magese
 * @since 2023/11/30 9:44
 */
@Component
@Slf4j
public class TrainOrderHandler extends AbstractOrderHandler {
    @Override
    public Order order(OrderRequest request) {
        log.info("火车票下单处理");
        return new Order();
    }

    @Override
    public void callback(CallbackRequest request) {
        log.info("火车票回调处理");
    }

    @Override
    public void afterPropertiesSet() {
        OrderFactory.register(OrderFactory.OrderType.TRAIN, this);
    }
}
```


### HotelOrderHandler

```java
/**
 * 酒店订单处理器
 *
 * @author Magese
 * @since 2023/11/30 9:43
 */
@Component
@Slf4j
public class HotelOrderHandler extends AbstractOrderHandler {
    @Override
    public Order order(OrderRequest request) {
        log.info("酒店下单处理");
        return new Order();
    }

    @Override
    public PayResult pay(PayRequest request) {
        log.info("酒店支付特殊处理");
        return super.pay(request);
    }

    @Override
    public void callback(CallbackRequest request) {
        log.info("酒店回调处理");
    }

    @Override
    public void afterPropertiesSet() {
        OrderFactory.register(OrderFactory.OrderType.HOTEL, this);
    }
}
```


## 使用示例

```java
/**
 * 订单业务处理
 *
 * @author Magese
 * @since 2023/12/1 11:47
 */
@Slf4j
@Service
public class OrderService {

    /**
     * 确认订单
     *
     * @param orderType    订单类型
     * @param orderRequest 下单请求
     * @param payRequest   支付请求
     */
    public void orderConfirm(OrderFactory.OrderType orderType, OrderRequest orderRequest, PayRequest payRequest) {
        log.info("接收到确认订单请求，订单类型：{}，下单请求：{}，支付请求：{}", orderType, orderRequest, payRequest);

        OrderHandler handler = OrderFactory.getHandler(orderType);

        Order order = handler.order(orderRequest);
        log.info("订单信息：{}", order);

        payRequest.setOrder(order);
        PayResult payResult = handler.pay(payRequest);
        log.info("支付结果：{}", payResult);
    }

    /**
     * 订单回调
     *
     * @param orderType       订单类型
     * @param callbackRequest 回调请求
     */
    public void orderCallback(OrderFactory.OrderType orderType, CallbackRequest callbackRequest) {
        log.info("接收到订单回调请求，订单类型：{}，回调请求：{}", orderType, callbackRequest);

        OrderHandler handler = OrderFactory.getHandler(orderType);
        handler.callback(callbackRequest);
    }
}
```



## 总结

其实整体上来说和普通的工厂模式没有很大的区别，主要是利用了`InitializingBean`接口在Spring初始化Bean之后的钩子，方便我们在应用启动时就注册装载好工厂的处理器。




