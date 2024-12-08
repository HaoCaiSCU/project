import React from 'react';

interface RenderHtmlStringProps {
  htmlString: string;
}

const RenderHtmlString: React.FC<RenderHtmlStringProps> = ({ htmlString }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlString }} />
  );
};

export default RenderHtmlString;