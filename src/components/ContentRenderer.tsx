import { useState, useEffect } from 'react';
import { Title, Text, Box, Image, Button, Flex, Paper } from '@mantine/core';
import { IconPhoto, IconFileText, IconVideo, IconInfoCircle } from '@tabler/icons-react';

interface ContentRendererProps {
  data: any;
}

export default function ContentRenderer({ data }: ContentRendererProps) {
  const [activeAction, setActiveAction] = useState<any>(null);

  useEffect(() => {
    setActiveAction(null);
  }, [data]);

  if (!data) return null;

  return (
    <Flex h="100%" gap={0}>
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {data.title && (
          <Title order={1} mb="md">{data.title}</Title>
        )}

        {data.description && (
          <Text mb="md" style={{ overflowWrap: 'break-word', lineHeight: 1.6, flexShrink: 0 }}>
            {data.description}
          </Text>
        )}

        <Box style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {data.mainImage && (
            <Image
              src={import.meta.env.BASE_URL + data.mainImage.replace(/^\//, '')}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}

          {activeAction && (
            <Paper
              withBorder
              shadow="xl"
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '50%',
                height: '50%',
                minWidth: '200px',
                minHeight: '200px',
                resize: 'both',
                overflow: 'hidden',
                direction: 'rtl',
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              <Box style={{ direction: 'ltr', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {activeAction.type === 'img' && (
                  <Image
                    src={import.meta.env.BASE_URL + activeAction.content.replace(/^\//, '')}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
                
                {activeAction.type === 'text' && (
                  <Box p="md" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                    <Text style={{ overflowWrap: 'break-word', lineHeight: 1.6 }}>
                      {activeAction.content}
                    </Text>
                  </Box>
                )}
                
                {activeAction.type === 'video' && (
                  <Box style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
                    <video
                      src={import.meta.env.BASE_URL + activeAction.content.replace(/^\//, '')}
                      controls
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                )}
              </Box>
            </Paper>
          )}
        </Box>
      </Box>

      {data.actions && data.actions.length > 0 && (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '150px',
            height: '100%',
            flexShrink: 0
          }}
        >
          {data.actions.map((action: any) => {
            let IconComponent = IconInfoCircle;
            if (action.icon === 'photo') IconComponent = IconPhoto;
            if (action.icon === 'text') IconComponent = IconFileText;
            if (action.icon === 'video') IconComponent = IconVideo;

            return (
              <Button
                key={action.id}
                color={action.color || 'blue'}
                variant={activeAction?.id === action.id ? 'filled' : 'light'}
                onClick={() => setActiveAction(activeAction?.id === action.id ? null : action)}
                leftSection={<IconComponent size={20} />}
                fullWidth
                radius={0}
                style={{ height: '20%' }}
              >
                {action.label}
              </Button>
            );
          })}
        </Box>
      )}
    </Flex>
  );
}
