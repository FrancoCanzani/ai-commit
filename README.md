# ai-commit

`ai-commit` is a Node.js package that leverages AI to generate Git commit messages based on changes staged in your repository. This package provides a simple command-line interface for configuring and generating meaningful commit messages using OpenAI and Anthropic AI models.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [File Descriptions](#file-descriptions)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install `ai-commit`, you can use npm or yarn:

```bash
npm install ai-commit --save-dev
```

or

```bash
yarn add ai-commit --dev
```

## Configuration

Before using `ai-commit`, you need to configure it to specify the AI provider and other preferences. You can run the configuration setup using the following command:

```bash
npx ai-commit --config
```

This command will guide you through a series of prompts to set up the following:

- **AI Provider**: Choose between OpenAI and Anthropic.
- **Environment Variable**: Set the environment variable name for your API key.
- **Commit Message Format**: Select the desired format for your commit messages (Simple, Conventional, or Detailed).
- **Maximum Length**: Define the maximum character length for generated commit messages (between 50 and 100).
- **Language**: Choose the language for the commit messages.
- **Options**: Specify additional options such as auto-commit and prompt for pushing changes after committing.

After configuration, your settings will be saved in a JSON file named `ai-commit-rc.json` in your project root.

## Usage

To generate a commit message for staged changes, simply run:

```bash
npx ai-commit
```

The tool will analyze your staged changes and generate a suggested commit message based on your configuration. You will have the option to review and apply the generated message.

### Commands

- `ai-commit`: Generate a commit message for staged changes.
- `ai-commit --config`: Configure `ai-commit` settings.

## Directory Structure

The package has the following directory structure:

```
└── ./
    ├── src
    │   ├── helpers
    │   │   ├── ai-model.ts
    │   │   ├── get-config-file.ts
    │   │   └── validate-config.ts
    │   ├── lib
    │   │   ├── postinstall.ts
    │   │   ├── setup.ts
    │   │   └── types.ts
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

## File Descriptions

### `/src/helpers/ai-model.ts`

This module handles the interaction with AI providers to generate commit messages. It initializes the AI model based on the configured provider and manages API keys from environment variables.

### `/src/helpers/get-config-file.ts`

This helper reads the configuration file (`ai-commit-rc.json`) and returns the parsed configuration. It also validates the configuration and reports any errors.

### `/src/helpers/validate-config.ts`

Validates the configuration object ensuring all required fields are correctly set up. It checks for valid AI providers, commit formats, and other options.

### `/src/lib/postinstall.ts`

This script runs after installation to display an ASCII art welcome message and basic instructions on how to get started with `ai-commit`.

### `/src/lib/setup.ts`

Handles the interactive setup process for configuring `ai-commit`. Prompts users for various configuration settings and saves them in the JSON file.

### `/src/lib/types.ts`

Defines the types used in the application, including constants for AI providers, commit formats, and configuration structures.

### `/src/index.ts`

The main entry point for the command line interface. This file sets up the command structure, handles user input, and manages the generation and application of commit messages.

## API Reference

### `AiModel`

```typescript
class AiModel {
  constructor(provider: 'openai' | 'anthropic' | null);

  async generateCommitMessage(diff: string): Promise<string>;
}
```

- **constructor(provider)**: Initializes the AI model with the specified provider.
- **generateCommitMessage(diff)**: Takes a string representing the git diff and returns a promise that resolves to a generated commit message.

## Contributing

Contributions to `ai-commit` are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

`ai-commit` is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
