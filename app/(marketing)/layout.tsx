import { ReactNode } from 'react';
import Script from 'next/script';

interface MarketingLayoutProps {
  children: ReactNode;
}

const MarketingLayout = ({ children }: MarketingLayoutProps) => {
  return (
    <>
      <Script
        src="https://master-sifu-j743.vercel.app/lexicon-embed.js"
      />
      <div>
        {children}
      </div>
    </>
  );
};

export default MarketingLayout;
