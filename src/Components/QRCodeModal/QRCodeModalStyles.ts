import styled from 'styled-components';

export const QRCodeModalContainer = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: #444444;
  z-index: 1000;
`;
export const QRModalContent = styled.div`
  width: 400px;
  transition: 1s all;
  position: relative;
  border-radius: 10px;
  background: #eeeeee;
  padding: 40px;
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.25);
`;
export const CloseQRModal = styled.div`
  background: #ffffff;
  height: 24px;
  width: 24px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Toggle = styled.div`
  padding: 4px;
  border-radius: 5px;
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #dddddd;
  margin-bottom: 20px;
`;
export const ToggleNotch = styled.div<{ active?: boolean }>`
  color: #5588dd;
  transition: 500ms all;
  padding: 4px 10px;
  font-weight: 700;
  ${({ active }) => active && 'background: #FFFFFF;'}
  flex-basis: 50%;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  user-select: none;
`;
export const Text = styled.p<{ link?: boolean }>`
  font-size: 1.5rem;
  margin: 0;
  ${({ link }) =>
    link &&
    `
    color: #5588DD;
    cursor: pointer;
  `}
`;
export const CopyButton = styled.button`
  font-size: 10px;
  margin: 0 28px 18px auto;
`;
export const ImgContainer = styled.div`
  flex-basis: 100%;
  margin-top: 10px;
`;
export const WalletRow = styled.a`
  display: flex;
  align-items: center;
  margin-top: 10px;
  flex-basis: 100%;
  color: #333333;
  border-radius: 4px;
  padding: 10px 18px;
  transition: 500ms all;
  text-align: left;
  &:hover {
    background: #ffffff;
  }
`;
export const WalletRowNonLink = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  flex-basis: 100%;
  color: #333333;
  border-radius: 4px;
  padding: 10px 18px;
  transition: 500ms all;
  text-align: left;
  cursor: pointer;
  input {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #aaaaaa;
    color: #444444;
  }
  &:hover {
    background: #ffffff;
  }
`;
export const WalletTitle = styled.div<{ custom?: boolean }>`
  font-weight: 900;
  font-size: 2rem;
  color: ${({ custom }) => (custom ? '#4889fa' : '#333333')};
  user-select: none;
`;
export const WalletIcon = styled.img`
  background: #ffffff;
  border-radius: 4px;
  height: 30px;
  width: 30px;
  margin-right: 20px;
  padding: 4px;
`;
export const AppStoreIcons = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
`;
export const AppIcon = styled.a`
  margin: 0 6px;
`;
export const ReloadNotice = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #eeeeee;
  padding: 60px 40px 40px 40px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  ${Text} {
    margin-bottom: 34px;
  }
  button {
    margin-top: 6px;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 8px;
    border: 1px solid #aaaaaa;
    background: white;
  }
`;
