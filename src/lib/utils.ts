import { type ClassValue, clsx } from "clsx";
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge";
import { getNativeToken } from "./lifi";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTotalAmountUSD(feeCosts: any) {
  let totalAmountUSD = 0;
  feeCosts?.forEach((fee: any) => {
    const amount = parseFloat(fee.amountUSD);
    if (!isNaN(amount)) {
      totalAmountUSD += amount;
    } else {
      console.error("Invalid amountUSD value:", fee.amountUSD);
    }
  });
  return totalAmountUSD;
}

export const calculateTotalfeeCosts = (route: {
  steps: Array<{ estimate?: { feeCosts?: Array<{ amount: string }> } }>;
}): string => {
  let totalGasCost = ethers.getBigInt(0);

  route?.steps?.forEach((step) => {
    if (step.estimate && step.estimate.feeCosts) {
      step.estimate.feeCosts.forEach((gasCost) => {
        if (gasCost.amount) {
          totalGasCost += ethers.getBigInt(gasCost.amount);
        }
      });
    }
  });

  return ethers.formatUnits(totalGasCost, 18);
};

export const calculateTotalGasCost = (route: {
  steps: Array<{ estimate?: { gasCosts?: Array<{ amount: string }> } }>;
}): string => {
  let totalGasCost = ethers.getBigInt(0);

  route?.steps?.forEach((step) => {
    if (step.estimate && step.estimate?.gasCosts) {
      step.estimate?.gasCosts.forEach((gasCost) => {
        if (gasCost.amount) {
          totalGasCost += ethers.getBigInt(gasCost.amount);
        }
      });
    }
  });

  return ethers.formatUnits(totalGasCost, 18);
};

// export const calculateTotalCosts = (route: {
//   steps: Array<{ estimate?: { feeCosts?: Array<{ amount: string }>, gasCosts?: Array<{ amount: string }> } }>;
// }): string => {
//   const totalFeeCost = Number(calculateTotalfeeCosts(route));
//   const totalGasCost = Number(calculateTotalGasCost(route));
  
//   const totalCost = totalFeeCost + totalGasCost;

//   return ethers.formatUnits(totalCost, 18);
// };
export const calculateGasCosts = (route : any , sourceChainId  : any, destinationChainId : any) => {
  let totalSourceGasCost = ethers.getBigInt(0);
  let totalDestinationGasCost = ethers.getBigInt(0);
  let FromDecimals = 18
  let toDecimals = 18 
  route.steps.forEach((step:any) => {
    if (step.estimate && step.estimate.gasCosts) {
      step.estimate.gasCosts.forEach((gasCost:any) => {
        if (gasCost.amount) {
          const amount = ethers.toBigInt(gasCost.amount);
          if (step.action.fromChainId === sourceChainId) {
            FromDecimals = gasCost.token.decimals
            totalSourceGasCost += amount;
          } else if (step.action.fromChainId === destinationChainId) {
            toDecimals = gasCost.token.decimals
            totalDestinationGasCost += amount;
          }
        }
      });
    }
  });
 
  return {
    totalSourceGasCost: ethers.formatUnits(totalSourceGasCost, FromDecimals),
    totalDestinationGasCost: ethers.formatUnits(totalDestinationGasCost, toDecimals),
  };
};

export function formatValue(value: any, decimals: any) {
  return ethers.formatUnits(value, decimals);
}

export function getShortWords(input: string) {
  return input?.substring(0, 7);
}
