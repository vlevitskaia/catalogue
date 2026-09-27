import { useEffect, useState } from 'react';
import { AppShell, Burger, Group, Title, Box, Text, Paper, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import TreeCanvas from './components/TreeCanvas';
import ContentRenderer from './components/ContentRenderer';

export default function App() {
  const [opened, { toggle }] = useDisclosure(true);
  const [navWidth, setNavWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 800) {
        setNavWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (!selectedFile) return;

    setError(false);
    setFileData(null);

    const baseUrl = import.meta.env.BASE_URL.endsWith('/') 
      ? import.meta.env.BASE_URL 
      : `${import.meta.env.BASE_URL}/`;
      
    const fetchUrl = `${baseUrl}structure/${selectedFile}`;

    fetch(fetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setFileData(data))
      .catch(() => setError(true));
  }, [selectedFile]);

  return (
    <AppShell header={{ height: 60 }} padding={0}>
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
          <Title order={3}>Katalog</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Flex h="calc(100vh - 60px)">
          {opened && (
            <Box
              w={navWidth}
              style={{
                position: 'relative',
                borderRight: '1px solid #dee2e6',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0
              }}
              p="xs"
            >
              <Title order={6} mb="xs" c="dimmed">STRUKTURA SLOŽEK</Title>
              
              <TreeCanvas onNodeClick={setSelectedFile} />
              
              <div
                onMouseDown={() => setIsResizing(true)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '6px',
                  height: '100%',
                  cursor: 'col-resize',
                  backgroundColor: isResizing ? '#228be6' : 'transparent',
                  zIndex: 110,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
                onMouseLeave={(e) => {
                  if (!isResizing) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              />
            </Box>
          )}

          <Box style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }} p="md">
            {error ? (
              <Title order={2} c="red">Nepodařilo se načíst nebo zpracovat soubor.</Title>
            ) : fileData ? (
              <Paper 
                shadow="xs" 
                p="xl" 
                withBorder 
                style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              >
                <ContentRenderer data={fileData} />
              </Paper>
            ) : (
              <Box style={{ flex: 1 }}>
                <Title order={1}>Vítej v aplikaci!</Title>
                <Text c="dimmed" mt="sm">Vyber soubor ve stromové struktuře vlevo pro zobrazení obsahu.</Text>
              </Box>
            )}
          </Box>
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
}
