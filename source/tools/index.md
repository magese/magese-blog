---
title: tools
subtitle: Tools-工具
date: 2021-05-31 10:36:03
---

<div class="markdown-body tools-body">
    <h1>二维码转换</h1>
    <div class="tools-container">
        <div class="tools-item">
            <p class="tools-title">创建二维码</p>
            <label><textarea id="qrcode-content" cols="40" rows="5" placeholder="输入要转换的内容"></textarea></label>
            <br/>
            <button onclick="createQRCode()">创建</button>
            <br/>
            <!--suppress HtmlUnknownTarget -->
            <img id="qrcode-img" src="/img/loading.gif" alt="qrcode" style="display: none">
        </div>
        <div class="tools-item">
            <p class="tools-title">解析二维码</p>
            <label><textarea id="parse-qrcode-content" cols="40" rows="5" readonly></textarea></label>
            <form id="parse-qrcode-form" method="post" enctype="multipart/form-data">
                <input id="parse-qrcode-file" type="file" name="qrCode">
                <button type="button" onclick="parseQRCode()">解析</button>
            </form>
        </div>
    </div>
    <hr>
    <h1>Base64编码解码</h1>
    <div class="tools-container">
        <div class="tools-item">
            <p class="tools-title">Base64编码</p>
            <label><textarea id="base64-encode-content" cols="40" rows="5" placeholder="输入要进行Base64编码的内容"></textarea></label>
            <br/>
            <button onclick="base64Encode()">编码</button>
        </div>
        <div class="tools-item">
            <p class="tools-title">Base64解码</p>
            <label><textarea id="base64-decode-content" cols="40" rows="5" placeholder="输入要进行Base64解码的内容"></textarea></label>
            <br/>
            <button onclick="base64Decode()">解码</button>
        </div>
    </div>
    <hr>
    <h1>图片Base64转换</h1>
    <div class="tools-container">
        <div class="tools-item">
            <p class="tools-title">Base64转图片</p>
            <label><textarea id="base642img-content" cols="40" rows="5" placeholder="输入要转换的Base64编码"></textarea></label>
            <br/>
            <button onclick="base64ToImage()">转换</button>
            <br/>
            <!--suppress HtmlUnknownTarget -->
            <img id="img2base64-img" src="/img/loading.gif" alt="image" style="display: none">
        </div>
        <div class="tools-item">
            <p class="tools-title">图片转Base64</p>
            <label><textarea id="image2base64-content" cols="40" rows="5" readonly></textarea></label>
            <form id="image2base64-form" method="post" enctype="multipart/form-data">
                <input id="image2base64-file" type="file" name="image">
                <button type="button" onclick="image2Base64()">转换</button>
            </form>
        </div>
    </div>
</div>

