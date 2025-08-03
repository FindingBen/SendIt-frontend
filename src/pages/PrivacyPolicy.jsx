import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col mx-5 p-6 text-gray-800 leading-relaxed">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-2">Last updated: November 23, 2024</p>

      <p>
        This Privacy Policy describes our policies and procedures on the
        collection, use, and disclosure of your information when you use our
        service and explains your privacy rights and how the law protects you.
      </p>
      <p className="mt-4">
        We use your personal data to provide and improve the service. By using
        the service, you agree to the collection and use of information in
        accordance with this Privacy Policy.
      </p>

      {/* Interpretation and Definitions */}
      <section className="mt-6">
        <h2 className="text-3xl font-semibold mb-2">
          Interpretation and Definitions
        </h2>

        <h3 className="text-2xl font-medium mt-4 mb-2">Interpretation</h3>
        <p>
          Words with initial capital letters have defined meanings under the
          following conditions. These definitions apply whether they appear in
          singular or plural form.
        </p>

        <h3 className="text-2xl font-medium mt-4 mb-2">Definitions</h3>
        <p className="mb-2 font-semibold">
          For the purposes of this Privacy Policy:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Account:</strong> A unique account created for you to access
            our service.
          </li>
          <li>
            <strong>Affiliate:</strong> An entity that controls or is controlled
            by us, where "control" means ownership of 50% or more of voting
            shares.
          </li>
          <li>
            <strong>Application:</strong> Refers to Sendperplane, the software
            provided by the Company.
          </li>
          <li>
            <strong>Company:</strong> (referred to as "We", "Us", or "Our")
            refers to Sendperplane.
          </li>
          <li>
            <strong>Country:</strong> Refers to Denmark.
          </li>
          <li>
            <strong>Device:</strong> Any device that can access the service,
            such as a computer, cellphone, or tablet.
          </li>
          <li>
            <strong>Personal Data:</strong> Any information relating to an
            identified or identifiable individual.
          </li>
          <li>
            <strong>Service:</strong> Refers to the Application.
          </li>
          <li>
            <strong>Service Provider:</strong> A third-party entity that
            processes data on behalf of the Company.
          </li>
          <li>
            <strong>Usage Data:</strong> Data collected automatically, such as
            the duration of a page visit.
          </li>
          <li>
            <strong>You:</strong> The individual accessing or using the service.
          </li>
        </ul>
      </section>

      {/* Data Collection */}
      <section className="mt-6">
        <h2 className="text-3xl font-semibold mb-2">
          Collecting and Using Your Personal Data
        </h2>

        <h3 className="text-2xl font-medium mt-4 mb-2">
          Types of Data Collected
        </h3>
        <h4 className="text-xl font-medium mb-2">Personal Data</h4>
        <p>
          We may ask you to provide certain personally identifiable information
          to contact or identify you, including but not limited to:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Usage Data</li>
        </ul>

        <h4 className="text-xl font-medium mt-4 mb-2">Usage Data</h4>
        <p>
          Usage Data is collected automatically and may include information such
          as your IP address, browser type, the pages you visit, and the time
          spent on those pages.
        </p>
      </section>

      {/* Usage of Data */}
      <section className="mt-6">
        <h3 className="text-2xl font-medium mb-2">Use of Your Personal Data</h3>
        <p>The Company may use Personal Data for various purposes:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>To provide and maintain our Service</strong>, including
            monitoring usage.
          </li>
          <li>
            <strong>To manage your Account</strong>, giving you access to
            various functionalities.
          </li>
          <li>
            <strong>For contract performance</strong>, such as purchases or
            services.
          </li>
          <li>
            <strong>To contact you</strong> via email, phone, or other means.
          </li>
          <li>
            <strong>To provide you</strong> with news and special offers.
          </li>
          <li>
            <strong>For business transfers</strong>, such as mergers or
            acquisitions.
          </li>
          <li>
            <strong>For other purposes</strong>, like data analysis and service
            improvement.
          </li>
        </ul>
      </section>

      {/* Security, Children's Privacy, and Contact */}
      <section className="mt-6">
        <h2 className="text-3xl font-semibold mb-2">
          Security and Legal Information
        </h2>
        <p>
          We take reasonable measures to protect your data but cannot guarantee
          100% security.
        </p>
        <h3 className="text-2xl font-medium mt-4 mb-2">Children's Privacy</h3>
        <p>
          Our service is not for children under 13. If you know a child has
          provided us with data, please contact us.
        </p>
        <h3 className="text-2xl font-medium mt-4 mb-2">Contact Us</h3>
        <p>
          If you have questions, contact us at:{" "}
          <a
            href="mailto:support@sendperplane.com"
            className="text-blue-600 underline"
          >
            support@sendperplane.com
          </a>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
