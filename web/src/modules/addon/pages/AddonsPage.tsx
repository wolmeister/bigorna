import React from 'react';
import { Card, Image, Text, Title } from '@mantine/core';

import { AppLayout } from '../../../components/AppLayout/AppLayout';

export function AddonsPage() {
  return (
    <AppLayout>
      <Title order={2} style={{ margin: 0, marginBottom: 16 }} color="primary">
        Top Games
      </Title>
      <Card shadow="sm" p="xl" style={{ width: 200 }}>
        <Card.Section style={{ position: 'relative' }}>
          <Image
            height={160}
            width={200}
            src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
          />
          <div
            style={{
              width: '100%',
              position: 'absolute',
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,.50)',
            }}
          >
            <Text weight={500} size="lg" style={{ textAlign: 'center' }}>
              World of Warcraft
            </Text>
          </div>
        </Card.Section>
      </Card>
      <Title order={2} style={{ margin: 0, marginTop: 32, marginBottom: 16 }}>
        Most Downloaded Addons
      </Title>
      <Card shadow="sm" p="xl" style={{ width: 200 }}>
        <Card.Section style={{ position: 'relative' }}>
          <Image
            height={160}
            width={200}
            src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
          />
          <div
            style={{
              width: '100%',
              position: 'absolute',
              top: 0,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,.50)',
            }}
          >
            <Text weight={500} size="lg" style={{ textAlign: 'center' }}>
              Weak Auras
            </Text>
          </div>
          <div
            style={{
              width: '100%',
              position: 'absolute',
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,.50)',
            }}
          >
            <Text weight={500} size="lg" style={{ textAlign: 'center' }}>
              World of Warcraft
            </Text>
          </div>
        </Card.Section>
      </Card>
      <Title order={2} style={{ margin: 0, marginTop: 32, marginBottom: 16 }}>
        New Addons
      </Title>
      <Card shadow="sm" p="xl" style={{ width: 200 }}>
        <Card.Section style={{ position: 'relative' }}>
          <Image
            height={160}
            width={200}
            src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
          />
          <div
            style={{
              width: '100%',
              position: 'absolute',
              top: 0,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,.50)',
            }}
          >
            <Text weight={500} size="lg" style={{ textAlign: 'center' }}>
              Weak Auras
            </Text>
          </div>
          <div
            style={{
              width: '100%',
              position: 'absolute',
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,.50)',
            }}
          >
            <Text weight={500} size="lg" style={{ textAlign: 'center' }}>
              World of Warcraft
            </Text>
          </div>
        </Card.Section>
      </Card>
    </AppLayout>
  );
}
