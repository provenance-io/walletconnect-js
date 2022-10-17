import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { COLORS } from 'theme';
import { Sprite } from '../Sprite/Sprite';
import { ICON_NAMES } from 'consts';

const CopyButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 4px;
`;
const CopiedNotice = styled.div`
  background: ${COLORS.PRIMARY_500};
  color: ${COLORS.WHITE};
  position: absolute;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
  bottom: -50px;
  right: -8px;
  min-width: 55px;
  z-index: 100;
`;

interface Props {
  value: string;
  title?: string;
}

export const CopyValue: React.FC<Props> = ({ value, title = 'Copy Text' }) => {
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
      <Sprite icon={ICON_NAMES.COPY} size="0.9rem" />
      {justCopied && <CopiedNotice>Copied!</CopiedNotice>}
    </CopyButton>
  );
};
