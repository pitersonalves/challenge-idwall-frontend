
import React from 'react';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const Documentation = () => {

  const PDF = require("../assets/challenge.pdf");
  return (
    <embed
      src={PDF}
      type="application/pdf"
      height={800}
      width={500}
    />
  );
};

export default Documentation;
