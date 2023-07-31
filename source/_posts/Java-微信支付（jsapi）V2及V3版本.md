---
title: Java-微信支付（jsapi）V2及V3版本
excerpt: Tips：本文没有支付下单及退款等相关业务的具体代码实现。只提供签名、解密等操作的代码实现。
date: 2021-01-20 15:27:09
updated: 2021-01-20 15:27:09
categories: 技术
tags:
  - Java
  - 微信支付
index_img: https://oss.magese.com/blog/2021_01_20_wechat_pay_thumb.png
banner_img: https://oss.magese.com/blog/2021_01_20_wechat_pay_banner.jpg
---

# Java-微信支付（jsapi）V2及V3版本

**Tips：本文没有支付下单及退款等相关业务的具体代码实现。只提供签名、解密等操作的代码实现。**

> 参考文档：
>   - [官方文档](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml)
>   - [微信支付V3SDK](https://github.com/wechatpay-apiv3/wechatpay-apache-httpclient)

## 前置准备

### SDK

主要使用到了微信支付官方提供的两个SDK

```xml
<!-- 微信支付SDK V2版本 -->
<dependency>
  <groupId>com.github.wxpay</groupId>
  <artifactId>wxpay-sdk</artifactId>
  <version>0.0.3</version>
</dependency>
```

```xml
<!-- 微信支付httpclient V3版本 -->
<dependency>
  <groupId>com.github.wechatpay-apiv3</groupId>
  <artifactId>wechatpay-apache-httpclient</artifactId>
  <version>0.2.1</version>
</dependency>
```

### 微信商户参数

1. 微信APPID <small>(appid)</small>
2. 微信支付商户ID <small>(mchid)</small>
3. 微信支付APIV3秘钥 <small>(APIV3Key)</small>
4. 微信支付秘钥 <small>(privateKey)</small>
5. 微信支付P12证书 <small>(xxxxxxxx.p12)</small>

> <small>以上参数均在微信商户平台获取</small>

## 实现代码

### 常量信息

```java
/**
 * 微信证书别名
 */
private static final String KEY_ALIAS = "Tenpay Certificate";
/**
 * 微信数据解密方式
 */
private static final String ALGORITHM = "AES";
/**
 * 微信数据解密方式V2
 */
private static final String ALGORITHM_MODE_PADDING_V2 = "AES/ECB/PKCS7Padding";
/**
 * 微信数据解密方式V3
 */
private static final String ALGORITHM_MODE_PADDING_V3 = "AES/GCM/NoPadding";
/**
 * APIV3Key长度
 */
private static final int APIV3_KEY_LENGTH_BYTE = 32;
/**
 * 身份验证标记长度
 */
private static final int TAG_LENGTH_BIT = 128;
```

### 微信支付V3版本

#### 读取P12证书

> <small>P12证书文件中包含有证书的公钥、私钥、序列号信息。</small>
> <small>证书密码为微信支付商户号。(mch_id)</small>

```java
/**
 * 读取微信支付证书
 *
 * @param keyPath 证书路径
 * @param keyPass 证书密码
 * @return 证书公钥、私钥、序列号
 */
public PKCS12Result createPKCS12(String keyPath, String keyPass) {
    try {
        // ClassPathResource resource = new ClassPathResource(keyPath);
        // 修改为使用绝对路径
        File cert = ResourceUtils.getFile(keyPath);
        char[] pem = keyPass.toCharArray();
        KeyStore store = KeyStore.getInstance("PKCS12");
        store.load(new FileInputStream(cert), pem);
        X509Certificate certificate = (X509Certificate) store.getCertificate(KEY_ALIAS);
        certificate.checkValidity();
        // 证书的序列号 也有用
        String serialNumber = certificate.getSerialNumber().toString(16).toUpperCase();
        // 证书的 公钥
        PublicKey publicKey = certificate.getPublicKey();
        // 证书的私钥
        PrivateKey storeKey = (PrivateKey) store.getKey(KEY_ALIAS, pem);

        KeyPair keyPair = new KeyPair(publicKey, storeKey);
        return new PKCS12Result(keyPair, serialNumber);

    } catch (Exception e) {
        LoggerUtils.error("createPKCS12", "微信支付 - 获取公私钥失败", e.getMessage());
        throw new IllegalStateException("Cannot load keys from store: " + keyPath, e);
    }
}
```

#### 构造HttpClient，用于请求V3接口

> <small>V3请求时不需要手动签名，签名程序已封装至CloseableHttpClient中。</small>

```java
/**
 * 构造HttpClient
 * 
 * @param mchId       商户号
 * @param apiV3Key    V3秘钥
 * @param mchSerialNo 证书序列号
 * @param privateKey  证书私钥
 * @return HttpClient
 */
private CloseableHttpClient httpClientBuilder(String mchId, String apiV3Key, String mchSerialNo, PrivateKey privateKey) {
    // 不需要传入微信支付证书，将会自动更新
    AutoUpdateCertificatesVerifier verifier = new AutoUpdateCertificatesVerifier(
    new WechatPay2Credentials(mchId, new PrivateKeySigner(mchSerialNo, privateKey)),
    apiV3Key.getBytes(StandardCharsets.UTF_8));

    return WechatPayHttpClientBuilder.create()
    .withMerchant(mchId, mchSerialNo, privateKey)
    .withValidator(new WechatPay2Validator(verifier))
    .build();
}
```

#### 支付签名

> <small>前端在调起支付时需要对参数进行签名。</small>

```java
/**
 * 支付签名
 * 
 * @param msg        要签名的数据
 * @param privateKey 证书秘钥
 * @return 签名
 */
public String paySign(String msg, PrivateKey privateKey) {
    try {
        Signature sign = Signature.getInstance("SHA256withRSA");
        sign.initSign(privateKey);
        sign.update(msg.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(sign.sign());
    } catch (NoSuchAlgorithmException e) {
        LoggerUtils.error("paySign", "微信支付 - 支付签名失败", "当前Java环境不支持SHA256withRSA");
        throw new WechatPayRuntimeException("当前Java环境不支持SHA256withRSA", e);
    } catch (SignatureException e) {
        LoggerUtils.error("paySign", "微信支付 - 支付签名失败", "签名计算失败");
        throw new WechatPayRuntimeException("签名计算失败", e);
    } catch (InvalidKeyException e) {
        LoggerUtils.error("paySign", "微信支付 - 支付签名失败", "无效的私钥");
        throw new WechatPayRuntimeException("无效的私钥", e);
    }
}
```

#### 解密回调数据

```java
/**
 * 解密回调数据V3版
 *
 * @param associatedData 附加数据
 * @param nonce          随机字符串
 * @param ciphertext     数据密文
 * @param apiV3Key       V3秘钥
 * @return 解密后的JSON数据
 */
public String decryptNotifyV3(String associatedData, String nonce, String ciphertext, String apiV3Key) {
    byte[] nonceBytes = nonce.getBytes(StandardCharsets.UTF_8);
    byte[] apiV3KeyBytes = apiV3Key.getBytes(StandardCharsets.UTF_8);
    if (apiV3KeyBytes.length != APIV3_KEY_LENGTH_BYTE) {
        throw new IllegalArgumentException("无效的ApiV3Key，长度必须为32个字节");
    }
    try {
        Cipher cipher = Cipher.getInstance(ALGORITHM_MODE_PADDING_V3);
        SecretKeySpec key = new SecretKeySpec(apiV3KeyBytes, ALGORITHM);
        GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH_BIT, nonceBytes);
        cipher.init(Cipher.DECRYPT_MODE, key, spec);
        cipher.updateAAD(associatedData.getBytes());
        return new String(cipher.doFinal(Base64.getDecoder().decode(ciphertext)), StandardCharsets.UTF_8);
    } catch (NoSuchAlgorithmException | NoSuchPaddingException e) {
        LoggerUtils.error("decryptNotifyV3", "微信支付 - 解密V3回调数据失败", e.getMessage());
        throw new IllegalStateException(e);
    } catch (InvalidKeyException | InvalidAlgorithmParameterException | BadPaddingException | IllegalBlockSizeException e) {
        LoggerUtils.error("decryptNotifyV3", "微信支付 - 解密V3回调数据失败", e.getMessage());
        throw new IllegalArgumentException(e);
    }
}
```

### 微信支付V2版本

#### 创建微信支付配置类

> <small>V2版本需新建配置类并实现SDK中的WXPayConfig接口。</small>

```java
public class WechatPayConfig implements WXPayConfig {
    /**
     * 微信APPID
     */
    private final String appid;
    /**
     * 商户号
     */
    private final String mchid;
    /**
     * 秘钥
     */
    private final String privateKey;
    /**
     * P12证书路径
     */
    private final String certPath;
    /**
     * 连接超时时间
     */
    private final Integer httpConnectTimeoutMs;
    /**
     * 读取超时时间
     */
    private final Integer httpReadTimeoutMs;

    public WechatPayConfig(String appid, String mchid, String privateKey, String certPath) {
        this.appid = appid;
        this.mchid = mchid;
        this.privateKey = privateKey;
        this.certPath = certPath;
        this.httpConnectTimeoutMs = 8000;
        this.httpReadTimeoutMs = 10000;
    }

    public WechatPayConfig(String appid, String mchid, String privateKey, String certPath, Integer httpConnectTimeoutMs, Integer httpReadTimeoutMs) {
        this.appid = appid;
        this.mchid = mchid;
        this.privateKey = privateKey;
        this.certPath = certPath;
        this.httpConnectTimeoutMs = httpConnectTimeoutMs;
        this.httpReadTimeoutMs = httpReadTimeoutMs;
    }

    @Override
    public String getAppID() {
        return this.appid;
    }

    @Override
    public String getMchID() {
        return this.mchid;
    }

    @Override
    public String getKey() {
        return this.privateKey;
    }

    @Override
    public InputStream getCertStream() {
        try {
            File file = ResourceUtils.getFile(this.certPath);
            return new FileInputStream(file);
        } catch (IOException e) {
            throw new WechatPayRuntimeException("路径:" + this.certPath + " 下找不到证书", e);
        }
    }

    @Override
    public int getHttpConnectTimeoutMs() {
        return this.httpConnectTimeoutMs;
    }

    @Override
    public int getHttpReadTimeoutMs() {
        return this.httpReadTimeoutMs;
    }
}
```

#### 构造微信支付SDK对象

```java
/**
 * 构造微信支付SDK对象
 *
 * @param appid      微信APPID
 * @param mchid      付商户号
 * @param privateKey 秘钥
 * @param certPath   P12证书路径
 * @return 微信支付SDK对象
 */
private WXPay WXPayBuilder(String appid, String mchid, String privateKey, String certPath) {
    return new WXPay(new WechatPayConfig(appid, mchid, privateKey, certPath));
}
```

#### 请求签名

> <small>V2版本请求时需携带签名，SDK中已封装好签名方法。</small>

```java
/**
 * V2版本请求签名
 *
 * @param reqdata    请求参数
 * @param privateKey API秘钥
 * @return 签名
 */
public String v2Sign(Map<String, String> reqdata, String privateKey) throws Exception {
    Map<String, String> data = new TreeMap<>();
    reqdata.forEach(data::put);
    return WXPayUtil.generateSignature(data, privateKey, WXPayConstants.SignType.MD5);
}
```

#### 解密回调数据

```java
/**
 * 解密回调数据V2版
 *
 * @param reqInfo    加密信息
 * @param privateKey API秘钥
 * @return 解密后的XML数据
 */
public String decryptNotifyV2(String reqInfo, String privateKey) {
    byte[] reqInfoBytes = Base64.getDecoder().decode(reqInfo);
    byte[] privateKeyBytes = DigestUtil.md5Hex(privateKey).toLowerCase().getBytes(StandardCharsets.UTF_8);

    try {
        Cipher cipher = Cipher.getInstance(ALGORITHM_MODE_PADDING_V2);
        SecretKeySpec spec = new SecretKeySpec(privateKeyBytes, ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, spec);
        return new String(cipher.doFinal(reqInfoBytes), StandardCharsets.UTF_8);
    } catch (NoSuchPaddingException | NoSuchAlgorithmException e) {
        LoggerUtils.error("decryptNotifyV2", "微信支付 - 解密V2回调数据失败", e.getMessage());
        throw new IllegalStateException(e);
    } catch (InvalidKeyException | BadPaddingException | IllegalBlockSizeException e) {
        LoggerUtils.error("decryptNotifyV2", "微信支付 - 解密V2回调数据失败", e.getMessage());
        throw new IllegalArgumentException(e);
    }
}
```

### 请求微信示例

#### V3版本示例

```java
// 创建请求
CloseableHttpClient httpClient = httpClientBuilder(mchid, apiV3Key, serialNumber, privateKey);
HttpPost post = new HttpPost(PaymentRemoteApi.WECHAT_PAY_PRE_ORDER);
post.addHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
post.addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
HttpEntity entity = new StringEntity(jsonEntity);
post.setEntity(entity);
// 发送请求获取响应
CloseableHttpResponse response = httpClient.execute(post);
String stringEntity = EntityUtils.toString(response.getEntity());
```

#### V2版本示例

```java
// 构建微信支付SDK对象
WXPay wxPay = WXPayBuilder(appid, mchid, privateKey, certPath);
// 设置请求参数
Map<String, String> reqdata = new TreeMap<>();
reqdata.put("xxxx", "xxxx");
// TODO: ...
// 获取签名
String sign = v2Sign(reqdata, privateKey);
reqdata.put("sign", sign);
// 发送请求
Map<String, String> result = wxPay.refund(reqdata);
```
