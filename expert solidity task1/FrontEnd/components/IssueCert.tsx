import { Container } from '../components/Container';
import child_abi from '../utils/child_abi.json';
import factory_abi from '../utils/factory_abi.json';
import factory_address from '../utils/factory_address';
import main from '../utils/ipfs.mjs';

import React, { useEffect, useState } from 'react';

import { clsx } from 'clsx';
import { Address, useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Button } from './ui/button';
// import { Button } from 'react-day-picker';


export function IssueCertificate() {

    const [userName, setUserName] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [tokenAmount, setTokenAmount] = useState(0);
    const [duration, setDuration] = useState(0);

    const [singleAccount, setSingleAccount] = useState<Address>();
    const [connectedAddr, setConnectedAddr] = useState("");


    const { address } = useAccount();


    const IssueCert = async () => {
        console.log("creating vest");
        issueCertWrite?.();
    };

    const { config: IssueCertConfig } = usePrepareContractWrite({
        address: singleAccount,
        abi: child_abi,
        functionName: "addMember",
        args: [userName, userAddress as Address, tokenAmount, duration],
    });

    const { data: issueCertData, isLoading: issueCertIsLoading, isError: issueCertIsError, write: issueCertWrite, isSuccess: Successfully } = useContractWrite(IssueCertConfig);


    const { data: certAddr, isLoading: yourCertIsLoading, isError: yourCertIsError } = useContractRead({
        address: factory_address,
        abi: factory_abi,
        functionName: "getOrganization",
        args: [connectedAddr ?? "0x00"],
    });

    useEffect(() => {

        setConnectedAddr(address as Address);
        console.log(`final child addr:`, certAddr);
        setSingleAccount(certAddr as Address);

    }, [address, certAddr, connectedAddr]);


    return (
        <Container className="pt-20 pb-16 lg:pt-32">
            <form className={clsx("flex flex-col gap-8 mt-4 px-8 py-8 m-auto bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl")}>
                <h2 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 ">
                    Add User
                </h2>

                <div className='space-y-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="cert_name">User Role</label>
                        <input
                            type="text"
                            name="username"
                            id=""
                            onChange={(e) => { setUserName(e.target.value); }}
                            className='w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="cert_name">User Address</label>
                        <input
                            type="text"
                            name="userAddress"
                            id=""
                            onChange={(e) => { setUserAddress(e.target.value); }}
                            className='w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="token_amount">Token Amount</label>
                        <input
                            type="number"
                            name="token_amount"
                            id=""
                            onChange={(e) => { setTokenAmount(Number(e.target.value)); }}
                            className='w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 '
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="duration">Vest Duration</label>
                        <input
                            type="number"
                            name="duration"
                            id=""
                            onChange={(e) => { setDuration(Number(e.target.value)); }}
                            className='w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 '
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <Button type='button' onClick={IssueCert} disabled={false}>Add User</Button>
                </div>
                <p className='green'>
                    {Successfully ? `VESTING SUCCESFUL` : ''}
                </p>

            </form>
        </Container>
    );
}
