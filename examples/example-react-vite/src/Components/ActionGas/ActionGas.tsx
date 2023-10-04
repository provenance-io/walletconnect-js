import {
  FIGURE_GAS_PRICE,
  FIGURE_GAS_PRICE_DENOM,
  FIGUTE_GAS_PRICE_API_URL,
} from 'consts';
import { useEffect, useState } from 'react';

interface GasData {
  amount: string;
  denom: string;
}

interface Props {
  setGasData: (data: GasData) => void;
  gasData: GasData;
}

export const ActionGas: React.FC<Props> = ({ setGasData, gasData }) => {
  const [amount, setAmount] = useState(`${FIGURE_GAS_PRICE}`);
  const [initialLoad, setInitialLoad] = useState(true);
  const [denom, setDenom] = useState(FIGURE_GAS_PRICE_DENOM);

  const customGasPrice = gasData.amount;
  const customGasPriceDenom = gasData.denom;

  const updateGasData = (field: keyof GasData, value: string) => {
    const newAmount = field === 'amount' ? value : gasData.amount;
    const newDenom = field === 'denom' ? value : gasData.denom;
    const newGasData = { amount: newAmount, denom: newDenom };
    setGasData(newGasData);
  };

  // On load, fetch default figure values (incase they change from saved const figure gas values)
  useEffect(() => {
    const asyncGasLookup = async () => {
      await fetch(FIGUTE_GAS_PRICE_API_URL)
        .then(async (response) => {
          const data = await response.json();
          setAmount(data.amount);
          setDenom(data.denom);
          // Set initial values to be figure price
          setGasData(data);
        })
        .catch(() => {
          // Reset values to default on error
          setAmount(`${FIGURE_GAS_PRICE}`);
          setDenom(FIGURE_GAS_PRICE_DENOM);
          // Set initial values to be figure price
          setGasData({
            amount: `${FIGURE_GAS_PRICE}`,
            denom: FIGURE_GAS_PRICE_DENOM,
          });
        });
    };
    if (initialLoad) {
      setInitialLoad(false);
      asyncGasLookup();
    }
  }, [initialLoad, setGasData]);

  // Gas price will default to Figure gas price when
  return <></>;
};
