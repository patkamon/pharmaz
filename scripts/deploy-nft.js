const { ethers } = require("hardhat");

async function main() {
    const [ deployer ] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const Prescription = await ethers.getContractFactory("Prescription");
    const prescription = await Prescription.deploy();
    await prescription.deployed();
    console.log("Prescription deployed to:", prescription.address);

    const Receipt = await ethers.getContractFactory("Receipt");
    const receipt = await Receipt.deploy(prescription.address);
    await receipt.deployed();
    console.log("Receipt deployed to:", receipt.address);

    console.log("======================================");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });