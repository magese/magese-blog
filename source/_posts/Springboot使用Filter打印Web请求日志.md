---
title: Springboot使用Filter打印Web请求日志
excerpt: Springboot 环境中，使用 OncePerRequestFilter 过滤器来添加统一的Web请求日志。
date: 2021-03-05 14:19:03
updated: 2021-03-05 14:19:03
categories: 技术
tags:
  - Java
  - Springboot
index_img: https://images.magese.com/2021-03-05.springboot-log-filter.banner.jpeg
banner_img: https://images.magese.com/2021-03-05.springboot-log-filter.banner.jpeg
---


# Springboot使用Filter打印Web请求日志


`Springboot`环境中，使用`OncePerRequestFilter`过滤器来添加统一的Web请求日志。


具体实现代码如下：


```java
/**
 * @Description: Http请求日志过滤器
 * @Author: Magese
 * @Date: 2021/3/5
 */
@Slf4j
@Component
public class HttpTraceLogFilter extends OncePerRequestFilter implements Ordered {

    // 配置要记录请求的路径前缀
    private static final String NEED_TRACE_PATH_PREFIX = "/";
    // 忽略为multipart/form-data的ContentType的请求
    private static final String IGNORE_CONTENT_TYPE = "multipart/form-data";

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE - 10;
    }

    @Override
    @SuppressWarnings("NullableProblems")
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (!isRequestValid(request)) {
            filterChain.doFilter(request, response);
            return;
        }
        if (!(request instanceof ContentCachingRequestWrapper)) {
            request = new ContentCachingRequestWrapper(request);
        }
        if (!(response instanceof ContentCachingResponseWrapper)) {
            response = new ContentCachingResponseWrapper(response);
        }
        int status = HttpStatus.INTERNAL_SERVER_ERROR.value();
        long startTime = System.currentTimeMillis();
        try {
            filterChain.doFilter(request, response);
            status = response.getStatus();
        } finally {
            String path = request.getRequestURI();
            if (path.startsWith(NEED_TRACE_PATH_PREFIX) && !Objects.equals(IGNORE_CONTENT_TYPE, request.getContentType())) {
                // 1. 记录日志
                consoleLog(path, request, startTime, status, response);
            }
            updateResponse(response);
        }
    }

    /**
     * @Description: 打印日志
     * @Param: [path - 请求路径, request - Http请求, startTime - 开始毫秒, status - 响应状态码, response - Http响应]
     * @Author: Magese
     * @Date: 2021/3/5
     */
    private synchronized void consoleLog(String path, HttpServletRequest request, long startTime, int status, HttpServletResponse response) {
        String uuid = IdUtil.fastSimpleUUID();
        log.info("-------------------- Api reqeust log start  --------------------");

        log.info("请求 | 请求唯一id:[{}] | 请求路径:[{}] | 请求方法:[{}] | 请求IP:[{}] | 请求参数:{} | 请求Body:{} | 请求Token:[{}] ",
                uuid,
                path,
                request.getMethod(),
                request.getRemoteAddr(),
                JSON.toJSONString(request.getParameterMap()),
                getRequestBody(request),
                request.getHeader("Authorization")
        );

        log.info("返回 | 请求唯一id:[{}] | 处理耗时:[{}ms] | 响应时间:[{}] | 响应状态:[{}] | 响应Body:{} ",
                uuid,
                System.currentTimeMillis() - startTime,
                LocalDateUtils.getLocalDateTime(LocalDateTime.now(), LocalDateUtils.FULL_FORMAT),
                status,
                getResponseBody(response)
        );
    }

    /**
     * @Description: 判断请求是否合法
     * @Param: [request]
     * @return: {@link boolean}
     * @Author: Magese
     * @Date: 2021/3/5
     */
    private boolean isRequestValid(HttpServletRequest request) {
        try {
            new URI(request.getRequestURL().toString());
            return true;
        } catch (URISyntaxException ex) {
            return false;
        }
    }

    /**
     * @Description: 获取请求Body
     * @Param: [request]
     * @return: {@link String}
     * @Author: Magese
     * @Date: 2021/3/5
     */
    private String getRequestBody(HttpServletRequest request) {
        String requestBody = "{}";
        ContentCachingRequestWrapper wrapper = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
        if (wrapper != null) {
            try {
                requestBody = IOUtils.toString(wrapper.getContentAsByteArray(), wrapper.getCharacterEncoding());
                requestBody = JSON.parseObject(requestBody).toJSONString();
            } catch (Exception ignored) {}
        }
        return requestBody;
    }

    /**
     * @Description: 获取响应Body
     * @Param: [response]
     * @return: {@link String}
     * @Author: Magese
     * @Date: 2021/3/5
     */
    private String getResponseBody(HttpServletResponse response) {
        String responseBody = "{}";
        ContentCachingResponseWrapper wrapper = WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
        if (wrapper != null) {
            try {
                responseBody = IOUtils.toString(wrapper.getContentAsByteArray(), StandardCharsets.UTF_8.name());
                responseBody = JSON.parseObject(responseBody).toJSONString();
            } catch (IOException ignored) {}
        }
        return responseBody;
    }

    /**
     * @Description: 更新响应
     * @Param: [response]
     * @Author: Magese
     * @Date: 2021/3/5
     */
    private void updateResponse(HttpServletResponse response) throws IOException {
        ContentCachingResponseWrapper responseWrapper = WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
        Objects.requireNonNull(responseWrapper).copyBodyToResponse();
    }

}

```


以上
