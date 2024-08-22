import { Template } from '~/models/base';

export class ResponseError extends Error {
  public response: Response;
  public content: Promise<any>;

  constructor(response: Response, content: Promise<any>) {
    super(response.statusText);
    this.response = response;
    this.content = content;
  }
}

export interface APIResponse {
  currentPage: number;
  totalPages: number;
  data?: Template | Template[];
  error?: APIError;
}

export interface APIError {
  message?: string;
  errorCode?: string;
  errorNumber?: number;
}
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */

async function parseJSON(response: Response) {
  const json = await response.json();

  if (response.ok) {
    return json;
  }

  const error = new ResponseError(response, json);
  error.response = response;
  throw error;
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new ResponseError(response, null);

  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export async function request(url: string, options?: RequestInit): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, options);

  return parseJSON(fetchResponse);
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export async function postRequest(url: string, options?: RequestInit): Promise<Response | { err: ResponseError }> {
  options.method = 'POST';
  options.headers = { ...options.headers, 'Content-Type': 'application/json' };

  const fetchResponse = await fetch(url, options);

  return parseJSON(fetchResponse);
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export async function putRequest(url: string, options?: RequestInit): Promise<{} | { err: ResponseError }> {
  options.method = 'PUT';
  options.headers = { ...options.headers, 'Content-Type': 'application/json' };

  const fetchResponse = await fetch(url, options);

  return parseJSON(fetchResponse);
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export async function patchRequest(url: string, options?: RequestInit): Promise<{} | { err: ResponseError }> {
  options.method = 'PATCH';
  options.headers = { ...options.headers, 'Content-Type': 'application/json' };

  const fetchResponse = await fetch(url, options);

  return parseJSON(fetchResponse);
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export async function deleteRequest(url: string, options?: RequestInit): Promise<{} | { err: ResponseError }> {
  options.method = 'DELETE';
  options.headers = { ...options.headers, 'Content-Type': 'application/json' };

  const fetchResponse = await fetch(url, options);

  return parseJSON(fetchResponse);
}
