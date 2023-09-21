import Image from 'next/image';
import { ButtonLink } from '../components/Button';
import { Container } from '../components/Container';
import factory_abi from '../utils/factory_abi.json';
import factory_address from '../utils/factory_address';
import child_abi from '../utils/child_abi.json';
import React, { SetStateAction, useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card"
import { clsx } from 'clsx';
import { type  Address, useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Button } from './ui/button';
import { useDisclosure } from '@chakra-ui/react'
import  {Verified} from './components/Verified';
import ErrorDialog from './components/Error';


export function VerifyCertificate() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [verifiedStatus, setVerifiedStatus] = useState(false);
    const [ErrorStatus, setErrorStatus] = useState(false);

    const [certHash, setCertHash] = useState('');
    const [allYourCert, setAllYourCert] = useState("");
    const [addr, setAddr] = useState("");
    const [childAddr, setChildAddr] = useState<any>(`0x${'string'}`);
    const [certOwnerName, setcertOwnerName] = useState("");
    const [certOwnerAddr, setcertOwnerAddr] = useState("");
    const [certId, setcertId] = useState("");
    const [certUri, setcertUri] = useState("");
    const [certIssuedTime, setcertIssuedTime] = useState("");
    
    const [verifiedCertificateData, setVerifiedCertificateData] = useState<VerifiedCertificateDetails>();
    
      // State to store the selected contract address
    const [selectedContract, setSelectedContract] = useState<string | null>(null);
    const [tokenWithdrawn, settokenWithdrawn] = useState<boolean>(false);
    
    
    const {address} = useAccount();
    
  
    // INTEGRATION TO VERIFY A CERTIFICATE USING A CERT HASH
    // it first maes a call to get the address of the company that issued the cert
    // then another call verifies the hash from the company address
    const verifyByHash = () => {
        console.log("Verifying cert by hash")
        // setVerifiedStatus(true)
        // setErrorStatus(true)
        createCertWrite?.()
        
    }
    const {data: getCompanyData, isLoading: getCompanyDataIsLoading, isError: getCompanyDataIsError} = useContractRead({
        address: factory_address,
        abi: factory_abi,
        functionName: "getUserVests",
        watch: true,
        args: [addr],
        onSuccess(data: string) {
            console.log('Success', getCompanyData)
            // setChildAddr(data);
            setContractAddresses(getCompanyData);
        },
    })
    

    const { config: CreateCertConfig } = usePrepareContractWrite({
        address: selectedContract as Address ? selectedContract as Address: " " as Address,
        abi: child_abi,
        functionName: "claimVestedTokens",
    });

    const { data: createCertData, isLoading: createCertIsLoading, isError: createCertIsError, write: createCertWrite, isSuccess: Successfully } = useContractWrite(CreateCertConfig);

    

    // // THIS WILL RETURN ALL THE CERTIFICATES A USER HAS
    // const {data: yourCert, isLoading: yourCertIsLoading, isError: yourCertIsError} = useContractRead({
    //     address: factory_address,
    //     abi: factory_abi,
    //     functionName: "getAllCertificates",
    //     args: [addr],
    // })
    
    useEffect(() => {
        
        setAddr(address || "");
    }, [addr, address])
    
    // EXTRA MODIFICATIONS


      // State for contract addresses
  const [contractAddresses, setContractAddresses] = useState<string[]>([
    '0xContractAddress1',
    '0xContractAddress2',
    '0xContractAddress3',
  ]);



  // Function to handle card click and update selectedContract state
  const handleCardClick = (contractAddress: string) => {
    setSelectedContract(contractAddress);
  };
    
    return (
        <Container className={clsx("pt-20 pb-16 lg:pt-32")}>
            {verifiedStatus && verifiedCertificateData && <Verified open={isOpen} close={onClose} data={verifiedCertificateData} />}
            {ErrorStatus && <ErrorDialog open={isOpen} close={onClose} />}
            <form className={clsx("flex flex-col gap-8 mt-4 px-8 py-8 m-auto bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl")}>
                <h2 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 ">
                    Withdraw Vested Tokens
                </h2>
                <p>
                    { contractAddresses?.length > 0 ? `Select token` : `No vested token available`}
                </p>
                <div className="space-y-2">
                    {contractAddresses?.map((contractAddress, index) => (
                    <label
                        key={index}
                        className={`block bg-white rounded-lg p-2 cursor-pointer transition ${
                        selectedContract === contractAddress
                            ? 'bg-blue-200' // Highlighted background color
                            : 'bg-gray-100' // Default background color
                        }`}
                    >
                        <input
                        type="radio"
                        name="contract"
                        value={contractAddress}
                        onChange={() => handleCardClick(contractAddress)}
                        className="hidden"
                        />
                        <div className="flex justify-between items-center">
                        <p>{`${contractAddress.slice(0, 8)} ... ${contractAddress.slice(-8)}` }</p>
                        {selectedContract === contractAddress && (
                            <span className="text-green-500">Selected</span>
                        )}
                        </div>
                    </label>
                    ))}
                </div>

                <p className='bg-zinc-50'>
                   {tokenWithdrawn ? ` TOKEN WITHDRAWN SUCESSFULLY !!!` : ""}
                </p>
                <Button type="button" disabled ={contractAddresses?.length > 0 ? false : true} onClick={verifyByHash}>Withdraw Tokens</Button>
                <p>
                    {Successfully ? `WITHDRAWAL SUCCESFUL` : ''}
                </p>
                </form> 
        </Container>
    );
}

export type VerifiedCertificateDetails = 
{ 
    Name: string, 
    addr: Address, 
    certificateId: 0n, 
    certificateUri: string, 
    issuedTime: number; 
}