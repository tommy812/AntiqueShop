/// <reference types="./mui.d.ts" />

import '@mui/material/Grid';

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      item?: boolean;
    }
  }
} 