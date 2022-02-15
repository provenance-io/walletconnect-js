import { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import REPORTS_ICON from 'img/reportsIcon.svg';

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


export const CopyValue = ({ value, title }) => {
  const [justCopied, setJustCopied] = useState(false);
  const [timeoutInstance, setTimeoutInstance] = useState(null);

  // Kill any times when unmounted (prevent memory leaks w/running timers)
  useEffect(() => () => { if (timeoutInstance) { clearTimeout(timeoutInstance); } },
    [timeoutInstance]
  );

  const handleCopyClick = () => {
    setJustCopied(false);
    clearTimeout(timeoutInstance);
    navigator.clipboard.writeText(value).then(() => {
      clearTimeout(timeoutInstance);
      setJustCopied(true);
      const newTimeoutInstance = setTimeout(() => {
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

CopyValue.propTypes = {
  value: PropTypes.node,
  title: PropTypes.string,
};
CopyValue.defaultProps = {
  title: 'Copy Text',
  value: '',
};
