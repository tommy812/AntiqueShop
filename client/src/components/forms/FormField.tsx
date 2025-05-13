import React from 'react';
import { 
  TextField, 
  TextFieldProps,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
  Typography,
  Box,
  Tooltip,
  Alert,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';

interface FormFieldProps extends Omit<TextFieldProps, 'error'> {
  name: string;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
  label: string;
  type?: string;
  required?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  helperText?: string;
  acceptedFileTypes?: string; // For file inputs
  infoText?: string; // Additional info tooltip
  validationRules?: string; // Validation rules description
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  errors,
  touched,
  label,
  type = 'text',
  required = false,
  options,
  helperText,
  acceptedFileTypes,
  infoText,
  validationRules,
  ...rest
}) => {
  const { t } = useTranslation();
  
  // Determine if field has an error
  const hasError = Boolean(touched?.[name] && errors?.[name]);
  
  // Additional info tooltip
  const renderInfoTooltip = () => {
    if (!infoText) return null;
    
    return (
      <Tooltip title={infoText} arrow placement="top">
        <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
          <InfoIcon fontSize="small" color="action" />
        </IconButton>
      </Tooltip>
    );
  };
  
  // Error message with proper formatting
  const renderErrorMessage = () => {
    if (!hasError) return helperText;
    
    if (errors?.[name]?.includes(',')) {
      // Multiple errors, split and display as a list
      const errorsList = errors[name].split(',').map(err => err.trim());
      
      return (
        <Alert severity="error" sx={{ py: 0, mt: 0.5 }}>
          {errorsList.map((err, index) => (
            <Typography variant="caption" display="block" key={index}>
              • {err}
            </Typography>
          ))}
        </Alert>
      );
    }
    
    return errors?.[name];
  };
  
  // For select fields
  if (options && options.length > 0) {
    return (
      <FormControl 
        fullWidth 
        error={hasError}
        margin="normal"
        required={required}
        sx={{ 
          minWidth: '150px',
          width: '100%',
          '& .MuiFormHelperText-root': {
            position: 'absolute',
            bottom: '-20px'
          }
        }}
      >
        <InputLabel id={`${name}-label`}>{label} {renderInfoTooltip()}</InputLabel>
        <Select
          labelId={`${name}-label`}
          id={name}
          name={name}
          label={label}
          {...rest as SelectProps}
          aria-describedby={hasError ? `${name}-error` : undefined}
          sx={{ minWidth: '150px' }}
        >
          <MenuItem value="">
            <em>{t('form.selectPlaceholder', 'Select...')}</em>
          </MenuItem>
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {(hasError || helperText || validationRules) && (
          <FormHelperText error={hasError} id={hasError ? `${name}-error` : undefined}>
            {renderErrorMessage() || validationRules}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
  
  // For textarea fields
  if (type === 'textarea') {
    return (
      <Box sx={{ 
        position: 'relative', 
        marginTop: 2, 
        marginBottom: 3, 
        width: '100%',
        minWidth: '150px',
        flex: 1,
        display: 'flex'
      }}>
        <TextField
          fullWidth
          id={name}
          name={name}
          label={
            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
              {label}
              {renderInfoTooltip()}
            </Box>
          }
          error={hasError}
          helperText={renderErrorMessage() || validationRules}
          multiline
          rows={4}
          required={required}
          aria-describedby={hasError ? `${name}-error` : undefined}
          FormHelperTextProps={{
            id: hasError ? `${name}-error` : undefined,
            sx: { position: 'absolute', bottom: '-20px' }
          }}
          sx={{ 
            minWidth: '150px', 
            width: '100%',
            flex: 1
          }}
          {...rest}
        />
      </Box>
    );
  }
  
  // For file upload fields
  if (type === 'file') {
    // Extract handlers that can work with standard HTML input
    const { onChange, onBlur } = rest;
    
    return (
      <Box sx={{ position: 'relative', my: 2, minWidth: '150px', marginBottom: hasError ? '30px' : '16px' }}>
        <Typography variant="subtitle2" gutterBottom component="label" htmlFor={name} sx={{ display: 'flex', alignItems: 'center' }}>
          {label}{required && <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>}
          {renderInfoTooltip()}
        </Typography>
        <Box
          sx={{
            border: hasError ? '1px solid #d32f2f' : '1px solid #ccc',
            borderRadius: 1,
            padding: 1,
            backgroundColor: '#fff',
            minWidth: '150px'
          }}
        >
          <input
            type="file"
            id={name}
            name={name}
            style={{ 
              width: '100%',
              padding: '8px 0',
              minWidth: '150px'
            }}
            onChange={onChange}
            onBlur={onBlur}
            accept={acceptedFileTypes}
            required={required}
            aria-describedby={hasError ? `${name}-error` : undefined}
            aria-invalid={hasError}
          />
        </Box>
        {(hasError || helperText || validationRules) && (
          <FormHelperText 
            error={hasError} 
            id={hasError ? `${name}-error` : undefined}
            sx={{ position: 'absolute', bottom: '-20px' }}
          >
            {renderErrorMessage() || validationRules}
          </FormHelperText>
        )}
      </Box>
    );
  }
  
  // Default text field
  return (
    <Box sx={{ position: 'relative', marginTop: 2, marginBottom: 3, minWidth: '150px' }}>
      <TextField
        fullWidth
        id={name}
        name={name}
        label={
          <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
            {label}
            {renderInfoTooltip()}
          </Box>
        }
        type={type}
        error={hasError}
        helperText={renderErrorMessage() || validationRules}
        required={required}
        aria-describedby={hasError ? `${name}-error` : undefined}
        FormHelperTextProps={{
          id: hasError ? `${name}-error` : undefined,
          sx: { position: 'absolute', bottom: '-20px' }
        }}
        sx={{ minWidth: '150px' }}
        {...rest}
      />
    </Box>
  );
};

export default FormField; 