import React, { useState } from 'react'
import { ethers } from 'ethers'

import Prescription from '../artifacts/contracts/nft/Prescription.sol/Prescription.json'
import Receipt from '../artifacts/contracts/nft/Receipt.sol/Receipt.json'
import axios from 'axios'

import { create as ipfsHttpClient } from 'ipfs-http-client'

import './Home.css';



const Home = () => {


    const [prescriptions, setPrescriptions] = useState([])
    const [receipts, setReceipts] = useState([])
    const [fileUrl, setFileUrl] = useState(null)
    const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
    const prescription = '0x28c2e12CacbeA470a68e613Ba3F4a85b8081Fc53'
    const receipt = '0x8A00C8e909F980D1D6cEC79e14e7B448953E4Dc1'


    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }

    async function mintPrescription(e){
        e.preventDefault();
        if (typeof window.ethereum !== 'undefined') {
          await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            const signer = provider.getSigner()
         
            const contract = new ethers.Contract(prescription, Prescription.abi, signer)
            const transaction = contract.create(
                    uploadJsonForPrescription(
                        e.target[0].value.toUpperCase(),        //name
                        e.target[1].value),                     //desc
                    e.target[2].value)                          //patient's wallet
        }
    }



    async function mintReceipt(e){
        e.preventDefault();

        const baseURL = `${process.env.REACT_APP_ALCHEMY}/getNFTMetadata`;
        const tokenType = "erc721";
        
        //query prescription data to be keep in receipt
        var config = {
            method: 'get',
            url: `${baseURL}?contractAddress=${prescription}&tokenId=${e.target[0].value}&tokenType=${tokenType}`,
            headers: { }
        };

        let data;
        axios(config)
        .then((response) => {
            if (!response.data.error){
                console.log('metadata',response.data)
                data = response.data.metadata
            }})
        .catch((error) => {
            console.log(error)
            });
    

        if (typeof window.ethereum !== 'undefined') {
          await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contractCreate = new ethers.Contract(receipt, Receipt.abi, signer)
            const transaction2 =  contractCreate.create(e.target[0].value,uploadJsonForReceipt(data))      
            }   
        }

    async function uploadJsonForPrescription(e1,e2) {
        const content = JSON.stringify(
            {
                "name": e1,
                "description": e2,
                "image": fileUrl
            })

        try {
          const added = await client.add(content)
          const url = `https://ipfs.infura.io/ipfs/${added.path}`
          return url
        } catch (error) {
          console.log('Error uploading file: ', error)
        }
    }


    async function uploadJsonForReceipt(data) {
        const content = JSON.stringify(
            {
            "information": data,
            "status": "receipt"
            })

        try {
            const added = await client.add(content)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            return url
            } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }




    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(
            file,
            {progress: (prog) => console.log(`received: ${prog}`)}
            )
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setFileUrl(url)
        console.log('url',added.path)
        document.getElementById("upload-nft-btn").disabled = false;

        } catch (error) {
        console.log('Error uploading file: ', error)
        }  
    }




    async function checkPrescription(e){
        e.preventDefault()
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount()
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner()
              const address = await signer.getAddress()
              const baseURL = `${process.env.REACT_APP_ALCHEMY}/getNFTs/`
            
              var config = {
                method: 'get',
                url: `${baseURL}?owner=${address}&contractAddresses[]=${prescription}`
              };
            
              axios(config)
              .then((response) => {
                let temp =[]
                response.data.ownedNfts.forEach((e)=>{
                  temp.push(e.metadata)
                })
                console.log(temp)
                setPrescriptions(temp)
              
              })
              .catch(error => console.log(error));
              
        }
       
      }

      async function checkReceipt(e){
        e.preventDefault()
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount()
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner()
              const address = await signer.getAddress()
              const baseURL = `${process.env.REACT_APP_ALCHEMY}/getNFTs/`
            
              var config = {
                method: 'get',
                url: `${baseURL}?owner=${address}&contractAddresses[]=${receipt}`
              };
            
              axios(config)
              .then((response) => {
                let temp =[]
                response.data.ownedNfts.forEach((e)=>{
                  temp.push(e.metadata)
                })
                console.log(temp)
                setReceipts(temp)
              
              })
              .catch(error => console.log(error));
              
        }
       
      }
      


  return (
    <div>
        <div className='navbar'>
        <h1>PharmaZ</h1>
        </div>


        <div className="grid-container">
                <a className="grid-item" href='#doctor'> <h5 >DOCTOR</h5> <p>👨‍⚕️</p></a>
                <a className="grid-item"  href='#patient'> <h5>PATIENT</h5><p>🙍‍♂️</p></a>
                <a className="grid-item"  href='#pharmacist'><h5>PHARMACIST</h5> <p>🧑‍⚕️</p></a>
        </div>


        <div id='doctor' className='doctor'>
        <h2>Doctor:</h2>

        
        <form onSubmit={mintPrescription}>
             <label htmlFor='date-issue'>Date of issue: </label>
             <input id='date-issue' type="datetime-local"></input><br/>
            
             <label htmlFor='patient-name'>Patient's name: </label>
             <input id='patient-name' ></input><br/>
            
             <label htmlFor='drug-name'>Drug name: </label>
             <input id='drug-name' ></input><br/>

             <label htmlFor='quantity'>Quantity prescribed: </label>
             <input id='quantity' ></input><br/>

             <label htmlFor='number-refill'>Number of refills: </label>
             <input id='number-refill' ></input><br/>

             <label htmlFor='prescriber'>Signature of prescriber: </label>
             <input id='presciber'></input><br/>


             <label htmlFor='wallet'>Patient's wallet address: </label>
            <input id='wallet'></input><br/>
            <input 
            type="file"
            name="Asset"
            className="my-4"
            onChange={onChange}
            /><br/>
            <input className='btn' type='submit' value='Create Prescription'/> <br/>
        </form>


        
        </div>

        <div id='patient' className='patient'>
            
            <h2>Patient:</h2>




        <section onClick={checkPrescription}> Prescription</section> <br/>

        {
            prescriptions.map((p,index) =>{
                console.log(p)
                let date = p.date_issue;
                let image = p.image

                return (
                    <div className ='prescription'>
                        <h3>{date}</h3>
                    <img src={image}/>
                    </div>
                )
            })

        }

        <section onClick={checkReceipt}> Receipt</section>

        {
            receipts.map((p,index) =>{
                let date = p.date_receipt
                let image = p.information

                return (
                    <div className ='receipt'>
                        <h3>{date}</h3>
                    !image.image || <img src={image.image}/>
                    </div>
                )
            })

        }
        </div>


        <div id='pharmacist' className='pharmacist'>
        <h2>Pharmacist:</h2>

        
        <form onSubmit={mintReceipt}>
            <input></input>

            <input className='btn' type='submit' value='Create Receipt'/>
        </form>
        </div>
      

        <div id='other' className='other'>

            Other <br/>
            <a href='https://github.com/patkamon/pharmaz' target="_blank">Github</a>
            <a href='https://devfolio.co/gdsc-hacknmims/dashboard' target="_blank">Devfolio</a>

        </div>




    </div>
  )
}

export default Home