export type RequestOptions<Q, P> = {
  query?: Q;
  params?: P;
};

export interface HttpClient {
  get<Res, Q = unknown, P = unknown>(url: string, options?: RequestOptions<Q, P>): Promise<Res>;
  post<Res, Req, Q = unknown, P = unknown>(
    url: string,
    body: Req,
    options?: RequestOptions<Q, P>
  ): Promise<Res>;
  put<Res, Req, Q = unknown, P = unknown>(
    url: string,
    body: Req,
    options?: RequestOptions<Q, P>
  ): Promise<Res>;
  patch<Res, Req, Q = unknown, P = unknown>(
    url: string,
    body: Req,
    options?: RequestOptions<Q, P>
  ): Promise<Res>;
  delete<Res, Q = unknown, P = unknown>(url: string, options?: RequestOptions<Q, P>): Promise<Res>;
}

export class HttpError extends Error {
  constructor(public code: number, public error: string) {
    super(`[Http Error ${code}]: ${error}`);
  }
}

export class HttpClientImpl implements HttpClient {
  constructor(public readonly baseUrl = '/api') {}

  async get<Res, Q = unknown, P = unknown>(
    url: string,
    options?: RequestOptions<Q, P>
  ): Promise<Res> {
    return this.doFetch(url, 'GET', null, options);
  }

  async post<Res, Req, Q = unknown, P = unknown>(
    url: string,
    body: Req,
    options?: RequestOptions<Q, P>
  ): Promise<Res> {
    return this.doFetch(url, 'POST', body, options);
  }

  async put<Res, Req, Q = unknown, P = unknown>(
    url: string,
    body: Req,
    options?: RequestOptions<Q, P>
  ): Promise<Res> {
    return this.doFetch(url, 'PUT', body, options);
  }

  async patch<Res, Req, Q = unknown, P = unknown>(
    url: string,
    body: Req,
    options?: RequestOptions<Q, P>
  ): Promise<Res> {
    return this.doFetch(url, 'PATCH', body, options);
  }

  async delete<Res, Q = unknown, P = unknown>(
    url: string,
    options?: RequestOptions<Q, P>
  ): Promise<Res> {
    return this.doFetch(url, 'DELETE', null, options);
  }

  private async doFetch<Res, Req, Q = unknown, P = unknown>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body?: Req,
    options?: RequestOptions<Q, P>
  ) {
    // Apply path params
    let finalUrl = this.baseUrl + url;
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        finalUrl = finalUrl.replace(`:${key}`, String(value));
      });
    }

    // Apply query params
    const urlSearchParams = new URLSearchParams(finalUrl);
    if (options?.query) {
      Object.entries(options.query).forEach(([key, value]) => {
        urlSearchParams.append(key, String(value));
      });
    }

    // Perform the request
    const res = await fetch(urlSearchParams.toString(), {
      // @TODO: Support formdata
      headers: {
        'Content-Type': 'application/json',
      },
      method,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new HttpError(res.status, await res.text());
    }

    const jsonRes = await res.json();
    return jsonRes as Res;
  }
}
