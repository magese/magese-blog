---
title: Java8-优雅记录方法执行时间
excerpt: 主要涉及内容：Java8函数式接口、Spring AOP、自定义注解。
date: 2021-07-30 20:47:27
updated: 2021-07-30 20:47:27
categories: 技术
tags:
  - Java
  - Springboot
  - 注解
index_img: https://images.magese.com/blog/6390f13fb0bde60c
banner_img: https://images.magese.com/blog/6390f13fb0bde60c
---

# Java8-优雅记录方法执行时间

**主要涉及内容：**

> - Java8函数式接口
> - Spring AOP
> - 自定义注解


**想要达到的目标效果：**

> 1. 使用一个执行时间监控类`TraceWatch`
> 2. 定义好若干个静态的方法`run(Function<E> function)`
> 3. 将需要记录执行时间的方法传入`run`方法中
> 4. 执行`run`方法后即可获取方法的执行时间与结果
> 5. 使用自定义注解，在方法上添加注解即可记录执行时间


# 实现步骤


## 一、定义执行时间监控类及函数式接口

在`TraceWatch`类中定义两个函数式接口，一个无参有返回值，一个无参无返回值：

```java
public class TraceWatch {
    
    /**
     * 无参有返回值接口
     */
    @FunctionalInterface
    public interface Supplier<T, E extends Throwable> {
        T get() throws E;
    }

    /**
     * 无参无返回值接口
     */
    @FunctionalInterface
    public interface Function<E extends Throwable> {
        void exec() throws E;
    }

}
```


## 二、定义执行时间与执行结果记录类

`start()` 方法记录执行开始时间；
`stop()` 方法记录结束时间；
`record()` 方法记录方法返回值。

```java
    /**
     * 执行时间监控类
     *
     * @param <T>
     */
    @Getter
    @ToString
    public static class Watch<T> {
        private long startMs;
        private long endMs;
        private long execMs;
        private T result;

        private void start() {
            this.startMs = System.currentTimeMillis();
        }

        private void start(Long startMs) {
            this.startMs = startMs == null ? System.currentTimeMillis() : startMs;
        }

        private void stop() {
            this.endMs = System.currentTimeMillis();
            this.execMs = this.endMs - this.startMs;
        }

        private void record(T result) {
            this.result = result;
        }
    }
```


## 三、定义静态方法接收函数

共定义4个静态重载的`run`方法，区别在与是否有返回值及是否传入开始时间。

```java
    /**
     * @description: 执行函数，有返回值
     * @param: [supplier, startMs]
     * @return: {@link Watch<T>}
     * @author: Magese
     * @date: 2021/4/21
     */
    public static <T, E extends Throwable> Watch<T> run(Supplier<T, E> supplier, Long startMs) {
        Watch<T> watch = new Watch<>();
        watch.start(startMs);
        try {
            watch.record(supplier.get());
        } catch (Throwable t) {
            throw new RuntimeException(t);
        } finally {
            watch.stop();
        }
        return watch;
    }

    /**
     * @description: 执行函数，有返回值
     * @param: [supplier]
     * @return: {@link Watch<T>}
     * @author: Magese
     * @date: 2021/4/22
     */
    public static <T, E extends Throwable> Watch<T> run(Supplier<T, E> supplier) {
        Watch<T> watch = new Watch<>();
        watch.start();
        try {
            watch.record(supplier.get());
        } catch (Throwable t) {
            throw new RuntimeException(t);
        } finally {
            watch.stop();
        }
        return watch;
    }

    /**
     * @description: 执行函数，无返回值
     * @param: [function, startMs]
     * @return: {@link Watch<Void>}
     * @author: Magese
     * @date: 2021/4/21
     */
    public static <E extends Throwable> Watch<Void> run(Function<E> function, long startMs) {
        Watch<Void> watch = new Watch<>();
        watch.start(startMs);
        try {
            function.exec();
        } catch (Throwable t) {
            throw new RuntimeException(t);
        } finally {
            watch.stop();
        }
        return watch;
    }

    /**
     * @description: 执行函数，无返回值
     * @param: [function]
     * @return: {@link Watch<Void>}
     * @author: Magese
     * @date: 2021/4/21
     */
    public static <E extends Throwable> Watch<Void> run(Function<E> function) {
        Watch<Void> watch = new Watch<>();
        watch.start();
        try {
            function.exec();
        } catch (Throwable t) {
            throw new RuntimeException(t);
        } finally {
            watch.stop();
        }
        return watch;
    }
```


## 四、TraceWatch 完整代码

<details>
  <summary>点击显示完整 TraceWatch 代码</summary>
    ```java
    public class TraceWatch {
    
        /**
         * @description: 执行函数，有返回值
         * @param: [supplier, startMs]
         * @return: {@link Watch<T>}
         * @author: Magese
         * @date: 2021/4/21
         */
        public static <T, E extends Throwable> Watch<T> run(Supplier<T, E> supplier, Long startMs) {
            Watch<T> watch = new Watch<>();
            watch.start(startMs);
            try {
                watch.record(supplier.get());
            } catch (Throwable t) {
                throw new RuntimeException(t);
            } finally {
                watch.stop();
            }
            return watch;
        }
    
        /**
         * @description: 执行函数，有返回值
         * @param: [supplier]
         * @return: {@link Watch<T>}
         * @author: Magese
         * @date: 2021/4/22
         */
        public static <T, E extends Throwable> Watch<T> run(Supplier<T, E> supplier) {
            Watch<T> watch = new Watch<>();
            watch.start();
            try {
                watch.record(supplier.get());
            } catch (Throwable t) {
                throw new RuntimeException(t);
            } finally {
                watch.stop();
            }
            return watch;
        }
    
        /**
         * @description: 执行函数，无返回值
         * @param: [function, startMs]
         * @return: {@link Watch<Void>}
         * @author: Magese
         * @date: 2021/4/21
         */
        public static <E extends Throwable> Watch<Void> run(Function<E> function, long startMs) {
            Watch<Void> watch = new Watch<>();
            watch.start(startMs);
            try {
                function.exec();
            } catch (Throwable t) {
                throw new RuntimeException(t);
            } finally {
                watch.stop();
            }
            return watch;
        }
    
        /**
         * @description: 执行函数，无返回值
         * @param: [function]
         * @return: {@link Watch<Void>}
         * @author: Magese
         * @date: 2021/4/21
         */
        public static <E extends Throwable> Watch<Void> run(Function<E> function) {
            Watch<Void> watch = new Watch<>();
            watch.start();
            try {
                function.exec();
            } catch (Throwable t) {
                throw new RuntimeException(t);
            } finally {
                watch.stop();
            }
            return watch;
        }
    
        /**
         * 执行时间监控类
         *
         * @param <T>
         */
        @Getter
        @ToString
        public static class Watch<T> {
            private long startMs;
            private long endMs;
            private long execMs;
            private T result;
    
            private void start() {
                this.startMs = System.currentTimeMillis();
            }
    
            private void start(Long startMs) {
                this.startMs = startMs == null ? System.currentTimeMillis() : startMs;
            }
    
            private void stop() {
                this.endMs = System.currentTimeMillis();
                this.execMs = this.endMs - this.startMs;
            }
    
            private void record(T result) {
                this.result = result;
            }
        }
    
        /**
         * 无参有返回值接口
         */
        @FunctionalInterface
        public interface Supplier<T, E extends Throwable> {
            T get() throws E;
        }
    
        /**
         * 无参无返回值接口
         */
        @FunctionalInterface
        public interface Function<E extends Throwable> {
            void exec() throws E;
        }
    }
    
    ```
</details>



## 五、使用 TraceWatch 记录执行时间

为了观察方便，在方法内部Sleep来进行测试：

```java
    @Test
    public void test() {
        int a = 10;
        int b = 7;
        // 执行 sum 方法
        TraceWatch.Watch<Integer> watch = TraceWatch.run(() -> sum(a, b));
        System.out.println("sum(a, b):" + watch.getResult());
        System.out.println("sum(a, b)执行时间监控：" + watch);

        // 执行sayHi方法
        TraceWatch.Watch<Void> watch1 = TraceWatch.run(this::sayHi);
        System.out.println("sayHi()执行时间监控：" + watch1);
    }

    private int sum(int a, int b) {
        ThreadUtil.sleep(1000);
        return a + b;
    }

    public void sayHi() {
        ThreadUtil.sleep(500);
        System.out.println("Hi");
    }
```

执行结果如下：

```text
sum(a, b):17
sum(a, b)执行时间监控：TraceWatch.Watch(startMs=1627616000980, endMs=1627616001989, execMs=1009, result=17)
Hi
sayHi()执行时间监控：TraceWatch.Watch(startMs=1627616001992, endMs=1627616002505, execMs=513, result=null)
```

好耶✌，可以看到精准的记录了执行时间。

但为了在实际项目中更方便的使用，我们可以配合自定义注解及Spring的AOP来使用。


## 六、自定义执行时间监控注解

两个参数：
1. 打印的日志级别；
2. 执行方法的描述。

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface TraceWatch {

    /**
     * 日志级别
     */
    Constants.TraceLevel level() default Constants.TraceLevel.DEBUG;

    /**
     * 方法描述
     */
    String notes() default "";

}
```

日志级别枚举：

```java
public enum TraceLevel {
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR
}
```


## 七、使用Spring AOP对注解进行切面处理

定义切入点及切面，对添加了注解的方法打印日志：

```java
@Slf4j
@Aspect
@Component
public class TraceWatchAspect {

    /**
     * 切入点
     */
    @Pointcut("@annotation(com.magese.api.common.annotation.TraceWatch)")
    public void traceWatchPointcut() {
    }

    /**
     * 切面
     */
    @Around("traceWatchPointcut()")
    public Object doAround(ProceedingJoinPoint joinPoint) {
        // 执行方法名
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        String path = sourceRoot(className, methodName, joinPoint);
        // 获取注解
        com.magese.api.common.annotation.TraceWatch traceWatch = ((MethodSignature) joinPoint.getSignature())
                .getMethod()
                .getAnnotation(com.magese.api.common.annotation.TraceWatch.class);
        Constants.TraceLevel level = traceWatch.level();
        String notes = traceWatch.notes();
        // 执行方法获取耗时
        TraceWatch.Watch<Object> watch = TraceWatch.run((TraceWatch.Supplier<Object, Throwable>) joinPoint::proceed);
        // 打印日志
        consoleLog(watch, path, level, notes);
        return watch.getResult();
    }

    /**
     * @description: 拼接方法类路径
     * @param: [className, methodName, paramMap]
     * @return: {@link String}
     * @author: Magese
     * @date: 2021/07/30
     */
    private String sourceRoot(String className, String methodName, ProceedingJoinPoint joinPoint) {
        StringBuilder source = new StringBuilder();
        source.append(className).append(".").append(methodName).append("(");
        // 获取方法参数映射
        Map<String, String> paramMap = new LinkedHashMap<>();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] paramNames = signature.getParameterNames();
        Class<?>[] classes = signature.getParameterTypes();
        if (paramNames != null && classes != null && paramNames.length > 0 && classes.length > 0) {
            for (int i = 0; i < (Math.min(paramNames.length, classes.length)); i++) {
                paramMap.put(paramNames[i], classes[i].getSimpleName());
            }
        }
        // 拼接路径
        if (!paramMap.isEmpty()) {
            AtomicInteger size = new AtomicInteger(paramMap.size());
            paramMap.forEach((k, v) -> source
                    .append(v)
                    .append(" ")
                    .append(k)
                    .append(size.decrementAndGet() > 0 ? ", " : ""));
        }
        source.append(")");
        return source.toString();
    }

    /**
     * @description: 毫秒转字符串
     * @param: [className, methodName, paramMap]
     * @return: {@link String}
     * @author: Magese
     * @date: 2021/07/30
     */
    private String milli2String(long milli) {
        return LocalDateTimeUtil.format(LocalDateTimeUtil.of(milli), "yyyy-MM-dd HH:mm:ss:SSS");
    }

    /**
     * @description: 打印日志
     * @param: [className, methodName, paramMap]
     * @return: {@link String}
     * @author: Magese
     * @date: 2021/07/30
     */
    private void consoleLog(TraceWatch.Watch<?> watch, String classPath, Constants.TraceLevel level, String notes) {
        String consoleLog = StringUtils.isBlank(notes) ?
                "耗时监控 ==> [{}] => [耗时：{}ms] => [开始时间：{}，结束时间：{}]" :
                "耗时监控 ==> [{}] => [{}] => [耗时：{}ms] => [开始时间：{}，结束时间：{}]";
        String start = milli2String(watch.getStartMs());
        String end = milli2String(watch.getEndMs());
        List<String> params = new ArrayList<>();
        params.add(classPath);
        if (StringUtils.isNotBlank(notes)) params.add(notes);
        params.add(String.valueOf(watch.getExecMs()));
        params.add(start);
        params.add(end);

        switch (level) {
            case TRACE:
                log.trace(consoleLog, params.toArray());
            case DEBUG:
                log.debug(consoleLog, params.toArray());
                break;
            case INFO:
                log.info(consoleLog, params.toArray());
                break;
            case WARN:
                log.warn(consoleLog, params.toArray());
                break;
            case ERROR:
                log.error(consoleLog, params.toArray());
                break;
        }
    }

}
```


## 八、使用注解打印日志

在需要记录打印时间的方法上添加注解即可：

```java
    /**
     * @description: 获取上传凭证
     * @return: {@link R<QiniuTokenResponse>}
     * @author: Magese
     * @date: 2021/7/21
     */
    @TraceWatch(level = Constants.TraceLevel.DEBUG, notes = "获取七牛云上传凭证")
    @Override
    public R<QiniuTokenResponse> token() {
        QiniuTokenResponse response = new QiniuTokenResponse();
        response.setToken(getToken(null));
        response.setDomain(qiniuProperties.getDomain());
        return R.ok(response);
    }
```

执行效果：

![日志打印](https://images.magese.com/blog/d1935fe86d28ff0c)

```text
耗时监控 ==> [QiniuServiceImpl.token()] => [获取七牛云上传凭证] => [耗时：90ms] => [开始时间：2021-07-30 14:37:57:259，结束时间：2021-07-30 14:37:57:349]
```

搞定！可以看到成功的打印了执行时间日志。


# 注意事项

注解使用在`private`方法，或者是通过当前对象`this`调用的方法都会没有效果，

因为 SpringAOP 是通过动态代理实现的，

想要有效必须是使用了代理对象来进行调用。
