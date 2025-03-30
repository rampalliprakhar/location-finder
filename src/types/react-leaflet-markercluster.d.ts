declare module '@changey/react-leaflet-markercluster' {
    import { LayerGroupProps } from 'react-leaflet';
    
    interface MarkerClusterGroupProps extends LayerGroupProps {
      chunkedLoading?: boolean;
      spiderfyOnMaxZoom?: boolean;
      showCoverageOnHover?: boolean;
      zoomToBoundsOnClick?: boolean;
      removeOutsideVisibleBounds?: boolean;
      animate?: boolean;
    }
  
    const MarkerClusterGroup: React.FC<MarkerClusterGroupProps>;
    export default MarkerClusterGroup;
}