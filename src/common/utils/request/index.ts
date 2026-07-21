import { Template } from '~/models/base';

import CryptoJS from 'crypto-js';
import { getEnvironment } from '../app-utils/app-utils';

const SECRET_KEY = import.meta.env.VITE_ENV_KEY || 'd855f76d6fe2ac84f7c0e38a619c5810'; // Debe ser de 32 caracteres
const SECRET_IV = import.meta.env.VITE_ENV_KEY_IV || '358e8a3a5474d65a'; // Debe ser de 16 caracteres

export function encryptBrowser(text: string): string {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(SECRET_IV);

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}

function generateKey(content: any) {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

  return `${content}@${today}`;
}

function generateEnvironmentHeader() {
  const encryptedData = encryptBrowser(generateKey(getEnvironment()));

  return { 'x-env': encryptedData };
}

export function encryptEnvToken() {
  return encryptBrowser(generateKey(getEnvironment()));
}

/**
 * Genera headers para operaciones pre-autenticación (como verificar username durante login)
 * IMPORTANTE: Solo usar para operaciones específicas que requieren acceso antes del login
 * @param context - Contexto de la operación (ej: 'user_name_signin')
 * @returns Headers con x-req-ctx y x-env
 */
export function generatePreAuthHeaders(context: string) {
  const encryptedContext = encryptBrowser(generateKey(context));
  return {
    'x-req-ctx': encryptedContext,
    ...generateEnvironmentHeader(),
  };
}

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

export interface QueryParams {
  [param: string]: any;
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

export const buildQueryString = (queryParams: QueryParams | undefined): string => {
  if (!queryParams) {
    return '';
  }

  const params = Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return !!params ? `?${params}` : '';
};

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
  options.headers = { ...options.headers, ...generateEnvironmentHeader() };

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
  options.headers = { ...options.headers, ...generateEnvironmentHeader(), 'Content-Type': 'application/json' };

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
  options.headers = { ...options.headers, ...generateEnvironmentHeader(), 'Content-Type': 'application/json' };

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
  options.headers = { ...options.headers, ...generateEnvironmentHeader(), 'Content-Type': 'application/json' };

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

  options.headers = { ...options.headers, ...generateEnvironmentHeader(), 'Content-Type': 'application/json' };

  const fetchResponse = await fetch(url, options);

  return parseJSON(fetchResponse);
}
