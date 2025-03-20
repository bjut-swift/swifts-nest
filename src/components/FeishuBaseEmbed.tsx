import * as React from 'react';

interface FeishuBaseEmbedProps {
  baseUrl: string;
  height?: string | number;
  width?: string | number;
}

const FeishuBaseEmbed: React.FC<FeishuBaseEmbedProps> = ({
  baseUrl,
  height = '600px',
  width = '100%',
}) => {
  return (
    <iframe
      src={baseUrl}
      width={width}
      height={height}
      frameBorder='0'
      allowFullScreen
    />
  );
};

export default FeishuBaseEmbed;
