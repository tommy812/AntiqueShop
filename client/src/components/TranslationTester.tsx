import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper, Divider, Button } from '@mui/material';

const TranslationTester: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Helper function to test a translation key
  const testTranslation = (key: string) => {
    const translation = t(key);
    const isFallback = translation === key; // Simple check if translation is missing
    return { translation, isFallback };
  };

  // Test newly added translation sections
  const testSections = [
    {
      title: 'Error Messages',
      keys: [
        'error.unauthorized.title',
        'error.unauthorized.message',
        'error.notFound.title',
        'error.serverError.title',
      ],
    },
    {
      title: 'Common Actions',
      keys: [
        'common.backToHome',
        'common.contactSupport',
        'common.loadMore',
        'common.save',
        'common.delete',
      ],
    },
    {
      title: 'Form Elements',
      keys: [
        'form.selectPlaceholder',
        'form.required',
        'form.optional',
        'form.validationErrors.required',
        'form.validationErrors.email',
      ],
    },
    {
      title: 'Admin',
      keys: ['admin.dashboard', 'admin.products', 'admin.settings', 'admin.addProduct'],
    },
  ];

  // Change language handler
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Translation Tester
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => changeLanguage('en')}
          sx={{ mr: 1 }}
        >
          Switch to English
        </Button>
        <Button variant="contained" color="secondary" onClick={() => changeLanguage('it')}>
          Switch to Italian
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Current language: <strong>{i18n.language}</strong>
      </Typography>

      {testSections.map((section, index) => (
        <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {section.title}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {section.keys.map(key => {
            const { translation, isFallback } = testTranslation(key);
            return (
              <Box key={key} sx={{ mb: 1 }}>
                <Typography variant="body2" component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                  {key}:
                </Typography>
                <Typography
                  variant="body1"
                  component="span"
                  sx={{
                    color: isFallback ? 'error.main' : 'success.main',
                    fontStyle: isFallback ? 'italic' : 'normal',
                  }}
                >
                  {translation}
                  {isFallback && ' (MISSING)'}
                </Typography>
              </Box>
            );
          })}
        </Paper>
      ))}
    </Box>
  );
};

export default TranslationTester;
