function substituteUrlParams(url, params) {
  return url.replace(/:([a-zA-Z_]+)/g, (_, key) => {
    if (params[key] === undefined) {
      throw new Error(`Missing parameter: ${key}`);
    }
    return encodeURIComponent(params[key]);
  });
}

export default substituteUrlParams