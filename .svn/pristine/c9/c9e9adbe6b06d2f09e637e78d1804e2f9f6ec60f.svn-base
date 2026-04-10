import React from 'react';
import messages from './messages_en.json'; // relative import from 'components' folder'

const Footer = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div style={{ textAlign: 'center', padding: '10px', fontSize: '14px', color: '#888' }}>
      {messages['reportFooterMessage']}
      <br />
      Generated on: {formattedDate}
    </div>
  );
};

export default Footer;
