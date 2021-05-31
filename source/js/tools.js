const HOST = 'https://api.magese.com'

/**
 * 创建二维码
 */
function createQRCode () {
  const $img = $('#qrcode-img');
  $img.attr('src', '/img/loading.gif')
  $img.attr('srcset', '/img/loading.gif')
  $img.show()
  let content = $('#qrcode-content').val()
  const request = {content}
  send('/web/tools/createQRCode', request).then(data => {
    $img.attr('src', 'data:image/png;base64,' + data.base64)
    $img.attr('srcset', 'data:image/png;base64,' + data.base64)
  })
}

/**
 * 解析二维码
 */
function parseQRCode () {
  const form = new FormData(document.getElementById('parse-qrcode-form'))
  upload('/web/tools/parseQRCode', form).then(data => {
    $('#parse-qrcode-content').val(data.content)
  })
}

/**
 * Base64转图片
 */
function base64ToImage () {
  const $img = $('#img2base64-img');
  $img.attr('src', '/img/loading.gif')
  $img.attr('srcset', '/img/loading.gif')
  $img.show()
  let base64 = $('#base642img-content').val()
  $img.attr('src', 'data:image/png;base64,' + base64)
  $img.attr('srcset', 'data:image/png;base64,' + base64)
}

/**
 * 图片转Base64
 */
function image2Base64 () {
  const form = new FormData(document.getElementById('image2base64-form'))
  upload('/web/tools/image2Base64', form).then(data => {
    $('#image2base64-content').val(data.base64)
  })
}


/**
 * 发送请求
 *
 * @param path    请求路径
 * @param request 请求参数
 * @returns {Promise}
 */
function send (path, request) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: HOST + path,
      data: JSON.stringify(request),
      type: 'POST',
      contentType: 'application/json',
      async: true,
      success (res) {
        const {code, msg, data} = res
        if (code !== '000000') {
          alert(msg)
          reject()
        } else {
          resolve(data);
        }
      },
      error (e) {
        reject(e)
      }
    })
  })
}

/**
 * 上传请求
 *
 * @param path 请求路径
 * @param form 表单数据
 * @returns {Promise}
 */
function upload (path, form) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'POST',
      url: HOST + path,
      data: form,
      cache: false,
      processData: false,
      contentType: false,
      success (res) {
        const {code, msg, data} = res
        if (code !== '000000') {
          alert(msg)
          reject()
        } else {
          resolve(data);
        }
      },
      error (e) {
        reject(e)
      }
    })
  })
}
