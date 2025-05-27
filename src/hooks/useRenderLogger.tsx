
import { useEffect, useRef } from 'react';

export const useRenderLogger = (componentName: string, props?: any) => {
  const renderCount = useRef(0);
  const lastProps = useRef(props);
  
  renderCount.current++;
  
  useEffect(() => {
    console.log(`[RenderLogger] ${componentName} rendered ${renderCount.current} times`);
    
    if (renderCount.current > 10) {
      console.warn(`[RenderLogger] WARNING: ${componentName} has rendered ${renderCount.current} times - possible infinite loop!`);
    }
    
    if (props && JSON.stringify(props) !== JSON.stringify(lastProps.current)) {
      console.log(`[RenderLogger] ${componentName} props changed:`, props);
      lastProps.current = props;
    }
  });
  
  return renderCount.current;
};
