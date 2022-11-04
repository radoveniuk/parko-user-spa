import React, { useId } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { Accordion as AccordionMaterial, AccordionDetails, AccordionProps, AccordionSummary } from '@mui/material';
import styled from 'styled-components';

const Accordion = ({ children, title, id, ...rest }: AccordionProps) => {
  const fakeId = useId();
  return (
    <AccordionMaterial className="accordion" {...rest}>
      <AccordionSummary expandIcon={<MdExpandMore />} id={id || fakeId}>
        {title}
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </AccordionMaterial>
  );
};

export default Accordion;

export const AccordionContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
