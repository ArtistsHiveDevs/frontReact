export const isRequiredField = (required: any): boolean => {
  if (required === undefined || required === null || required === false || required === 'false') {
    return false;
  }
  if (typeof required === 'object') {
    return isRequiredField(required.value);
  }
  if (typeof required === 'string') {
    return required.trim().length > 0;
  }
  return !!required;
};

export const withRequiredMessage = (config: any, message: string) => {
  if (!config || !isRequiredField(config.required) || !message) {
    return config;
  }
  if (typeof config.required === 'string' && config.required !== 'true') {
    return config;
  }
  if (typeof config.required === 'object' && config.required.message) {
    return config;
  }
  return { ...config, required: message };
};
