---
title: SpringWeb环境下获取请求对应接口方法
excerpt: 我们经常会遇到在 Spring 的 Filter 或者 Interceptor 中，想获取请求对应的接口方法，或者是对应接口方法、注解、类等信息时只需要注入一个由 Spring 提供的请求处理映射类即可完成。
date: 2022-01-13 19:12:17
updated: 2022-01-13 19:12:17
categories: 技术
tags:
  - Java
  - Springboot
index_img: https://oss.magese.com/blog/174a9c26a50bea6b
banner_img: https://oss.magese.com/blog/174a9c26a50bea6b
---

# SpringWeb环境下获取请求对应接口方法

## 前言

我们经常会遇到在 Spring 的 Filter 或者 Interceptor 中，想获取请求对应的接口方法，

或者是对应接口方法、注解、类等信息时，不需要手动的去对请求路径和方法去寻找。

只需要注入一个由 Spring 提供的请求处理映射类 **`RequestMappingHandlerMapping`** 即可完成。


## 示例


```java

/**
 * 全局过滤器
 *
 * @author Magese
 * @since 2022/1/13 16:20
 */
@Slf4j
@WebFilter(filterName = "globleFilter", urlPatterns = "/*")
@Component
public class GlobleFilter extends OncePerRequestFilter {

    @Resource
    private RequestMappingHandlerMapping handlerMapping;

    @SneakyThrows
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
        // 获取请求对应处理器
        HandlerExecutionChain handler = handlerMapping.getHandler(request);

        if (handler == null) {
            filterChain.doFilter(request, response);
            return;
        }
        // 获取拦截器列表
        List<HandlerInterceptor> interceptorList = handler.getInterceptorList();

        // 获取对应处理方法
        HandlerMethod handlerMethod = (HandlerMethod) handler.getHandler();

        // 获取反射方法
        Method method = handlerMethod.getMethod();
        // 获取注解
        ApiOperation annotation = handlerMethod.getMethodAnnotation(ApiOperation.class);
        // 获取方法参数
        MethodParameter[] methodParameters = handlerMethod.getMethodParameters();
        // 获取方法返回值类型
        MethodParameter returnType = handlerMethod.getReturnType();

    }
}

```

## 结语

通过以上示例可以发现，只要是在Servlet请求环境中，都可以通过注入以及 `HttpServletRequest` 请求对象快速获取对应的接口方法，

并且可以获得反射的方法对象，方便于做进一步的处理。
