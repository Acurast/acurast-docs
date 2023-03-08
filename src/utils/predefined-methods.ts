export const fulfill = (payload: any) => {
  console.log("fulfill", payload);
  return payload;
};

export const pack = (payload: any) => {
  console.log("pack");
  return payload;
};

export const sign = (payload: any) => {
  console.log("sign");
  return payload;
};

export const httpGET = async (
  url: string,
  headers: any,
  successCallback: (response: any, certificate?: any, payload?: any) => string,
  errorCallback: (error: Error) => void
) => {
  console.log("httpGET");
  const response = await fetch(
    "https://cors-proxy.airgap.prod.gke.papers.tech/proxy-with-fingerprint?url=" +
      url,
    {
      method: "GET",
      mode: "cors",
      headers: headers,
    }
  );

  // TODO: Handle non-json responses
  const jsonPromise = response.json();
  jsonPromise.then((res) => {
    console.log("response", res);
    successCallback(
      JSON.stringify(res),
      response.headers.get("X-Fingerprint256")
    );
  });

  return jsonPromise;
};

export const httpPOST = async (
  url: string,
  body: any,
  headers: any,
  successCallback: (payload: any, certificate?: any, response?: any) => string,
  errorCallback: (error: Error) => void
) => {
  console.log("httpPOST");
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: headers,
    body: body,
  });

  const text = response.text();

  text.then((res) => {
    successCallback(res);
  });

  return text;
};

export const attest = (
  nonce: string,
  successCallback: (payload: any, certificate: any, response: any) => string,
  errorCallback: (error: Error) => void
) => {
  console.log("attest");
};

export const ownAddress = () => {
  return "tz1xxxxxxx";
};

export const generateSecureRandomHex = (): string => {
  var buf = new Uint8Array(4);
  window.crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((x) => x.toString(16))
    .join("");
};

export const _STD_ = {
  chains: {
    ethereum: {
      fulfill: async (rpc: string, destination: string, payload: string, extra: Record<string, any>, onSuccess: (opHash: string) => void, onError: (err: any) => void) => {
        onSuccess("0x0123456789");
      }
    }
  },
  random: {
    generateSecureRandomHex,
  }
};
