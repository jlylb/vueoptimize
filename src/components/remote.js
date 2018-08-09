export function MP() {
  return new Promise(function(resolve, reject) {
    window.init = function() {
      resolve(AMap)
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://webapi.amap.com/maps?v=1.4.8&key=5243871f154261d327924562a97d8184&callback=init'
    script.onerror = reject
    document.head[0].appendChild(script)
  })
}
