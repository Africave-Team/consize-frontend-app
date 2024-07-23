import React from 'react'
import { GoDotFill } from 'react-icons/go'

export default function page () {
  return (
    <div className='w-screen flex'>
      <div className='md:w-1/6 w-0'></div>
      <div className='flex-1 px-4 md:px-0'>
        <div className='h-40 py-10'>
          <div className='font-bold text-3xl'>TERMS AND CONDITIONS</div>
          <div className='w-72 flex items-center rounded-md px-3 h-11 mt-4 bg-gray-100'>
            Last updated: 23rd July, 2024
          </div>
        </div>
        <div className='font-medium'>
          Scope of services:
        </div>
        <div className='py-2'>
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>Consize will provide access to its WhatsApp-based learning platform as described in the proposal.</div>
          </div>
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>Services include course creation, deployment, analytics, and certification features based on the selected plan.</div>
          </div>
        </div>
        <div className='font-medium'>
          Use of Platform:
        </div>
        <div className="py-2">
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>The client agrees to use the platform solely for educational purposes as intended by Consize.</div>
          </div>
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>The client is responsible for ensuring that all content uploaded or created on the platform complies with intellectual property rights and does not infringe upon any third-party rights.</div>
          </div>
        </div>

        <div className='font-medium'>
          Access and Accounts:
        </div>
        <div className="py-2">
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>The client will receive login credentials for administrative access to the Consize platform.</div>
          </div>
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>The number of administrative seats provided will depend on the selected pricing plan.</div>
          </div>
        </div>

        <div className='font-medium'>
          Payment Terms:
        </div>
        <div className="py-2">
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>Payment is due monthly in advance, beginning from the date of account activation.</div>
          </div>
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>Late payments may incur penalties or suspension of services at Consize’s discretion.</div>
          </div>
        </div>

        <div className='font-medium'>
          Cancellation and Termination:
        </div>
        <div className="py-2">
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>Either party may terminate the agreement with 30 days’ written notice.</div>
          </div>
          <div className='flex gap-1
           items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>Unused prepaid fees are non-refundable upon termination.</div>
          </div>
        </div>

        <div className='font-medium'>
          Data Security and Privacy:
        </div>
        <div className="py-2">
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>Consize will take reasonable measures to secure client data and maintain confidentiality.</div>
          </div>
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>Data collected through the platform will be used solely for operational purposes and will not be shared with third parties without consent, except as required by law.</div>
          </div>
          <div className='flex gap-1 items-start'>
            <div>
              <GoDotFill className='mt-1' />
            </div>
            <div>The ownership of the courses uploaded or created by the client onto the Consize platform lies completely with the client and Consize shall not use them without explicit permission</div>
          </div>
        </div>

        <div className='font-medium'>
          Support Services:
        </div>
        <div className="py-2">
          <div className='flex gap-1 items-start'>
            <GoDotFill className='mt-1' />
            <div>
              Consize will provide technical support and assistance during normal business hours via email or the platform’s support chat feature.
            </div>
          </div>
          <div className='flex gap-1 items-start'>
            <GoDotFill className='mt-1' />
            <div>
              Response times and service level agreements (SLAs) will be detailed separately.
            </div>
          </div>
        </div>




        <div className='h-40'></div>
      </div>
      <div className='md:w-1/6 w-0'></div>
    </div>
  )
}
