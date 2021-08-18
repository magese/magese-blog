function notify () {
  let href = window.location.href
  href = decodeURIComponent(href)
  $.ajax({
    type: 'POST',
    url: 'https://api.magese.com/web/index/notify',
    data: href,
    cache: false,
    processData: false,
    contentType: false,
    success (res) {
      const {data} = res
      console.log(data)
    },
    error (e) {
      console.error(e)
    }
  })
}

window.onload = notify
