import { Avatar, Button, Group, Header, Image, Menu, Modal } from '@mantine/core';
import React, { useCallback, useState } from 'react';
import { Logout } from 'tabler-icons-react';

import { AuthenticateModal } from '../../modules/auth/components/AuthenticateModal';
import { setToken, setUser, useUser } from '../../modules/auth/stores/auth-store';
import { useStyles } from './AppHeader.styles';

export function AppHeader() {
  const { classes } = useStyles();
  const user = useUser();

  const [authType, setAuthType] = useState<'signin' | 'signup'>('signin');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLogout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const handleSignIn = useCallback(() => {
    setAuthType('signin');
    setAuthModalOpen(true);
  }, []);

  const handleSignUp = useCallback(() => {
    setAuthType('signup');
    setAuthModalOpen(true);
  }, []);

  return (
    <Header height={60} pl="md" pr="md">
      <Group className={classes.group} position="apart">
        <div className={classes.logoContainer}>
          <Image src="favicon.png" mr="md" fit="contain" height={40} width={40} />
          <h2 className={classes.title}>bigorna</h2>
        </div>
        <Group>
          {user && (
            <Menu
              control={
                <Avatar color="orange" radius="xl">
                  {user.username.substring(0, 2).toUpperCase()}
                </Avatar>
              }
            >
              <Menu.Item icon={<Logout size={14} />} onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu>
          )}
          {!user && (
            <Button variant="subtle" onClick={handleSignIn}>
              Sign in
            </Button>
          )}
          {!user && (
            <Button variant="outline" onClick={handleSignUp}>
              Sign up
            </Button>
          )}
        </Group>
      </Group>
      {/* Auth */}
      <AuthenticateModal
        initialType={authType}
        opened={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </Header>
  );
}
