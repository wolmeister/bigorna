import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  disabled: {
    borderStyle: 'solid',
    cursor: 'default',
    ':hover': {
      backgroundColor: 'transparent',
    },
  },
}));
