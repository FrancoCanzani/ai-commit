# AI Commit

AI Commit is a powerful command-line tool that generates meaningful Git commit messages using AI models. It simplifies the commit process by analyzing the changes in your staged files and providing a suggested commit message tailored to your specified format and options.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Key Security Guidelines](#api-key-security-guidelines)
- [License](#license)

## Features

- **AI-Powered**: Utilizes OpenAI and Anthropic models to generate commit messages.
- **Customizable**: Configure the AI provider, commit message format, and more.
- **Multiple Languages**: Supports various languages for commit messages.
- **Auto-commit Option**: Automatically applies the generated commit message if desired.
- **Preview and Confirm**: Preview the suggested message and confirm before applying.
- **Seamless Integration**: Easily integrates with existing Git workflows.

## Installation

To install AI Commit, clone this repository and run the following command:

```bash
npm install
```

## Usage

After installation, you can use AI Commit from the command line. Here are the available commands:

- **Generate commit message**:  
  To generate a commit message based on the staged changes:

  ```bash
  ai-commit
  ```

- **Configure AI Commit settings**:  
  To set up your preferences:
  ```bash
  ai-commit --config
  ```

## Configuration

The configuration for AI Commit is stored in a JSON file named `ai-commit-rc.json`. You can either configure it manually or through the interactive setup when you run `ai-commit --config`.

### Configuration Options

- **provider**: The AI model provider (`openai` or `anthropic`).
- **envVariable**: The name of the environment variable that holds your API key.
- **format**: The format of the commit message (e.g., `Conventional`, `Simple`, `Detailed`).
- **language**: The language of the commit message (e.g., `English`, `Mandarin`, `Spanish`, etc.).
- **maxLength**: The maximum length of the commit message (between 50 and 100 characters).
- **options**: Additional options such as `autoCommit`, `showDiff`, and `promptPush`.

### Example Configuration

Here's an example of what the `ai-commit-rc.json` configuration file might look like:

```json
{
  "provider": "openai",
  "envVariable": "OPENAI_API_KEY",
  "format": "Conventional (type(scope): description)",
  "language": "English",
  "maxLength": 50,
  "options": {
    "autoCommit": false,
    "showDiff": true,
    "promptPush": false
  }
}
```

## API Key Security Guidelines

- **Never store API keys** directly in your code or configuration files.
- **Use environment variables** to manage your API keys securely.
- **Add `.env` to your `.gitignore`** file to prevent accidental commits of sensitive information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
