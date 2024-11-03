import {
  AI_PROVIDERS,
  COMMIT_FORMATS,
  COMMIT_OPTIONS,
  CommitOption,
} from '../lib/types.js';

interface ValidationError {
  field: string;
  message: string;
}

export default function validateConfig(config: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!config) {
    errors.push({
      field: 'config',
      message: 'Configuration object is empty',
    });
    return errors;
  }

  if (!Object.values(AI_PROVIDERS).includes(config.provider)) {
    errors.push({
      field: 'provider',
      message: `Must be one of: ${Object.values(AI_PROVIDERS).join(', ')}`,
    });
  }

  if (typeof config.envVariable !== 'string' || !config.envVariable) {
    errors.push({
      field: 'envVariable',
      message: 'Must be a non-empty string',
    });
  }

  if (!Object.values(COMMIT_FORMATS).includes(config.format)) {
    errors.push({
      field: 'format',
      message: `Must be one of: ${Object.values(COMMIT_FORMATS).join(', ')}`,
    });
  }

  if (
    typeof config.maxLength !== 'number' ||
    config.maxLength < 50 ||
    config.maxLength > 100
  ) {
    errors.push({
      field: 'maxLength',
      message: 'Must be a number between 50 and 100',
    });
  }

  if (!config.options || typeof config.options !== 'object') {
    errors.push({
      field: 'options',
      message: 'Must be an object',
    });
  } else {
    const validOptions = Object.values(COMMIT_OPTIONS) as CommitOption[];

    Object.entries(config.options).forEach(([key, value]) => {
      if (!validOptions.includes(key as CommitOption)) {
        errors.push({
          field: `options.${key}`,
          message: `Invalid option. Must be one of: ${validOptions.join(', ')}`,
        });
      }
      if (typeof value !== 'boolean') {
        errors.push({
          field: `options.${key}`,
          message: 'Must be a boolean value',
        });
      }
    });
  }

  return errors;
}
