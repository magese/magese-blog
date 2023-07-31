---
title: Java 优雅强转 List 与 Map 对象
excerpt: 在日常开发中经常会遇到需要将一个 Object 对象，强制转换为 List 或者 Map 。
date: 2022-08-25 08:54:37
updated: 2022-08-25 08:54:37
categories: 技术
tags:
  - Java
index_img: https://oss.magese.com/blog/3e202050a9d37102
banner_img: https://oss.magese.com/blog/3e202050a9d37102
---


# Java 优雅强转 List 与 Map 对象


## 前言

在日常开发中经常会遇到需要将一个 Object 对象，强制转换为 List 或者 Map 。


如果直接使用 `List<String> list = (List) obj` 的方式进行进行强制转换，

IDE会报出 `Unchecked assignment` 或者是 `Unchecked cast` 的警告，十分的不优雅；😅


![](https://oss.magese.com/blog/3c72e58a6eb44d9f)


所以可以定义两个转换方法在工具类中，用来转换 List 与 Map。


## 转换 List

需传入List内部对象的字节码，使用流转换内部对象：


```java
/**
 * Object 转 List
 *
 * @param obj   需转换的对象
 * @param clazz List 内部对象类型
 * @param <T>   List 内部对象类型
 * @return 指定类型的 List
 */
public static <T> List<T> castList(Object obj, Class<T> clazz) {
    if (obj == null) {
        return null;
    }
    Collection<?> collection = (Collection<?>) obj;
    return collection.stream().map(clazz::cast).collect(Collectors.toList());
}
```

## 转换 Map

需传入 key 和 value 对应的字节码对象，使用流转换内部对象：

```java
/**
 * Object 转换 Map
 *
 * @param obj        需转换的对象
 * @param keyClass   key 类型
 * @param valueClass value 类型
 * @param <K>        key 类型
 * @param <V>        value 类型
 * @return 指定类型的 Map
 */
public static <K, V> Map<K, V> castMap(Object obj, Class<K> keyClass, Class<V> valueClass) {
    if (obj == null) {
        return null;
    }
    Map<?, ?> map = (Map<?, ?>) obj;
    return map.keySet().stream().collect(Collectors.toMap(keyClass::cast, k -> valueClass.cast(map.get(k))));
}
```

## 测试效果

使用上述定义的方法进行测试：


![](https://oss.magese.com/blog/813d1d3de314e50f)


可以看到效果非常的nice，也没有烦人的Warning了。✌
