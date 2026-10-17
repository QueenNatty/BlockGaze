import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: "The rules for using BlockGaze, including limits on data accuracy and what the site is not.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms and conditions">
      <p>By using BlockGaze you agree to these terms. If you do not agree, please do not use the site.</p>

      <h2>Information only</h2>
      <p>
        BlockGaze displays market data for information. It is not financial, investment, tax or legal advice, and
        nothing on the site is an offer or a recommendation to buy or sell any asset. Cryptocurrencies are volatile and
        you can lose money. Do your own research and speak to a qualified adviser before making decisions.
      </p>

      <h2>Data accuracy</h2>
      <p>
        Prices, market caps, volumes and charts are supplied by CoinGecko and refresh about once a minute. They can be
        delayed, incomplete or wrong, and may differ from prices on an exchange. BlockGaze is not a trading platform
        and does not execute trades.
      </p>

      <h2>Your watchlist</h2>
      <p>
        The watchlist is saved only in your browser. We cannot recover it if you clear your browser data or switch
        devices.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not send automated or high-volume requests to BlockGaze or its API routes.</li>
        <li>Do not try to disrupt the site or access it in ways other than through the pages we provide.</li>
        <li>Data shown on BlockGaze belongs to its providers. Check CoinGecko&apos;s terms before reusing it.</li>
      </ul>

      <h2>Third-party names and logos</h2>
      <p>Coin names and logos belong to their respective owners. Their use here does not imply any endorsement.</p>

      <h2>Availability and liability</h2>
      <p>
        BlockGaze is provided as is, without any warranty, and may be unavailable or change at any time. To the extent
        the law allows, we are not liable for losses that result from using the site or relying on its data.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms. The date at the top shows when they last changed.</p>
    </LegalPage>
  );
}
