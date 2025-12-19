import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="min-h-screen container mx-auto px-4 py-28">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-extrabold text-white mb-8">Privacy Policy</h1>
                <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-4">
                    <p>Your privacy is important to us. It is AutoGenesis's policy to respect your privacy regarding any information we may collect from you across our website.</p>
                    <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
                    
                    <h2 className="text-3xl font-bold text-white">Information We Collect</h2>
                    <p>
                        **Log data:** When you visit our website, our servers may automatically log the standard data provided by your web browser. This may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.
                    </p>
                    <p>
                        **Personal Information:** We may ask for personal information, such as your:
                    </p>
                    <ul className="list-disc pl-5">
                        <li>Name</li>
                        <li>Email</li>
                        <li>Profession</li>
                        <li>Payment information (if you subscribe to a paid plan)</li>
                    </ul>

                    <h2 className="text-3xl font-bold text-white">Security of Your Information</h2>
                    <p>We take security seriously. All data, including your generated projects and chat history, is stored securely in our MongoDB Atlas database and is only accessible by you via your authenticated account. We use `bcrypt` for password hashing, and SSL encryption for all data in transit.</p>
                    
                    <h2 className="text-3xl font-bold text-white">Links to Other Sites</h2>
                    <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;