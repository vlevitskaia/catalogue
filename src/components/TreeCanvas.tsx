import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import structureData from '../structure.json';
import parseTree from '../utils/parseTree';

interface TreeCanvasProps {
  onNodeClick: (id: string, type: 'file' | 'directory') => void;
  selectedNodeId?: string;
}

export default function TreeCanvas({ onNodeClick, selectedNodeId }: TreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);
  const onNodeClickRef = useRef(onNodeClick);

  useEffect(() => {
    onNodeClickRef.current = onNodeClick;
  }, [onNodeClick]);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = parseTree(structureData);

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      boxSelectionEnabled: false,
      autoungrabify: true,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'font-size': '13px',
            'font-weight': 'bold',
            'text-valign': 'center',
            'text-halign': 'center',
            'shape': 'rectangle',
            'width': 'label' as any,
            'height': 'label' as any,
            'padding': '12px',
            'text-wrap': 'wrap',
            'text-max-width': '150px' as any
          }
        },
        {
          selector: 'node[type = "directory"][!hasInit]',
          style: {
            'background-color': '#f8f9fa',
            'color': '#adb5bd',
            'border-width': 2,
            'border-color': '#dee2e6',
            'border-style': 'dashed',
            'events': 'no'
          }
        },
        {
          selector: 'node[type = "directory"][?hasInit]',
          style: {
            'background-color': '#339af0',
            'color': '#ffffff',
            'border-width': 0
          }
        },
        {
          selector: 'node[type = "file"]',
          style: {
            'background-color': '#e7f5ff',
            'color': '#1864ab',
            'border-width': 1,
            'border-color': '#a5d8ff'
          }
        },
        {
          selector: '.selected',
          style: {
            'border-width': 3,
            'border-color': '#ff922b',
            'border-style': 'solid'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ced4da',
            'target-arrow-color': '#ced4da',
            'target-arrow-shape': 'triangle',
            'curve-style': 'taxi',
            'taxi-direction': 'horizontal',
            'taxi-turn': '20px' as any,
            'events': 'no'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 20,
        spacingFactor: 1.1,
        nodeDimensionsIncludeLabels: true,
        avoidOverlap: true,
        transform: (_, position) => {
          return { x: position.y, y: position.x };
        }
      }
    });

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      onNodeClickRef.current(node.id(), node.data('type'));
    });

    cyRef.current = cy;

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cy.resize();
        cy.fit(undefined, 20);
      }, 50);
    });
    
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
      cy.destroy();
    };
  }, []);

  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    
    cy.elements().removeClass('selected');
    
    if (selectedNodeId) {
      const node = cy.getElementById(selectedNodeId);
      if (node.length > 0) {
        node.addClass('selected');
      }
    }
  }, [selectedNodeId]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: 'calc(100vh - 100px)', backgroundColor: '#f8f9fa', borderRadius: '8px' }} 
    />
  );
}
