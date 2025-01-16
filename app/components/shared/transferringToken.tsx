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
        image: '/transferring_tokens/selectTransferDetails.png',
        title: 'Select Transfer Details',
        description:
          'On the Balance page, choose the address you want to transfer from. Select the XON Token and click the "Transfer" button.',
      },
      {
        number: 2,
        image: '/transferring_tokens/enterDetails.png',
        title: 'Enter Transfer Details',
        description:
          'Input the number of selected Tokens to transfer and enter the recipient’s address.',
      },
      {
        number: 3,
        image: '/transferring_tokens/confirmTransactions.png',
        title: 'Confirm Transaction',
        description:
          'Click the "Send" button and wait for the transaction fee calculation. Once done, click the "Confirm" button.',
      },
      {
        number: 4,
        image: '/transferring_tokens/completeAndVerify.png',
        title: 'Complete and Verify',
        description:
          'Wait for the transfer to complete, then you will be redirected back to the balance tab. Check both your account and the recipient’s account to confirm the transaction.',
      },
    ];

export default function TransferingTokenSteps() {
  return (
    <div>
      {/* Mobile View */}
      <section className="py-16 text-white block sm:hidden">
        <div className="container mx-auto">
          <h1 className="text-[3em] leading-none font-bold mb-6 text-theme-default text-center">
            Transferring Tokens
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
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop View */}
      <section className="flex flex-nowrap py-16 px-16 text-white sm:flex hidden">
        <div className="container mx-auto">
          <h1 className="text-[4em] leading-none font-bold mb-6 text-theme-default text-center">
            Transferring Tokens
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
                  {description.split('"').map((part, i) => (
                    i % 2 === 0 ? (
                      part
                    ) : (
                      <span key={i} className="text-theme-default font-bold">{part}</span>
                    )
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
