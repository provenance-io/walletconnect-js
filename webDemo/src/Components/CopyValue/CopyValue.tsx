import { useState, useEffect } from "react";
import styled from "styled-components";
import REPORTS_ICON from "img/reportsIcon.svg";

const CopyButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
`;
const CopiedNotice = styled.div`
  background: rgb(57, 35, 169);
  color: white;
  position: absolute;
  padding: 8px;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: bold;
  bottom: -50px;
  left: -8px;
  min-width: 55px;
`;

interface Props {
  value: string;
  title?: string;
}

export const CopyValue: React.FC<Props> = ({ value, title = "Copy Text" }) => {
  const [justCopied, setJustCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState(0);

  // Kill any times when unmounted (prevent memory leaks w/running timers)
  useEffect(
    () => () => {
      if (timeoutInstance) {
        clearTimeout(timeoutInstance);
      }
    },
    [timeoutInstance]
  );

  const handleCopyClick = () => {
    setJustCopied(false);
    clearTimeout(timeoutInstance);
    navigator.clipboard.writeText(value).then(() => {
      clearTimeout(timeoutInstance);
      setJustCopied(true);
      const newTimeoutInstance = window.setTimeout(() => {
        setJustCopied(false);
      }, 2000);
      setTimeoutInstance(newTimeoutInstance);
    });
  };

  return (
    <CopyButton title={title} onClick={handleCopyClick}>
      <img src={REPORTS_ICON} alt={title} />
      {justCopied && <CopiedNotice>Copied!</CopiedNotice>}
    </CopyButton>
  );
};
