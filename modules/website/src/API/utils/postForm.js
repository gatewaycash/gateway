const postForm = (endpoint, form, method = 'POST') => {
  return fetch(`${process.env.REACT_APP_GATEWAY_BACKEND}/v2/${endpoint}`, {
    method: method,
    mode: 'cors',
    body: new URLSearchParams(new FormData(form)),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export default postForm
