"use client";

import Field from "@/components/dashboard/Field";
import SectionSetting from "@/components/dashboard/settings/SectionSetting";
import Toggle from "@/components/dashboard/Toggle";
import DeleteStoreBtn from "./DeleteStoreBtn";
import Save from "./Save";


export default function SettingsContent() {
  return (
    <div className="max-w-2xl space-y-6">

      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="mt-0.5 text-sm text-white/40">Manage your store and account preferences.</p>
      </div>

      {/* Store */}
      <SectionSetting title="Store details">
        <Field label="Store name" defaultValue="Jane's Store" type={"text"} />
        <Field label="Store URL" defaultValue="linkstore.io/janekim" hint="This is the link your customers see." type={"text"} />
        <Field label="Support email" defaultValue="jane@example.com" type="email" />
      </SectionSetting>

      {/* Notifications */}
      <SectionSetting title="Notifications">
        <div className="divide-y divide-white/5">
          <Toggle label="New order" desc="Get an email when someone buys." defaultOn />
          <Toggle label="Low stock alerts" desc="We'll notify you when a product's stock is low." defaultOn={false} />
          <Toggle label="Weekly summary" desc="A recap of your store's performance every Monday." defaultOn />
        </div>
      </SectionSetting>

      {/* Payouts */}
      <SectionSetting title="Payouts">
        <Field label="Stripe account" defaultValue="acct_1Pz••••••••" hint="Connected via Stripe. Payouts land in 2 business days." type={"text"} />
        <Field label="Payout currency" defaultValue="USD" type={"text"} />
      </SectionSetting>

      {/* Danger zone */}
     <DeleteStoreBtn />

      {/* Save */}
     <Save />

    </div>
  );
}