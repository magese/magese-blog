---
title: Java通用枚举工具类
excerpt: 记录一下工作中使用的枚举工具类。
date: 2021-01-04 10:55:25
updated: 2021-01-04 10:55:25
categories: 技术
tags:
  - Java
  - 工具类
  - 枚举
index_img: https://images.magese.com/2021_01_04_java_enum_utils_01.png
banner_img: https://images.magese.com/2021_01_04_java_enum_utils_01.png
---

# Java通用枚举工具类

> 记录一下工作中使用的枚举工具类。

## 1. 枚举类示例
```java
public enum EnumType {

        CHECK_BOX(1, "CHECK_BOX", "复选框"),
        INPUT(2, "INPUT", "输入框"),
        TEXT_AREA(3, "TEXT_AREA", "多行文本框"),
        RADIO(4, "RADIO", "单选框");

        private final Integer code;
        private final String type;
        private final String msg;

        EnumType(Integer code, String type, String msg) {
            this.code = code;
            this.type = type;
            this.msg = msg;
        }

        public static String getMsgByCode(Integer code) {
            for (EnumType e : values()) {
                if (e.code.equals(code)) {
                    return e.msg;
                }
            }
            return "";
        }

        public Integer getCode() {
            return code;
        }

        public String getType() {
            return type;
        }

        public String getMsg() {
            return this.msg;
        }
    }
```

## 2. 通用的枚举响应对象

通用对象的字段名称与枚举类中的字段属性名称对应。

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("通用枚举响应参数")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EnumResponse implements java.io.Serializable {

    @ApiModelProperty("名称")
    private Object msg;

    @ApiModelProperty("类型")
    private Object type;

    @ApiModelProperty("值")
    private Object code;

}
```

## 3. 枚举工具类常用方法
### 3.1 根据枚举的类对象返回通用枚举响应对象里身列表

> 主要实现是通过反射获取`EnumResponse`对象中的字段名称，
> 再通过获取到的字段名称去枚举类中获取对应的值，
> 最后封装为`List<EnumResponse>`返回，详情见代码。

```java
    public static <T extends Enum<?>> List<EnumResponse> getTypeEnum(Class<T> enumClass) {
        // 获取返回实体所有的字段方法名称
        List<String> methodNames = new ArrayList<>();
        Field[] fields = EnumResponse.class.getDeclaredFields();
        for (Field field : fields) {
            String name = field.getName();
            StringBuilder builder = new StringBuilder();
            methodNames.add(builder.append(name.substring(0, 1).toUpperCase()).append(name.substring(1)).toString());
        }
        // 获取枚举类中和EnumResponse实体中字段名称一致的get方法
        List<EnumResponse> list = new ArrayList<>();
        Object[] objects = enumClass.getEnumConstants();
        Map<String, Method> methods = new HashMap<>();
        for (String methodName : methodNames) {
            try {
                Method method = enumClass.getMethod("get" + methodName);
                methods.put(methodName, method);
            } catch (NoSuchMethodException ignored) {}
        }
        // 调用枚举类中的get方法，把值set到EnumResponse实体类中
        for (Object object : objects) {
            EnumResponse response = new EnumResponse();
            methods.forEach((k, v) -> {
                try {
                    Method method = response.getClass().getMethod("set" + k, Object.class);
                    Object invoke = v.invoke(object);
                    if (invoke instanceof Enum) {
                        EnumResponse enumResponse = getEnumResponse((Enum<?>) invoke);
                        method.invoke(response, enumResponse);
                    } else {
                        method.invoke(response, invoke);
                    }
                } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                    LoggerUtils.error(e, e.getMessage());
                }
            });
            list.add(response);
        }
        return list;
    }
```

### 3.2 根据具体的枚举对象获取通用枚举响应对象

> 实现方式与上述基本一致，
> 如果枚举中有嵌套枚举，则会递归调用获取内容。

```java
    public static EnumResponse getEnumResponse(Enum<?> anEnum) {
        EnumResponse response = new EnumResponse();
        // 获取返回实体所有的字段方法名称
        List<String> methodNames = new ArrayList<>();
        Field[] fields = EnumResponse.class.getDeclaredFields();
        for (Field field : fields) {
            String name = field.getName();
            StringBuilder builder = new StringBuilder();
            methodNames.add(builder.append(name.substring(0, 1).toUpperCase()).append(name.substring(1)).toString());
        }
        // 获取枚举类中和EnumResponse实体中字段名称一致的get方法
        Map<String, Method> methods = new HashMap<>();
        for (String methodName : methodNames) {
            try {
                Method method = anEnum.getClass().getMethod("get" + methodName);
                methods.put(methodName, method);
            } catch (NoSuchMethodException ignored) {}
        }
        // 调用枚举类中的get方法，把值set到EnumResponse实体类中
        methods.forEach((k, v) -> {
            try {
                Method method = response.getClass().getMethod("set" + k, Object.class);
                Object invoke = v.invoke(anEnum);
                if (invoke instanceof Enum) {
                    EnumResponse enumResponse = getEnumResponse((Enum<?>) invoke);
                    method.invoke(response, enumResponse);
                } else {
                    method.invoke(response, invoke);
                }
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                LoggerUtils.error(e, e.getMessage());
            }
        });
        return response;
    }
```

以上。
