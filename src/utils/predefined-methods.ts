export const fulfill = (payload: any) => { return payload }

export const pack = (payload: any) => { return payload }

export const httpGET = async (url: string, headers: any, successCallback: (response: any, certificate?: any, payload?: any) => string, errorCallback: (error: Error)=> void) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      // TODO: Handle non-json responses
      const json = response.json()
      json.then(res => {console.log(res)
        successCallback(JSON.stringify(res))
    })
      console.log('httpGET', json)
      return json;
}

export const httpPOST = async (url: string, body: any, headers: any, successCallback: (payload: any, certificate: any, response: any) => string, errorCallback: (error: Error)=> void) => {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: body
      });
      return response.json();
}

export const attest = (nonce: string, successCallback: (payload: any, certificate: any, response: any) => string, errorCallback: (error: Error)=> void) => {}

export const ownAddress = () => {
    return 'tzx'
}

export const generateSecureRandomHex = (): string => {
    var buf = new Uint8Array(4);
    window.crypto.getRandomValues(buf);
    return Array.from(buf).map(x => x.toString(16)).join('')
}
