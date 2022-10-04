import React, { ReactNode, useEffect, useRef } from 'react';
import { Link, To } from 'react-router-dom';

import { StyledMenuButton } from './styles';

type Props = {
  children: ReactNode;
  to: To;
}

const MainMenuLink = ({ children, to }: Props) => {
  const linkRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const card = linkRef.current;
    if (!card) return;

    let bounds: any = {};
    function rotateToMouse (e: any) {
      if (!card) return;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2,
      };
      const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

      card.style.transform = `
      scale3d(1.07, 1.07, 1.07)
      rotate3d(
        ${center.y / 100},
        ${-center.x / 100},
        0,
        ${Math.log(distance) * 2}deg
      )
    `;
    }

    const onMouseEnter = () => {
      bounds = card.getBoundingClientRect();
      document.addEventListener('mousemove', rotateToMouse);
    };

    const onMouseLeave = () => {
      document.removeEventListener('mousemove', rotateToMouse);
      card.style.transform = '';
      card.style.background = '';
    };

    card.addEventListener('mouseenter', onMouseEnter);

    card.addEventListener('mouseleave', onMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', onMouseEnter);
      card.removeEventListener('mouseenter', onMouseLeave);
    };
  }, []);

  return (
    <Link to={to}>
      <StyledMenuButton ref={linkRef}>
        {children}
      </StyledMenuButton>
    </Link>
  );
};

export default MainMenuLink;
