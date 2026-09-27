import { Title, Text, Box, Image, Flex, Button, Stack } from '@mantine/core';

interface ContentRendererProps {
  data: any;
}

export default function ContentRenderer({ data }: ContentRendererProps) {
  if (!data) return null;

  return (
    <Flex h="100%" gap="xl">
      <Box style={{ flex: 1, overflowY: 'auto' }} pr="md">
        {data.title && (
          <Title order={1} mb="xl">{data.title}</Title>
        )}
        
        {data.blocks?.map((block: any, index: number) => {
          if (block.type === 'paragraph') {
            return (
              <Text key={index} mb="md" style={{ overflowWrap: 'break-word', lineHeight: 1.6 }}>
                {block.content}
              </Text>
            );
          }
          
          if (block.type === 'image') {
            return (
              <Box key={index} mb="md">
                <Image 
                  src={import.meta.env.BASE_URL + block.src.replace(/^\//, '')} 
                  alt={block.alt || ''} 
                  radius="md" 
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
            );
          }

          return null;
        })}
      </Box>

      {data.actions && data.actions.length > 0 && (
        <Stack w={250} style={{ flexShrink: 0 }}>
          {data.actions.map((action: any) => (
            <Button 
              key={action.id} 
              color={action.color || 'blue'}
              size="md"
              fullWidth
              onClick={() => alert(`Kliknuto na akci: ${action.id}`)}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      )}
    </Flex>
  );
}
