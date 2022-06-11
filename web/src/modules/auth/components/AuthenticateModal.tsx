import { Modal } from '@mantine/core';
import React, { useLayoutEffect, useState } from 'react';

import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

interface AuthenticateModalProps {
  initialType: 'signin' | 'signup';
  opened: boolean;
  onClose: () => void;
}

export function AuthenticateModal({ initialType, onClose, opened }: AuthenticateModalProps) {
  const [type, setType] = useState<'signin' | 'signup'>(initialType);

  useLayoutEffect(() => {
    setType(initialType);
  }, [initialType]);

  return (
    <Modal
      title={type === 'signin' ? 'Sign In' : 'Sign Up'}
      overlayOpacity={0.55}
      overlayBlur={3}
      opened={opened}
      onClose={() => {
        setType(initialType);
        onClose();
      }}
    >
      {type === 'signin' && <SignInForm onGoToSignUp={() => setType('signup')} onClose={onClose} />}
      {type === 'signup' && <SignUpForm onGoToSignIn={() => setType('signin')} onClose={onClose} />}
    </Modal>
  );
}
