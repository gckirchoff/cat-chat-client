import React from 'react';
import { Popup } from 'semantic-ui-react';

const PopupWrapper = ({ content, children }) => {
  return <Popup inverted content={content} trigger={children} />;
};

export default PopupWrapper;
