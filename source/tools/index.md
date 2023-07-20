---
title: tools
subtitle: Tools-工具
date: 2021-05-31 10:36:03
---

<!--suppress HtmlUnknownTarget -->
<div class="markdown-body tools-body">
    <details>
        <summary>消息推送</summary>
        <br/>
        <div class="tools-container">
            <div class="tools-item">
                <p class="tools-title">输入推送</p>
                <label for="push-type">
                    <select id="push-type">
                        <option value="">选择推送方式</option>
                        <option value="bark">bark</option>
                        <option value="server-chan">server-chan</option>
                    </select>
                </label>
                <label for="push-title"><input id="push-title" type="text" placeholder="输入要推送的标题"/></label>
                <label for="push-content"><textarea id="push-content" placeholder="输入要推送的内容"></textarea></label>
                <label><button onclick="pushMessage()">发送</button></label>
            </div>
        </div>
    </details>
    <details>
        <summary>二维码转换</summary>
        <br/>
        <div class="tools-container">
            <div class="tools-item">
                <p class="tools-title">创建二维码</p>
                <label for="qrcode-content"><textarea id="qrcode-content" placeholder="输入要转换的内容"></textarea></label>
                <label><button onclick="createQRCode()">创建</button></label>
                <img id="qrcode-img" src="/img/loading.gif" alt="qrcode" style="display: none">
            </div>
            <div class="tools-item">
                <p class="tools-title">解析二维码</p>
                <label for="parse-qrcode-content"><textarea id="parse-qrcode-content" readonly></textarea></label>
                <form id="parse-qrcode-form" method="post" enctype="multipart/form-data">
                    <label for="parse-qrcode-file"><input id="parse-qrcode-file" type="file" name="qrCode"></label>
                    <label><button type="button" onclick="parseQRCode()">解析</button></label>
                </form>
            </div>
        </div>
    </details>
    <details>
        <summary>Base64编码解码</summary>
        <br/>
        <div class="tools-container">
            <div class="tools-item">
                <p class="tools-title">Base64编码</p>
                <label for="base64-encode-content"><textarea id="base64-encode-content" placeholder="输入要进行Base64编码的内容"></textarea></label>
                <label><button onclick="base64Encode()">编码</button></label>
            </div>
            <div class="tools-item">
                <p class="tools-title">Base64解码</p>
                <label for="base64-decode-content"><textarea id="base64-decode-content" cols="40" rows="5" placeholder="输入要进行Base64解码的内容"></textarea></label>
                <label><button onclick="base64Decode()">解码</button></label>
            </div>
        </div>
    </details>
    <details>
        <summary>图片Base64转换</summary>
        <br/>
        <div class="tools-container">
            <div class="tools-item">
                <p class="tools-title">Base64转图片</p>
                <label for="base642img-content"><textarea id="base642img-content" cols="40" rows="5" placeholder="输入要转换的Base64编码"></textarea></label>
                <label><button onclick="base64ToImage()">转换</button></label>
                <img id="img2base64-img" src="/img/loading.gif" alt="image" style="display: none">
            </div>
            <div class="tools-item">
                <p class="tools-title">图片转Base64</p>
                <label for="image2base64-content"><textarea id="image2base64-content" cols="40" rows="5" readonly></textarea></label>
                <form id="image2base64-form" method="post" enctype="multipart/form-data">
                    <label for="image2base64"><input id="image2base64-file" type="file" name="image"></label>
                    <label><button type="button" onclick="image2Base64()">转换</button></label>
                </form>
            </div>
        </div>
    </details>
    <details>
        <summary>MD5摘要</summary>
        <br/>
        <div class="tools-container">
            <div class="tools-item">
                <p class="tools-title">原始内容</p>
                <label><textarea id="md5-origin-content" cols="40" rows="5" placeholder="输入要进行MD5的内容"></textarea></label>
                <label>
                    <button onclick="md5Hex(false)">普通摘要</button>
                    <button onclick="md5Hex(true)">带横杠摘要</button>
                </label>
            </div>
            <div class="tools-item">
                <p class="tools-title">MD5摘要</p>
                <label><textarea id="md5-hex-content" cols="40" rows="5" readonly></textarea></label>
            </div>
        </div>
    </details>
</div>

