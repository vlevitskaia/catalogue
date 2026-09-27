import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import structureData from '../structure.json';
import parseTree from '../utils/parseTree';

interface TreeCanvasProps {
  onNodeClick: (id: string, type: 'file' | 'directory') => void;
}

export default function TreeCanvas({ onNodeClick }: TreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);

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
            'color': '#1c7ed6',
            'font-size': '13px',
            'font-weight': 'normal',
            'text-valign': 'center',
            'text-halign': 'center',
            'background-opacity': 1,
            'shape': 'rectangle',
            'width': 'label' as any,
            'height': 'label' as any,
            'padding': '15px',
            'text-wrap': 'wrap',
            'text-max-width': '150px' as any
          }
        },
        {
          selector: 'node[type = "directory"]',
          style: {
            'background-color': '#d0ebff'
          }
        },
        {
          selector: 'node[type = "directory"][!hasInit]',
          style: {
            'events': 'no'
          }
        },
        {
          selector: 'node[type = "file"]',
          style: {
            'background-color': '#f1f3f5',
            'color': '#495057'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ced4da',
            'target-arrow-color': '#ced4da',
            'target-arrow-shape': 'triangle',
            'curve-style': 'straight',
            'events': 'no'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 20,
        spacingFactor: 0.85,
        nodeDimensionsIncludeLabels: true,
        avoidOverlap: true
      }
    });

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      onNodeClick(node.id(), node.data('type'));
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
  }, [onNodeClick]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: 'calc(100vh - 100px)', backgroundColor: '#f8f9fa', borderRadius: '8px' }} 
    />
  );
}
