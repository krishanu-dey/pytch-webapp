import React, { useEffect } from "react";

/** Given an HTMLElement from another source, wrap it in a DIV.  This is
 * an unwise thing to do in general because we might not control the
 * content of that HTML.  But it is OK if we do completely control the
 * given HTML. */

interface RawElementProps {
  element: HTMLElement;
}

const RawElement = ({ element }: RawElementProps) => {
  const ref: React.RefObject<HTMLDivElement> = React.createRef();

  useEffect(() => {
    ref.current!.innerHTML = "";
    ref.current!.appendChild(element);
  });

  return <div ref={ref} />;
};

export default RawElement;