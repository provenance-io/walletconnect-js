import {
  FIGURE_GAS_PRICE,
  FIGURE_GAS_PRICE_DENOM,
  FIGUTE_GAS_PRICE_API_URL,
} from 'consts';
import { useEffect, useState } from 'react';
import { Input } from '../Input';

interface GasData {
  gasPrice: string;
  gasPriceDenom: string;
}

interface Props {
  setGasData: (data: GasData) => void;
  gasData: GasData;
}

export const ActionGas: React.FC<Props> = ({ setGasData, gasData }) => {
  const [figureGasPrice, setFigureGasPrice] = useState(`${FIGURE_GAS_PRICE}`);
  const [initialLoad, setInitialLoad] = useState(true);
  const [figureGasPriceDenom, setFigureGasPriceDenom] = useState(
    FIGURE_GAS_PRICE_DENOM
  );

  const customGasPrice = gasData.gasPrice;
  const customGasPriceDenom = gasData.gasPriceDenom;

  const updateGasData = (field: keyof GasData, value: string) => {
    const gasPrice = field === 'gasPrice' ? value : gasData.gasPrice;
    const gasPriceDenom = field === 'gasPriceDenom' ? value : gasData.gasPriceDenom;
    const newGasData = { gasPrice, gasPriceDenom };
    setGasData(newGasData);
  };

  // On load, fetch default figure values (incase they change from saved const figure gas values)
  useEffect(() => {
    const asyncGasLookup = async () => {
      await fetch(FIGUTE_GAS_PRICE_API_URL)
        .then(async (response) => {
          const data = await response.json();
          setFigureGasPrice(data.gasPrice);
          setFigureGasPriceDenom(data.gasPriceDenom);
          // Set initial values to be figure price
          setGasData(data);
        })
        .catch(() => {
          // Reset values to default on error
          setFigureGasPrice(`${FIGURE_GAS_PRICE}`);
          setFigureGasPriceDenom(FIGURE_GAS_PRICE_DENOM);
          // Set initial values to be figure price
          setGasData({
            gasPrice: `${FIGURE_GAS_PRICE}`,
            gasPriceDenom: FIGURE_GAS_PRICE_DENOM,
          });
        });
    };
    if (initialLoad) {
      setInitialLoad(false);
      asyncGasLookup();
    }
  }, [initialLoad, setGasData]);

  // Gas price will default to Figure gas price when
  return (
    <>
      <Input
        key="gasPrice"
        width="48%"
        value={`${customGasPrice || ''}`}
        label={`Gas Price (${
          Number(customGasPrice) === Number(figureGasPrice) ||
          `${customGasPrice}` === ''
            ? 'Figure Gas Price'
            : 'Custom Gas Price'
        })`}
        placeholder={`Gas Price (Will default to ${figureGasPrice})`}
        onChange={(value) => updateGasData('gasPrice', value)}
        bottomGap
      />
      <Input
        key="gasPriceDenom"
        width="48%"
        value={customGasPriceDenom || ''}
        label={`Gas Denom (${
          customGasPriceDenom === figureGasPriceDenom || customGasPriceDenom === ''
            ? 'Figure Gas Denom'
            : 'Custom Gas Denom'
        })`}
        placeholder={`Gas Denom (Will default to ${figureGasPriceDenom})`}
        onChange={(value) => updateGasData('gasPriceDenom', value)}
        bottomGap
      />
    </>
  );
};
