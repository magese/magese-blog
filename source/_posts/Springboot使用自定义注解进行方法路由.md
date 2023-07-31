---
title: Springboot使用自定义注解进行方法路由
excerpt: 在一次对接第三方公共接口时遇到一个问题，第三方会将所有的请求打到同一个URL地址，而我们则需要根据第三方的method字段自行对请求进行路由。
date: 2021-10-14 19:24:13
updated: 2021-10-14 19:24:13
categories: 技术
tags:
  - Java
  - Springboot
  - 注解
index_img: https://oss.magese.com/blog/c17710c9bf3c7a17
banner_img: https://oss.magese.com/blog/c17710c9bf3c7a17
---

# Springboot使用自定义注解进行方法路由

**使用背景**

> 在一次对接第三方公共接口时遇到一个问题，第三方会将所有的请求打到同一个`URL`地址，而我们则需要根据第三方的`method`字段自行对请求进行路由。
> 考虑到会有多个路由方法，为了便于开发及后续的维护，所以采用了自定义注解的方式来实现。
> ![第三方接口文档](https://oss.magese.com/blog/3a2e6f03113ec6ef)


## 新建自定义注解

### @ApiService

创建`@ApiService`注解，使用在类上，用于标注该类为自定义路由类，该注解直接使用`Spring`的`@Service`注解即可。

```java
@Inherited
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Service
public @interface ApiService {

}
```

### @ApiRouter

创建`@ApiRouter`注解，使用在方法上，用于标注该方法为路由方法，该注解需要一个必填值为路由方法地址。

```java
@Inherited
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ApiRouter {

    /**
     * 路由地址
     */
    String value();
}
```

## 新建 API 路由工具类

新建 API 路由工具类，用于初始化、保存路由方法映射，以及执行路由方法等操作。


```java
public final class ApiRouterUtil {

    /**
     * 用于保存路由方法映射
     */
    private static final Map<String, Target> ROUTE_MAPPING = new HashMap<>();

    /**
     * 工具类私有构造
     */
    private ApiRouterUtil() {}

    /**
     * 目标对象
     */
    @Data
    public static class Target {

        /**
         * 目标类字节码对象
         */
        private Class<?> targetClass;
        /**
         * 目标方法
         */
        private Method targetMethod;

        private Target(Class<?> targetClass, Method targetMethod) {
            this.targetClass = targetClass;
            this.targetMethod = targetMethod;
        }

        public static Target of(Class<?> targetClass, Method targetMethod) {
            return new Target(targetClass, targetMethod);
        }
    }

    /**
     * 存入路由目标方法
     * 
     * @param key   路由方法地址
     * @param value 目标方法
     * @throws IllegalStateException 如果key已存在则抛出异常
     */
    public static void put(String key, Target value) throws IllegalStateException {
        Target target = ROUTE_MAPPING.get(key);
        if (target != null) {
            throw new IllegalStateException(target.getTargetClass().getName() + "#" + target.getTargetMethod().getName() +
                    ": There is already '" + key + "' bean method");
        }
        ROUTE_MAPPING.put(key, value);
    }

    /**
     * 执行指定路由方法
     * 
     * @param method 路由地址
     * @param params 方法参数
     * @return 返回结果统一使用json字符串
     */
    public static String invoke(String method, String params) {
        Target target = ROUTE_MAPPING.get(method);
        if (target == null) {
            throw new ServiceException("未找到路由地址'" + method + "'对应的实现方法");
        }

        try {
            Method targetMethod = target.getTargetMethod();
            Object[] args = new Object[targetMethod.getParameterCount()];
            args[0] = params;
            // 使用hutools的Spring工具类获取Spring容器中的对象，来执行目标方法
            return (String) targetMethod.invoke(SpringUtil.getBean(target.getTargetClass()), args);
        } catch (InvocationTargetException | IllegalAccessException e) {
            throw new ServiceException(e.getCause().getMessage());
        }
    }

}
```

## 使用Springboot钩子函数初始化方法映射

众所周知，实现`Spring`的`ApplicationRunner`或`CommandLineRunner`接口可以在项目启动成功后进行初始化操作，这里我使用了前者进行初始化操作。

```java
@Slf4j
@Component
public class ApiApplicationRunner implements ApplicationRunner {
    
    @Override
    public void run(ApplicationArguments args) {
        log.info("API Application init start...");
        
        // 初始化 API Router
        initApiRouter();
        
        log.info("API Application init finish");
    }

    /**
     * 初始化 API Router
     */
    private void initApiRouter() {
        log.info("API Router init => 开始初始化...");
        // 获取启动类字节码对象，获取包扫描路径，如果包扫描路径为空，则使用Spring默认的扫描路径
        Class<ApiApplication> applicationClass = ApiApplication.class;
        ComponentScan componentScan = applicationClass.getAnnotation(ComponentScan.class);
        SpringBootApplication springBootApplication = applicationClass.getAnnotation(SpringBootApplication.class);
        
        Set<String> packages = new HashSet<>(ListUtil.of(componentScan.basePackages()));
        packages.addAll(ListUtil.of(springBootApplication.scanBasePackages()));
        if (packages.isEmpty()) {
            packages.add(ClassUtil.getPackage(applicationClass));
        }
        
        // 扫描包获取标注 @ApiService 的类
        Set<Class<?>> apiServiceClassSet = new HashSet<>();
        packages.forEach(packageName -> apiServiceClassSet.addAll(ClassUtil.scanPackageByAnnotation(packageName, ApiService.class)));
        
        // 扫描类获取标注 @ApiRouter 的方法
        apiServiceClassSet.forEach(clazz -> {
            Method[] methods = ReflectUtil.getMethods(clazz, method -> method.getAnnotation(ApiRouter.class) != null);
            if (methods != null && methods.length > 0) {
                // 将方法映射存入工具类中
                for (Method method : methods) {
                    String router = method.getAnnotation(ApiRouter.class).value();
                    ApiRouterUtil.Target target = ApiRouterUtil.Target.of(clazz, method);
                    ApiRouterUtil.put(router, target);
                    log.info("API Router init => route: '{}', class: '{}', method: '{}'", router, clazz.getSimpleName(), method.getName());
                }
            }
        });
        log.info("API Router init => 初始化完成");
    }
}
```

至此就算完成了所有的准备步骤，接下来就可以尝试使用。

## 测试使用


### 定义路由方法

```java
@Slf4j
@ApiService
public class TestApiService() {
    
    @ApiRouter("user.info.change.notify")
    public String userInfoChangeNotify(String params) {
        String res = "";
        UserInfoChangeRequest request = JSON.parseObject(params, UserInfoChangeRequest.class);
        // do your businesses
        return res;
    }
}
```

### 定义接口接收第三方请求

```java
@RequestMapping("/test")
@RestController
public class TestController extends BaseController {

    @PostMapping(value = "/api")
    public R<String> api(ApiRequest request) {
        String res = ApiRouterUtil.invoke(request.getMethod(), request.getParams());
        return R.ok(res);
    }
}
```


至此就算全部完成了，

当请求的`method`字段为`user.info.change.notify`时，

`/api`接口会自动路由到我们定义的路由方法，

如果还需要添加更多的路由方法，只需在方法上标注注解`@ApiRouter("xxx")`即可。

