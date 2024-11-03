# aicommit

## Overview

`aicommit` is an AI-powered Git commit message generator that assists developers in creating meaningful and structured commit messages using OpenAI or Anthropic's AI models. The tool analyzes the differences in staged changes and generates a proposed commit message based on configurable parameters.

## Features

- Generates commit messages based on staged changes.
- Supports multiple AI providers (OpenAI and Anthropic).
- Configurable commit message formats and languages.
- Allows auto-commit and preview options.

## Installation

To install `aicommit`, run:

```bash
npm install aicommit
```

## Usage

To use the tool, you can run it directly from the command line:

```bash
npx aicommit
```

### Commands

- **Generate commit message for staged changes:**

  ```bash
  npx aicommit
  ```

- **Configure aicommit settings:**
  ```bash
  npx aicommit --config
  ```

## Configuration

The configuration settings can be defined in the `aicommit-rc.json` file. The tool will attempt to read this file when executed. Here’s an example of the default configuration:

```json
{
  "provider": "openai",
  "envVariable": "OPENAI_API_KEY",
  "format": "Conventional (type(scope): description)",
  "language": "english",
  "maxLength": 50,
  "options": {
    "showDiff": false,
    "autoCommit": false
  }
}
```

### Default Configuration

If you choose not to set up a configuration, the default settings are as follows:

- **AI Provider:** OpenAI (API key will be extracted from the environment variable `OPENAI_API_KEY`)
- **Format:** Simple descriptions
- **Length:** 50 characters maximum
- **Language:** English
- **Auto commit:** disabled

### API Key Management

- Never store API keys directly in your code or config files.
- Use environment variables to manage your API keys securely.
- Add `.env` to your `.gitignore` to avoid accidental exposure of your API keys.

## Example Usage

1. Run `aicommit-config` to set up your preferences or let the tool use the default configuration.
2. Stage your changes using `git add`.
3. Execute `aicommit` to generate a commit message based on the staged changes.
4. Confirm the proposed commit message or auto-commit based on your settings.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
