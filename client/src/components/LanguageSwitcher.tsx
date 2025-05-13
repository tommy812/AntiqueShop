import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  // Get current language
  const currentLanguage = i18n.language;
  
  // Language options
  const languages = [
    { code: 'en', name: t('language.en') },
    { code: 'it', name: t('language.it') }
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        id="language-button"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
        startIcon={<LanguageIcon />}
        sx={{ textTransform: 'none' }}
      >
        {currentLanguage === 'en' ? 'English' : 'Italiano'}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
          {t('language.select')}
        </Typography>
        {languages.map((language) => (
          <MenuItem 
            key={language.code} 
            onClick={() => changeLanguage(language.code)}
            selected={currentLanguage === language.code}
          >
            {language.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher; 