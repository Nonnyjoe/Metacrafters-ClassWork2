import Image from 'next/image';
import { Container } from '../components/Container';
import factory_abi from '../utils/factory_abi.json';
import factory_address from '../utils/factory_address';
import { shortenHex } from "../utils/ShortenHex";

import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Button } from './ui/button';


export function CreateCertificate() {

    const [certName, setCertName] = useState('');
    const [certSymbol, setCertSymbol] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [duration, setDuration] = useState(0);
    const [singleAccount, setSingleAccount] = useState("");
    const [addr, setAddr] = useState("");
    const [done, setdone] = useState<Boolean>(false);
    const [connectedAddr, setConnectedAddr] = useState("");



    const { address } = useAccount();


    const CreateCert = () => {
        console.log("creating company");
        createCertWrite?.();
    };

    const { config: CreateCertConfig } = usePrepareContractWrite({
        address: factory_address,
        abi: factory_abi,
        functionName: "createOrganization",
        args: [certName, certSymbol, duration, tokenAddress],
    });

    const { data: createCertData, isLoading: createCertIsLoading, isError: createCertIsError, write: createCertWrite } = useContractWrite(CreateCertConfig);


    const { data: certAddr, isLoading: yourCertIsLoading, isError: yourCertIsError } = useContractRead({
        address: factory_address,
        abi: factory_abi,
        functionName: "getOrganization",
        args: [connectedAddr ?? "0x00"],
    });

    useEffect(() => {

        setConnectedAddr(address);
        console.log(`final child addr:`, certAddr);
        setSingleAccount(certAddr);

    }, [address, certAddr, connectedAddr]);


    return (
        <Container className={clsx("pt-20 pb-16 lg:pt-32")}>
            <form className={clsx("flex flex-col gap-8 mt-4 px-8 py-8 m-auto bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl")}>
                <h2 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 ">
                    Create Company
                </h2>

                <div className='space-y-4'>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="cert_name">Company Name</label>
                        <input
                            type="text"
                            name="cert_name"
                            id=""
                            onChange={(e) => { setCertName(e.target.value); }}
                            className='w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="cert_symbol">Company Symbol</label>
                        <input
                            type="text"
                            name="cert_symbol"
                            id=""
                            onChange={(e) => { setCertSymbol(e.target.value); }}
                            className='w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 '
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="token_address">Token Address</label>
                        <input
                            type="text"
                            name="token_address"
                            id=""
                            onChange={(e) => { setTokenAddress(e.target.value); }}
                            className='w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 '
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="duration">Token Initial Supply</label>
                        <input
                            type="number"
                            name="duration"
                            id=""
                            onChange={(e) => { setDuration(Number(e.target.value)); }}
                            className='w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 '
                        />
                    </div>
                </div>
                <Button type='button' className='max-w-max ml-auto' onClick={CreateCert}>
                    Create Company</Button>
            </form>
        </Container>
    );
}
