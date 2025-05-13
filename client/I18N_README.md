# Pischetola Antiques - Internationalization Guide

This document explains how to work with the internationalization (i18n) implementation in the Pischetola Antiques website.

## Overview

The website uses the `i18next` library with `react-i18next` to provide multilanguage support. Currently, the following languages are supported:

- English (en)
- Italian (it)

## Project Structure

- `/src/i18n.ts` - Main i18n configuration file
- `/public/locales/` - Contains translation files for each language
  - `/public/locales/en/translation.json` - English translations
  - `/public/locales/it/translation.json` - Italian translations

## How to Use Translations in Components

1. Import the `useTranslation` hook:

```jsx
import { useTranslation } from 'react-i18next';
```

2. Initialize the hook in your component:

```jsx
const { t } = useTranslation();
```

3. Use the `t` function to translate text:

```jsx
<Typography>{t('navigation.home')}</Typography>
```

## Translation Keys Structure

Translation keys are organized hierarchically, for example:

```
navigation.home
homepage.hero.title
product.dimensions
```

## Adding New Translations

1. Add your new translation key and text to `/public/locales/en/translation.json`
2. Also add the same key with the translated text to `/public/locales/it/translation.json`
3. Use the key in your component with the `t` function

## Adding New Languages

To add a new language:

1. Create a new folder under `/public/locales/` with the language code (e.g., `/public/locales/fr/` for French)
2. Copy the `translation.json` file from an existing language and translate all values
3. Update the language switcher in `/src/components/LanguageSwitcher.tsx` to include the new language

## Translation Format

Translations support variables using the `{{variableName}}` syntax:

```json
{
  "footer": {
    "copyright": "© {{year}} Pischetola Antiques. All rights reserved."
  }
}
```

Used in code like:

```jsx
t('footer.copyright', { year: new Date().getFullYear() })
```

## Available Scripts

- `npm start` - Starts the development server with internationalization support
- `npm run build` - Builds the application with all translations

## Best Practices

1. Keep translation keys organized by feature or component
2. Use meaningful and hierarchical keys
3. Avoid hardcoding text in components; always use the `t` function
4. When adding new features, update all language files simultaneously

## Troubleshooting

If translations aren't working:

1. Check that the key exists in all language files
2. Verify that the i18n library is properly initialized in `index.tsx`
3. Confirm that the language selector is working correctly
4. Check the browser console for any errors related to translations 