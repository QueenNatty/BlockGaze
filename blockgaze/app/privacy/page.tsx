import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What BlockGaze stores in your browser, what our servers see, and which third parties supply data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        BlockGaze shows cryptocurrency prices and charts. It has no accounts, no sign-up, no forms and no
        advertising, and it does not use analytics or tracking tools. This page explains what that means in practice.
      </p>

      <h2>What is stored in your browser</h2>
      <p>
        When you star a coin, its identifier (for example &ldquo;bitcoin&rdquo;) is saved in your browser&apos;s local
        storage so the watchlist is still there next time. This list is never sent to our servers. You can remove
        coins from the watchlist at any time, or clear this site&apos;s data in your browser settings to delete it.
      </p>
      <p>BlockGaze does not set cookies.</p>

      <h2>What our servers handle</h2>
      <ul>
        <li>
          Your browser requests pages, coin data and chart data from BlockGaze. Like most web servers, our hosting
          provider may log technical details of each request, such as IP address, user agent and the address
          requested, for security and troubleshooting.
        </li>
        <li>
          Coin logos are served through our own image optimizer, so your browser does not contact image hosts directly.
        </li>
      </ul>

      <h2>Third parties</h2>
      <p>
        Market data comes from the{" "}
        <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">
          CoinGecko
        </a>{" "}
        API. Our server requests this data on your behalf, so your browser does not talk to CoinGecko and CoinGecko
        does not receive your IP address from us. If you follow the link to a coin&apos;s official website, that site
        has its own privacy practices.
      </p>

      <h2>Changes</h2>
      <p>
        If BlockGaze starts using analytics, accounts or anything else that changes the above, this page will be
        updated first and the date at the top will change.
      </p>
    </LegalPage>
  );
}
