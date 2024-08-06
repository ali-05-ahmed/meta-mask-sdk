import { type ClassValue, clsx } from "clsx";
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge";

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

export const calculateTotalGasCost = (route: {
  steps: Array<{ estimate?: { gasCosts?: Array<{ amount: string }> } }>;
}): string => {
  let totalGasCost = ethers.getBigInt(0);

  route?.steps?.forEach((step) => {
    if (step.estimate && step.estimate.gasCosts) {
      step.estimate.gasCosts.forEach((gasCost) => {
        if (gasCost.amount) {
          totalGasCost += ethers.getBigInt(gasCost.amount);
        }
      });
    }
  });

  return ethers.formatUnits(totalGasCost, 18);
};

export function formatValue(value: any, decimals: any) {
  return ethers.formatUnits(value, decimals);
}

export function getShortWords(input: string) {
  return input?.substring(0, 7);
}
