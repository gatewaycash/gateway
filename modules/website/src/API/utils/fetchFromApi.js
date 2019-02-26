import { getapikeys } from 'API'

const fetchForEachApiKey = async (endpoint, keys, params) => {
  let requests = []
  let responses = []
  keys = keys || (await getapikeys()).APIKeys
  params = params
    ? Object.keys(params)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&')
    : ''
  let serializedParams = params && `&${params}`
  keys.forEach(key =>
    requests.push(
      fetch(
        `${process.env.REACT_APP_GATEWAY_BACKEND}/v2/${endpoint}?APIKey=${
          key.APIKey
        }${serializedParams}`
      ).then(
        response =>
          response.ok &&
          response
            .json()
            .then(
              response =>
                response.status !== 'error' && responses.push(response)
            )
      )
    )
  )
  await Promise.all(requests)
  return responses
}

const fetchFromApi = async (endpoint, keys, params) => {
  let dataList = []
  let responses = await fetchForEachApiKey(endpoint, keys, params)
  responses.forEach(response =>
    response[endpoint].forEach(d => dataList.push(d))
  )
  return dataList
}

export default fetchFromApi
