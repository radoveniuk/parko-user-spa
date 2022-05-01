import { Accordion as AccordionMaterial, AccordionDetails, AccordionProps, AccordionSummary } from '@mui/material';
import React from 'react';
import { MdExpandMore } from 'react-icons/md';

const Accordion = ({ children, title, id, ...rest }: AccordionProps) => (
  <AccordionMaterial {...rest}>
    <AccordionSummary expandIcon={<MdExpandMore />} id={id}>
      {title}
    </AccordionSummary>
    <AccordionDetails>
      {children}
    </AccordionDetails>
  </AccordionMaterial>
);

export default Accordion;
