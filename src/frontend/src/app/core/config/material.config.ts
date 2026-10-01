import { Provider } from '@angular/core';
import { MAT_CARD_CONFIG, MatCardConfig } from '@angular/material/card';

export const materialProviders: Provider[] = [
  {
    provide: MAT_CARD_CONFIG,
    useValue: { appearance: 'outlined' } satisfies MatCardConfig,
  },
];
