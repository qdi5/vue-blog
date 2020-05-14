export default {
  backend: {
    baseUrl: process.env.NODE_ENV === 'development' ? '/api' : 'http://api.wuzhe.online'
  }
}
