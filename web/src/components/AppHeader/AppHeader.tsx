import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Group, Header, Image, Menu, Title, UnstyledButton } from '@mantine/core';
import { DeviceGamepad2, Folders, Logout } from 'tabler-icons-react';

import { UserRole } from '../../api/user';
import { AuthenticateModal, setToken, setUser, useUser } from '../../modules/auth';

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
        <Link className={classes.logoContainer} to="/">
          <Image src="/public/favicon.png" mr="md" fit="contain" height={40} width={40} />
          <Title order={2}>BIGORNA</Title>
        </Link>

        <Group sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Button variant="subtle" component={Link} to="/search">
            Browse
          </Button>
          {user && (
            <Button variant="subtle" component={Link} to="/my-addons">
              My Addons
            </Button>
          )}
          {user?.role === UserRole.ADMIN && (
            <Menu control={<Button variant="subtle">Manage</Button>}>
              <Menu.Item icon={<DeviceGamepad2 size={14} />} component={Link} to="/games">
                Games
              </Menu.Item>
              {/* <Menu.Item icon={<Folders size={14} />} component={Link} to="/game-categories">
                Categories
              </Menu.Item> */}
            </Menu>
          )}
        </Group>

        <Group>
          {user && (
            <Menu
              control={
                <UnstyledButton>
                  <Avatar color="purple" radius="xl">
                    {user.username.substring(0, 2).toUpperCase()}
                  </Avatar>
                </UnstyledButton>
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
