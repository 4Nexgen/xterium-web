import Image from "next/image";

interface Step {
  number: number;
  image: string;
  title: string;
  description: string;
}

const steps: Step[] = [
    {
        number: 1,
        image: '/creating_new_wallet/addextension.png',
        title: 'Install Xterium Extension',
        description: 'Open your web browser and search for "Google Extensions". In the search bar, type "Xterium" to go to the installation page. Click the "Add to Chrome" button to proceed. A prompt will appear asking if you want to add Xterium to your extensions. Click the "Add Extension" button to confirm. Xterium will automatically be added to your list of extensions.',
      },
      {
        number: 2,
        image: '/creating_new_wallet/setuppassword.png',
        title: 'Set Up Password',
        description: 'Open your Xterium Wallet Extension and set up a password for it. The password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number. Once done, click the "SETUP PASSWORD" button. You will then be directed to the balance section of the Xterium Wallet.',
      },
      {
        number: 3,
        image: '/creating_new_wallet/addwallet.png',
        title: 'Add Wallet',
        description: 'To add a wallet to your extension, click the sidebar button located in the upper left corner. Then, select "Wallets". Click the "Add Wallet" button.',
      },
      {
        number: 4,
        image: '/creating_new_wallet/generatemnemonic.png',
        title: 'Generate Mnemonic Phrase',
        description: 'Provide a unique name for your wallet. To generate a mnemonic phrase, secret key, and public key, click the "Generate Mnemonic Phrase" button. Once the mnemonic phrase is generated, make sure to write it down and store it securely, as you won’t be able to recover your account if it’s lost. Then, click the "Save" button to proceed. You can now view your added wallet and make transactions on the wallet page of the Xterium Wallet Extension.|',
      },
];

export default function WalletCreationSteps() {
  return (
    <div>
      {/* Mobile View */}
      <section className="flex flex-wrap py-16 text-white block sm:hidden">
        <div className="container mx-auto">
          <h1 className="text-[3em] leading-none font-bold mb-6 text-theme-default text-center">
            Creating a New Wallet
          </h1>
          <div className="flex flex-wrap justify-center items-start gap-6 sm:gap-12">
            {steps.map(({ number, image, title, description }, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-start gap-4 w-full sm:w-[250px] md:w-[300px]"
              >
                <div className="w-full h-[350px] mt-8 flex justify-center items-center">
                  <Image
                    src={image}
                    alt={title}
                    width={300}
                    height={350}
                    className="object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-8 h-8 mt-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-teal-500 text-white font-bold mt-4">
                  {number}
                </div>
                <h4 className="text-white font-bold text-xl mt-4 text-center">
                  {title}
                </h4>
                <p className="flex-shrink-0 max-w-xs text-sm text-justify opacity-80 mt-2">
                  {description.split('"').map((part, i) =>
                    i % 2 === 0 ? (
                      part
                    ) : (
                      <span key={i} className="text-theme-default font-bold">
                        {part}
                      </span>
                    )
                  )}
                  {description.includes("|") && (
                    <span className="text-yellow-500 font-bold">
                      <br />
                      <br />
                      Note: Store your mnemonic phrase securely. If lost, it
                      cannot be recovered.
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop View */}
      <section className="flex flex-nowrap py-16 px-16 text-white items-center min-h-screen sm:flex hidden">
        <div className="container mx-auto">
            <h1 className="text-[4em] leading-none font-bold mb-6 text-theme-default text-center">
            Creating a New Wallet
            </h1>
            <div className="flex flex-nowrap w-full grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-8 mt-16 justify-items-center">
            {steps.map(({ image, title }, index) => (
              <Image
                key={index}
                src={image}
                alt={title}
                width={300}
                height={350}
                className="object-contain"
              />
            ))}
          </div>
          <div className="flex flex-nowrap justify-center items-center overflow-hidden mt-8">
            <div className="w-full grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 justify-items-center gap-8 mt-8">
              {steps.map(({ number }, index) => (
                <div key={index} className="relative flex items-center justify-center sm:px-0 md:px-1 md:px-2 lg:px-3 xl:px-4">
                  <div className="flex items-center justify-center md:w-8 md:h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-teal-500 text-white font-bold z-10">
                    {number}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                    className={`
                      absolute top-1/2 transform -translate-y-1/2 h-[10px] bg-teal-500
                      w-[390%] sm:w-[470%] md:w-[390%] lg:w-[350%] xl:w-[390%] 2xl:w-[470%]
                    `}
                    style={{ left: '50%' }}
                  ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-nowrap w-full grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 justify-items-center gap-8 sm:gap-8 mt-8">
            {steps.map(({ title, description }, index) => (
              <div key={index} className="flex flex-col items-center justify-start gap-4 w-full ">
                <h4 className="text-white font-bold text-xl mt-2 text-center">{title}</h4>
                <p className="flex-shrink-0 max-w-xs text-sm text-justify opacity-80 mt-4 p-2">
                  {description.split('"').map((part, i) =>
                    i % 2 === 0 ? (
                        part
                    ) : (
                        <span key={i} className="text-theme-default font-bold">
                        {part}
                        </span>
                    )
                    )}
                    {description.includes("|") && (
                    <span className="text-yellow-500 font-bold">
                        <br />
                        <br />
                        Note: Store your mnemonic phrase securely. If lost, it cannot
                        be recovered.
                    </span>
                    )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
