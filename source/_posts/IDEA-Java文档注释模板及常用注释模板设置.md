---
title: IDEA-Java文档注释模板及常用注释模板设置
excerpt: 准备设置 Ctrl + S 打开设置面板
date: 2021-03-03 15:05:46
updated: 2021-03-03 15:05:46
categories: 技术
tags:
  - IDEA
  - Java
index_img: https://images.magese.com/2021-03-03.IDEA-Setting.banner.png
banner_img: https://images.magese.com/2021-03-03.IDEA-Setting.banner.png
---

# IDEA-Java文档注释模板及常用注释模板设置

## 准备设置

1. `Ctrl` + `S` 打开设置面板：
![](https://images.magese.com/2021-03-03.IDEA-Setting.01.png)

2. 依次打开 `Editor` -> `Live Template` -> `+` -> `Template Group` ，输入模板分组名称：
![](https://images.magese.com/2021-03-03.IDEA-Setting.02.png)
![](https://images.magese.com/2021-03-03.IDEA-Setting.03.png)

3. 选中刚刚添加的模板分组，再次点选 `+` 添加模板：
![](https://images.magese.com/2021-03-03.IDEA-Setting.04.png)

4. 新建时根据个人使用习惯填写 `Abbreviation`、`Expand with` ：
![](https://images.magese.com/2021-03-03.IDEA-Setting.05.png)
   
5. 根据需要定义模板的使用范围：
![](https://images.magese.com/2021-03-03.IDEA-Setting.06.png)


## 文档注释模板设置

![效果图](https://images.magese.com/2021-03-03.IDEA-Setting.07.png)
![设置示例](https://images.magese.com/2021-03-03.IDEA-Setting.08.png)

Template text:
```
**
 * @Description: $desc$
 * @Param: $param$
 * @return: $return$
 * @Author: $user$
 * @Date: $date$
 */
```

Edit variables
```properties
desc = ''
param = methodParameters()
return = groovyScript("def result=\"${_1}\";if(result == \"void\" || result == \"null\"){return \"\";}else{return \"{@link \" + result + \"}\";}", methodReturnType())
user = user()
date = date()
```

## 修改注释模板设置

![效果图](https://images.magese.com/2021-03-03.IDEA-Setting.10.png)
![设置示例](https://images.magese.com/2021-03-03.IDEA-Setting.09.png)


Template text:
```
Modify by $user$ $date$ $time$ $desc$
```

Edit variables
```properties
user = user()
date = date("yyyy-MM-dd")
time = time("HH:mm:ss")
desc = ''
```

---
完了
