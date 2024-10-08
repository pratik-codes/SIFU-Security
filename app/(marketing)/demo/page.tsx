"use client";

import React from 'react';

import SolanaPool from './components/solana-pool';

const DemoPage = () => {
  const vulenrablePoolData = {
    mainTitle: "Solana Vulnerable Pool",
    mainDescription: "This pool is not secured by SIFU",
    contractAddress: "24ysSjyaAdFYTCN9WabADrVkipaTCvv97xvuLSC2y7Bk",
    poolType: "vulnerable",
  }

  const sifuSecuredPoolData = {
    mainTitle: "Solana Vulnerable SIFU Secured Pool",
    mainDescription: "This pool is secured by SIFU",
    contractAddress: "DE8mBCGgZi8aFHfXvdsjWUFWb8MJnZv8SFxvA8xzUVpt",
    poolType: "sifu",
  }

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <SolanaPool {...vulenrablePoolData} />
      <SolanaPool {...sifuSecuredPoolData} />
    </div>
  )
}

export default DemoPage
