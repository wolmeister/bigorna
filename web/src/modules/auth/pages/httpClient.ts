export class httpClient {
  public post<Req, Res>(url: string, o: Req): Promise<Res> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(o),
      signal: controller.signal,
    };

    return fetch(url, requestOptions).then(async res => {
      if (!res.ok) {
        throw new Error();
      }
      const json = await res.json();
      return json as Res;
    });
  }
}
