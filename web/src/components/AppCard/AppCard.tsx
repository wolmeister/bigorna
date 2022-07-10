import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Text } from '@mantine/core';

type AppCardProps = {
  navigateTo: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
};

export function AppCard({ navigateTo, imageUrl, title, subtitle }: AppCardProps) {
  return (
    <Card
      shadow="sm"
      p="xl"
      style={{ width: 200, cursor: 'pointer' }}
      component={Link}
      to={navigateTo}
    >
      <Card.Section style={{ position: 'relative' }}>
        <Image height={160} width={200} src={imageUrl} />
        {subtitle ? (
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
              {subtitle}
            </Text>
          </div>
        ) : null}
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
            {title}
          </Text>
        </div>
      </Card.Section>
    </Card>
  );
}
